import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { BadgeCheck, Check, CreditCard, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { requireSupabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Hotel = Database['public']['Tables']['hotels']['Row'];
type Plan = Database['public']['Tables']['hotel_subscription_plans']['Row'];
type Subscription = Database['public']['Tables']['hotel_subscriptions']['Row'];
type Payment = Database['public']['Tables']['hotel_subscription_payments']['Row'];
type PaymentSettings = Database['public']['Tables']['platform_payment_settings']['Row'];

interface SubscriptionManagementProps {
  hotels: Hotel[];
  revision: number;
  busy: boolean;
  runAction: (action: () => Promise<void>, successMessage: string) => Promise<void>;
}

const blankSettings: PaymentSettings = {
  id: true,
  mtn_momo_number: '',
  mtn_momo_name: '',
  orange_money_number: '',
  orange_money_name: '',
  updated_at: '',
};

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ hotels, revision, busy, runAction }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [hotelNames, setHotelNames] = useState<Record<string, string>>({});
  const [hotelOwners, setHotelOwners] = useState<Record<string, string>>({});
  const [ownerNames, setOwnerNames] = useState<Record<string, string>>({});
  const [settings, setSettings] = useState<PaymentSettings>(blankSettings);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [provider, setProvider] = useState<'mtn_momo' | 'orange_money'>('mtn_momo');
  const [payerPhone, setPayerPhone] = useState(user?.phone ?? '');
  const [transactionReference, setTransactionReference] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [planValues, setPlanValues] = useState<Record<string, Partial<Plan>>>({});

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const client = requireSupabase();
      const [{ data: planRows, error: plansError }, { data: settingRows, error: settingsError }] = await Promise.all([
        client.from('hotel_subscription_plans').select('*').order('sort_order', { ascending: true }),
        client.from('platform_payment_settings').select('*').eq('id', true).maybeSingle(),
      ]);
      if (plansError) throw plansError;
      if (settingsError) throw settingsError;
      setPlans(planRows ?? []);
      setSelectedPlanId(current => current || planRows?.find(plan => plan.is_active)?.id || '');
      setSettings(settingRows ?? blankSettings);

      if (isAdmin) {
        const { data: paymentRows, error: paymentsError } = await client
          .from('hotel_subscription_payments').select('*').order('submitted_at', { ascending: false });
        if (paymentsError) throw paymentsError;
        setPayments(paymentRows ?? []);
        const hotelIds = [...new Set((paymentRows ?? []).map(payment => payment.hotel_id))];
        if (hotelIds.length) {
          const { data: hotelRows, error: hotelsError } = await client.from('hotels').select('id,name,owner_id').in('id', hotelIds);
          if (hotelsError) throw hotelsError;
          setHotelNames(Object.fromEntries((hotelRows ?? []).map(hotel => [hotel.id, hotel.name])));
          setHotelOwners(Object.fromEntries((hotelRows ?? []).map(hotel => [hotel.id, hotel.owner_id])));
          const ownerIds = [...new Set((hotelRows ?? []).map(hotel => hotel.owner_id))];
          if (ownerIds.length) {
            const { data: profiles, error: profilesError } = await client.from('profiles').select('id,first_name,last_name,email').in('id', ownerIds);
            if (profilesError) throw profilesError;
            setOwnerNames(Object.fromEntries((profiles ?? []).map(profile => [
              profile.id,
              `${profile.first_name} ${profile.last_name}`.trim() || profile.email,
            ])));
          }
        } else {
          setHotelNames({});
          setHotelOwners({});
          setOwnerNames({});
        }
      } else {
        const hotelIds = hotels.map(hotel => hotel.id);
        if (hotelIds.length) {
          const [{ data: subscriptionRows, error: subscriptionsError }, { data: paymentRows, error: paymentsError }] = await Promise.all([
            client.from('hotel_subscriptions').select('*').in('hotel_id', hotelIds),
            client.from('hotel_subscription_payments').select('*').in('hotel_id', hotelIds).order('submitted_at', { ascending: false }),
          ]);
          if (subscriptionsError) throw subscriptionsError;
          if (paymentsError) throw paymentsError;
          setSubscriptions(subscriptionRows ?? []);
          setPayments(paymentRows ?? []);
        } else {
          setSubscriptions([]);
          setPayments([]);
        }
      }
    } catch (loadError) {
      console.error('Échec du chargement des abonnements:', loadError);
      setError(loadError instanceof Error ? loadError.message : String(loadError));
    } finally {
      setLoading(false);
    }
  }, [hotels, isAdmin, user]);

  useEffect(() => {
    void loadData();
  }, [loadData, revision]);

  useEffect(() => {
    setSelectedHotelId(current => current || hotels[0]?.id || '');
  }, [hotels]);

  const currentPlan = (planId: string) => plans.find(plan => plan.id === planId);
  const submitPayment = (event: FormEvent) => {
    event.preventDefault();
    void runAction(async () => {
      const { error } = await requireSupabase().rpc('submit_hotel_subscription_payment', {
        p_hotel_id: selectedHotelId,
        p_plan_id: selectedPlanId,
        p_billing_cycle: billingCycle,
        p_provider: provider,
        p_payer_phone: payerPhone.trim(),
        p_transaction_reference: transactionReference.trim(),
      });
      if (error) throw error;
      setTransactionReference('');
    }, 'La référence a été transmise. Votre formule sera activée après vérification du paiement.');
  };

  const reviewPayment = (paymentId: string, approve: boolean) => {
    const prompt = approve
      ? 'Confirmez-vous avoir vérifié ce transfert Mobile Money dans le compte de collecte ?'
      : 'Refuser cette demande de paiement ?';
    if (!window.confirm(prompt)) return;
    void runAction(async () => {
      const { error } = await requireSupabase().rpc('review_hotel_subscription_payment', {
        p_payment_id: paymentId,
        p_approve: approve,
        p_notes: null,
      });
      if (error) throw error;
    }, approve ? 'Paiement confirmé et abonnement activé.' : 'Demande de paiement refusée.');
  };

  const savePlan = (event: FormEvent, plan: Plan) => {
    event.preventDefault();
    const values = { ...plan, ...(planValues[plan.id] ?? {}) };
    const monthlyPrice = values.monthly_price_xaf == null ? null : Number(values.monthly_price_xaf);
    const yearlyPrice = values.yearly_price_xaf == null ? null : Number(values.yearly_price_xaf);
    if (values.is_active && !(Number(monthlyPrice) > 0 || Number(yearlyPrice) > 0)) {
      setError('Renseignez au moins un tarif mensuel ou annuel positif avant d’activer une formule.');
      return;
    }
    void runAction(async () => {
      const { error } = await requireSupabase().from('hotel_subscription_plans').update({
        name: values.name,
        description: values.description,
        monthly_price_xaf: monthlyPrice,
        yearly_price_xaf: yearlyPrice,
        max_rooms: Number(values.max_rooms),
        max_photos: Number(values.max_photos),
        priority_listing: Boolean(values.priority_listing),
        featured_listing: Boolean(values.featured_listing),
        is_active: Boolean(values.is_active),
        updated_at: new Date().toISOString(),
      }).eq('id', plan.id);
      if (error) throw error;
    }, `La formule ${plan.name} a été enregistrée.`);
  };

  const savePaymentSettings = (event: FormEvent) => {
    event.preventDefault();
    void runAction(async () => {
      const { error } = await requireSupabase().from('platform_payment_settings').update({
        mtn_momo_number: settings.mtn_momo_number.trim(),
        mtn_momo_name: settings.mtn_momo_name.trim(),
        orange_money_number: settings.orange_money_number.trim(),
        orange_money_name: settings.orange_money_name.trim(),
        updated_at: new Date().toISOString(),
      }).eq('id', true);
      if (error) throw error;
    }, 'Les coordonnées de collecte ont été enregistrées.');
  };

  const selectedPlan = plans.find(plan => plan.id === selectedPlanId);
  const destination = provider === 'mtn_momo'
    ? { number: settings.mtn_momo_number, name: settings.mtn_momo_name, label: 'MTN Mobile Money' }
    : { number: settings.orange_money_number, name: settings.orange_money_name, label: 'Orange Money' };
  const amount = selectedPlan
    ? (billingCycle === 'monthly' ? selectedPlan.monthly_price_xaf : selectedPlan.yearly_price_xaf)
    : null;

  if (loading) return <p role="status" className="page-card p-6 text-sm text-[#68736b]">Chargement des formules et paiements…</p>;

  return (
    <section className="page-card space-y-6 p-6 sm:p-8">
      <div>
        <h2 className="text-xl font-semibold">{isAdmin ? 'Formules et abonnements' : 'Abonnement et visibilité'}</h2>
        <p className="mt-1 text-sm leading-6 text-[#68736b]">
          Les paiements Mobile Money sont vérifiés manuellement ; une demande reste en attente et n’active pas la formule avant confirmation.
        </p>
      </div>
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

      {isAdmin ? (
        <>
          <div className="grid gap-4 xl:grid-cols-3">
            {plans.map(plan => {
              const values = { ...plan, ...(planValues[plan.id] ?? {}) };
              return (
                <form key={plan.id} onSubmit={event => savePlan(event, plan)} className="rounded-xl border border-[#e8e7e0] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{plan.name}</h3>
                    <label className="flex items-center gap-2 text-xs font-medium">
                      <input type="checkbox" checked={Boolean(values.is_active)} onChange={event => setPlanValues(current => ({ ...current, [plan.id]: { ...current[plan.id], is_active: event.target.checked } }))} />
                      Active
                    </label>
                  </div>
                  <label className="mt-4 grid gap-1 text-sm">Nom
                    <input className="input" value={values.name} onChange={event => setPlanValues(current => ({ ...current, [plan.id]: { ...current[plan.id], name: event.target.value } }))} />
                  </label>
                  <label className="mt-3 grid gap-1 text-sm">Description
                    <textarea className="input min-h-20" value={values.description} onChange={event => setPlanValues(current => ({ ...current, [plan.id]: { ...current[plan.id], description: event.target.value } }))} />
                  </label>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <label className="grid gap-1 text-sm">Mensuel (XAF)
                      <input className="input" type="number" min="0" value={values.monthly_price_xaf ?? ''} onChange={event => setPlanValues(current => ({ ...current, [plan.id]: { ...current[plan.id], monthly_price_xaf: event.target.value === '' ? null : Number(event.target.value) } }))} />
                    </label>
                    <label className="grid gap-1 text-sm">Annuel (XAF)
                      <input className="input" type="number" min="0" value={values.yearly_price_xaf ?? ''} onChange={event => setPlanValues(current => ({ ...current, [plan.id]: { ...current[plan.id], yearly_price_xaf: event.target.value === '' ? null : Number(event.target.value) } }))} />
                    </label>
                    <label className="grid gap-1 text-sm">Types de chambres max.
                      <input className="input" type="number" min="1" value={values.max_rooms} onChange={event => setPlanValues(current => ({ ...current, [plan.id]: { ...current[plan.id], max_rooms: Number(event.target.value) } }))} />
                    </label>
                    <label className="grid gap-1 text-sm">Photos max.
                      <input className="input" type="number" min="1" value={values.max_photos} onChange={event => setPlanValues(current => ({ ...current, [plan.id]: { ...current[plan.id], max_photos: Number(event.target.value) } }))} />
                    </label>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm">
                    {([
                      ['priority_listing', 'Priorité dans les résultats'],
                      ['featured_listing', 'Mise en avant'],
                    ] as const).map(([field, label]) => (
                      <label key={field} className="flex items-center gap-2">
                        <input type="checkbox" checked={Boolean(values[field])} onChange={event => setPlanValues(current => ({ ...current, [plan.id]: { ...current[plan.id], [field]: event.target.checked } }))} />
                        {label}
                      </label>
                    ))}
                  </div>
                  <button className="btn-primary mt-4 w-full" disabled={busy} type="submit"><Save aria-hidden="true" className="h-4 w-4" /> Enregistrer la formule</button>
                </form>
              );
            })}
          </div>

          <form onSubmit={savePaymentSettings} className="rounded-xl border border-[#e8e7e0] p-4 sm:p-5">
            <h3 className="font-semibold">Coordonnées Mobile Money de collecte</h3>
            <p className="mt-1 text-sm text-[#68736b]">Ces coordonnées sont communiquées aux hôteliers avant qu’ils déclarent leur référence de transfert.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm">Numéro MTN MoMo<input className="input" type="tel" value={settings.mtn_momo_number} onChange={event => setSettings(current => ({ ...current, mtn_momo_number: event.target.value }))} /></label>
              <label className="grid gap-1 text-sm">Nom du bénéficiaire MTN<input className="input" value={settings.mtn_momo_name} onChange={event => setSettings(current => ({ ...current, mtn_momo_name: event.target.value }))} /></label>
              <label className="grid gap-1 text-sm">Numéro Orange Money<input className="input" type="tel" value={settings.orange_money_number} onChange={event => setSettings(current => ({ ...current, orange_money_number: event.target.value }))} /></label>
              <label className="grid gap-1 text-sm">Nom du bénéficiaire Orange<input className="input" value={settings.orange_money_name} onChange={event => setSettings(current => ({ ...current, orange_money_name: event.target.value }))} /></label>
            </div>
            <button className="btn-primary mt-4" disabled={busy} type="submit"><Save aria-hidden="true" className="h-4 w-4" /> Enregistrer les coordonnées</button>
          </form>

          <div>
            <h3 className="font-semibold">Demandes de paiement à vérifier</h3>
            <div className="mt-3 space-y-3">
              {payments.length ? payments.map(payment => {
                const plan = currentPlan(payment.plan_id);
                return (
                  <article key={payment.id} className="rounded-xl border border-[#e8e7e0] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold">{hotelNames[payment.hotel_id] ?? payment.hotel_id}</p>
                        <p className="text-sm text-[#68736b]">{ownerNames[hotelOwners[payment.hotel_id] ?? ''] ?? ''} · {plan?.name ?? 'Formule'} · {payment.billing_cycle === 'monthly' ? 'mensuel' : 'annuel'}</p>
                        <p className="mt-1 text-sm">{payment.amount_xaf.toLocaleString()} XAF · {payment.provider === 'mtn_momo' ? 'MTN MoMo' : 'Orange Money'} · référence {payment.transaction_reference}</p>
                        <p className="text-sm text-[#68736b]">Payeur : {payment.payer_phone} · soumis le {new Date(payment.submitted_at).toLocaleString('fr-FR')}</p>
                        <p className="mt-1 text-xs font-semibold capitalize">État : {payment.status}</p>
                      </div>
                      {payment.status === 'pending' && <div className="flex flex-wrap gap-2">
                        <button type="button" className="btn-primary" disabled={busy} onClick={() => reviewPayment(payment.id, true)}><Check aria-hidden="true" className="h-4 w-4" /> Confirmer le transfert</button>
                        <button type="button" className="btn-secondary" disabled={busy} onClick={() => reviewPayment(payment.id, false)}><X aria-hidden="true" className="h-4 w-4" /> Refuser</button>
                      </div>}
                    </div>
                  </article>
                );
              }) : <p className="rounded-xl bg-[#f5f1e8] p-4 text-sm text-[#5c4324]">Aucune demande de paiement.</p>}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {hotels.map(hotel => {
              const subscription = subscriptions.find(item => item.hotel_id === hotel.id);
              const plan = subscription ? currentPlan(subscription.plan_id) : undefined;
              const isCurrent = subscription?.status === 'active' && new Date(subscription.current_period_end) > new Date();
              return (
                <article key={hotel.id} className="rounded-xl border border-[#e8e7e0] p-4">
                  <p className="font-semibold">{hotel.name}</p>
                  <p className="mt-1 text-sm text-[#68736b]">
                    {isCurrent ? `${plan?.name ?? 'Formule active'} · actif jusqu’au ${new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}` : 'Aucune formule payante active'}
                  </p>
                </article>
              );
            })}
          </div>

          {!hotels.length ? (
            <p className="rounded-xl bg-[#f5f1e8] p-4 text-sm text-[#5c4324]">Ajoutez un établissement pour choisir une formule.</p>
          ) : !plans.some(plan => plan.is_active && ((plan.monthly_price_xaf ?? 0) > 0 || (plan.yearly_price_xaf ?? 0) > 0)) ? (
            <p className="rounded-xl bg-[#f5f1e8] p-4 text-sm text-[#5c4324]">Les formules et leurs tarifs seront proposés ici dès que l’administration les aura configurés.</p>
          ) : (
            <form className="grid gap-4 rounded-xl border border-[#e8e7e0] p-4 sm:p-5" onSubmit={submitPayment}>
              <h3 className="font-semibold">Choisir ou renouveler une formule</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm">Établissement
                  <select className="input" required value={selectedHotelId} onChange={event => setSelectedHotelId(event.target.value)}>
                    {hotels.map(hotel => <option key={hotel.id} value={hotel.id}>{hotel.name}</option>)}
                  </select>
                </label>
                <label className="grid gap-1 text-sm">Formule
                  <select className="input" required value={selectedPlanId} onChange={event => setSelectedPlanId(event.target.value)}>
                    <option value="">Sélectionner une formule</option>
                    {plans.filter(plan => plan.is_active).map(plan => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
                  </select>
                </label>
                <label className="grid gap-1 text-sm">Fréquence
                  <select className="input" value={billingCycle} onChange={event => setBillingCycle(event.target.value as 'monthly' | 'yearly')}>
                    <option value="monthly">Mensuelle</option><option value="yearly">Annuelle</option>
                  </select>
                </label>
                <label className="grid gap-1 text-sm">Moyen de paiement
                  <select className="input" value={provider} onChange={event => setProvider(event.target.value as 'mtn_momo' | 'orange_money')}>
                    <option value="mtn_momo">MTN Mobile Money</option><option value="orange_money">Orange Money</option>
                  </select>
                </label>
              </div>
              {selectedPlan && (
                <div className="rounded-xl bg-[#f5f1e8] p-4 text-sm">
                  <p className="font-semibold">{selectedPlan.description}</p>
                  <p className="mt-1">{selectedPlan.max_rooms} types de chambres · {selectedPlan.max_photos} photos maximum</p>
                  <p>{[selectedPlan.priority_listing && 'Priorité dans les résultats', selectedPlan.featured_listing && 'Mise en avant'].filter(Boolean).join(' · ') || 'Options essentielles'}</p>
                  <p className="mt-2 font-semibold">{amount ? `${amount.toLocaleString()} XAF` : 'Cette fréquence n’est pas disponible'} / {billingCycle === 'monthly' ? 'mois' : 'an'}</p>
                </div>
              )}
              {destination.number ? (
                <div className="rounded-xl border border-[#e8e7e0] p-4 text-sm">
                  <p>Transférez le montant indiqué vers <strong>{destination.label}</strong> :</p>
                  <p className="mt-1 text-lg font-semibold">{destination.number}</p>
                  {destination.name && <p>Bénéficiaire : {destination.name}</p>}
                  <p className="mt-2 text-[#68736b]">Après le transfert, renseignez la référence de transaction ci-dessous. La formule sera activée après vérification par l’administration.</p>
                </div>
              ) : <p className="rounded-xl bg-[#f5f1e8] p-4 text-sm text-[#5c4324]">L’administration n’a pas encore renseigné les coordonnées de ce moyen de paiement.</p>}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm">Téléphone utilisé pour le paiement<input className="input" type="tel" required value={payerPhone} onChange={event => setPayerPhone(event.target.value)} /></label>
                <label className="grid gap-1 text-sm">Référence de la transaction<input className="input" required value={transactionReference} onChange={event => setTransactionReference(event.target.value)} /></label>
              </div>
              <button className="btn-primary w-full sm:w-fit" disabled={busy || !destination.number || !selectedHotelId || !selectedPlanId || !amount}>
                <CreditCard aria-hidden="true" className="h-4 w-4" /> Déclarer le paiement
              </button>
            </form>
          )}

          <div>
            <h3 className="font-semibold">Historique des paiements</h3>
            {payments.length ? (
              <div className="mt-3 divide-y divide-[#e8e7e0] rounded-xl border border-[#e8e7e0] px-4">
                {payments.map(payment => (
                  <div key={payment.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                    <span>{currentPlan(payment.plan_id)?.name ?? 'Formule'} · {payment.amount_xaf.toLocaleString()} XAF · {new Date(payment.submitted_at).toLocaleDateString('fr-FR')}</span>
                    <span className="inline-flex items-center gap-1 capitalize text-[#68736b]">
                      {payment.status === 'approved' ? <BadgeCheck aria-hidden="true" className="h-4 w-4 text-green-700" /> : null}
                      {payment.status === 'pending' ? 'En vérification' : payment.status === 'approved' ? 'Confirmé' : 'Refusé'}
                    </span>
                  </div>
                ))}
              </div>
            ) : <p className="mt-3 text-sm text-[#68736b]">Aucun paiement déclaré.</p>}
          </div>
        </>
      )}
    </section>
  );
};

export default SubscriptionManagement;
