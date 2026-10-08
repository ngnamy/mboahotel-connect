import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, Clock3, Plus, X } from 'lucide-react';
import PageIntro from '../components/PageIntro';
import { useAuth } from '../contexts/AuthContext';
import { requireSupabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import HotelierWorkspace from './HotelierWorkspace';
import SubscriptionManagement from './SubscriptionManagement';

type Application = Database['public']['Tables']['partner_applications']['Row'];
type Hotel = Database['public']['Tables']['hotels']['Row'];
type Room = Database['public']['Tables']['hotel_rooms']['Row'];

const errorMessage = (error: unknown) => error instanceof Error ? error.message : String(error);

const Dashboard: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicantDetails, setApplicantDetails] = useState<Record<string, { name: string; email: string }>>({});
  const [reviewHotels, setReviewHotels] = useState<Hotel[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [revision, setRevision] = useState(0);
  const [businessName, setBusinessName] = useState('');
  const [businessCity, setBusinessCity] = useState('');
  const [businessPhone, setBusinessPhone] = useState(user?.phone ?? '');
  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const client = requireSupabase();
      if (user.role === 'admin') {
        const [{ data, error: applicationsError }, { data: hotelsData, error: hotelsError }] = await Promise.all([
          client
          .from('partner_applications')
          .select('*')
          .order('submitted_at', { ascending: false }),
          client
            .from('hotels')
            .select('*')
            .order('created_at', { ascending: false }),
        ]);
        if (applicationsError) throw applicationsError;
        if (hotelsError) throw hotelsError;
        setApplications(data ?? []);
        setReviewHotels(hotelsData ?? []);
        if (data?.length) {
          const { data: profiles, error: profilesError } = await client
            .from('profiles')
            .select('id,email,first_name,last_name')
            .in('id', data.map(application => application.user_id));
          if (profilesError) throw profilesError;
          setApplicantDetails(Object.fromEntries((profiles ?? []).map(profile => [
            profile.id,
            { name: `${profile.first_name} ${profile.last_name}`.trim(), email: profile.email },
          ])));
        } else {
          setApplicantDetails({});
        }
      } else if (user.role === 'hotelier') {
        const { data, error: queryError } = await client
          .from('hotels')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });
        if (queryError) throw queryError;
        const ownedHotels = data ?? [];
        setHotels(ownedHotels);
        if (ownedHotels.length) {
          const { data: roomData, error: roomsError } = await client
            .from('hotel_rooms')
            .select('*')
            .in('hotel_id', ownedHotels.map(hotel => hotel.id))
            .order('created_at', { ascending: false });
          if (roomsError) throw roomsError;
          setRooms(roomData ?? []);
        } else {
          setRooms([]);
        }
      }
    } catch (loadError) {
      console.error('Échec du chargement du tableau de bord:', loadError);
      setError(`Impossible de charger les données : ${errorMessage(loadError)}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadData();
  }, [loadData, revision]);

  const runAction = async (action: () => Promise<void>, successMessage: string) => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await action();
      setMessage(successMessage);
      setRevision(value => value + 1);
    } catch (actionError) {
      console.error('Échec de la mise à jour du tableau de bord:', actionError);
      setError(errorMessage(actionError));
    } finally {
      setBusy(false);
    }
  };

  const submitApplication = (event: FormEvent) => {
    event.preventDefault();
    void runAction(async () => {
      const { error: rpcError } = await requireSupabase().rpc('submit_hotelier_application', {
        p_business_name: businessName.trim(),
        p_city: businessCity.trim(),
        p_phone: businessPhone.trim(),
      });
      if (rpcError) throw rpcError;
      await refreshProfile();
    }, 'Votre demande partenaire a été envoyée.');
  };

  const reviewApplication = (applicationId: string, approve: boolean) => {
    void runAction(async () => {
      const { error: rpcError } = await requireSupabase().rpc('review_hotelier_application', {
        p_application_id: applicationId,
        p_approve: approve,
        p_notes: null,
      });
      if (rpcError) throw rpcError;
    }, approve ? 'Le compte hôtelier a été approuvé.' : 'La demande a été refusée.');
  };

  const reviewHotel = (hotelId: string, approve: boolean) => {
    void runAction(async () => {
      const { error: rpcError } = await requireSupabase().rpc('review_hotel_publication', {
        p_hotel_id: hotelId,
        p_approve: approve,
      });
      if (rpcError) throw rpcError;
    }, approve ? 'L’établissement est maintenant publié.' : 'L’établissement a été refusé et ne sera pas visible publiquement.');
  };

  if (!user) return null;

  return (
    <div className="page-shell">
      <Helmet>
        <title>{user.role === 'admin' ? 'Administration' : 'Espace partenaire'} | MboaHotel Connect</title>
      </Helmet>
      <div className="page-container">
        <PageIntro
          eyebrow={user.role === 'admin' ? 'Administration' : 'Espace partenaire'}
          title={user.role === 'admin' ? 'Demandes partenaires' : 'Votre tableau de bord'}
          description={user.role === 'admin'
            ? 'Examinez les demandes et accordez l’accès hôtelier après vérification.'
            : user.role === 'hotelier'
              ? 'Gérez vos établissements et leurs types de chambres.'
              : 'Soumettez une demande pour ouvrir votre espace de gestion hôtelière.'}
        />

        {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        {message && <p role="status" className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">{message}</p>}

        {loading ? (
          <p role="status" className="text-sm text-[#68736b]">Chargement des données…</p>
        ) : user.role === 'admin' ? (
          <section className="space-y-4">
            {applications.length === 0 ? (
              <div className="page-card p-6 text-sm text-[#68736b]">Aucune demande partenaire à traiter.</div>
            ) : applications.map(application => (
              <article key={application.id} className="page-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-[#17251f]">{application.business_name}</h2>
                  <p className="mt-1 text-sm text-[#68736b]">{application.city} · {application.phone}</p>
                  <p className="mt-1 text-sm text-[#68736b]">{applicantDetails[application.user_id]?.name || applicantDetails[application.user_id]?.email || application.user_id}</p>
                  <p className="mt-1 text-xs text-[#68736b]">État : {application.status} · Soumise le {new Date(application.submitted_at).toLocaleDateString('fr-FR')}</p>
                </div>
                {application.status === 'pending' && (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => reviewApplication(application.id, true)} className="btn-primary">
                      <Check aria-hidden="true" className="h-4 w-4" /> Approuver
                    </button>
                    <button type="button" disabled={busy} onClick={() => reviewApplication(application.id, false)} className="btn-secondary">
                      <X aria-hidden="true" className="h-4 w-4" /> Refuser
                    </button>
                  </div>
                )}
              </article>
            ))}
            <div className="pt-6">
              <h2 className="section-title">Établissements à vérifier</h2>
              <p className="mt-1 text-sm text-[#68736b]">Seuls les établissements approuvés sont visibles publiquement.</p>
            </div>
            {reviewHotels.length === 0 ? (
              <div className="page-card p-6 text-sm text-[#68736b]">Aucun établissement soumis pour le moment.</div>
            ) : reviewHotels.map(hotel => (
              <article key={hotel.id} className="page-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-[#17251f]">{hotel.name}</h3>
                  <p className="mt-1 text-sm text-[#68736b]">{hotel.address}, {hotel.city} · {hotel.region}</p>
                  <p className="mt-1 text-sm text-[#68736b]">{hotel.phone} · {hotel.email}</p>
                  <p className="mt-1 text-xs text-[#68736b]">Soumis le {new Date(hotel.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                {hotel.status === 'pending' || hotel.status === 'rejected' ? (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => reviewHotel(hotel.id, true)} className="btn-primary">
                      <Check aria-hidden="true" className="h-4 w-4" /> {hotel.status === 'pending' ? 'Approuver et publier' : 'Publier'}
                    </button>
                    {hotel.status === 'pending' && <button type="button" disabled={busy} onClick={() => reviewHotel(hotel.id, false)} className="btn-secondary">
                      <X aria-hidden="true" className="h-4 w-4" /> Refuser
                    </button>}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#eef4ef] px-3 py-1 text-xs font-semibold text-[#174c3a]">Publié</span>
                    <button type="button" disabled={busy} onClick={() => reviewHotel(hotel.id, false)} className="btn-secondary min-h-10 px-3 py-2 text-sm">
                      <X aria-hidden="true" className="h-4 w-4" /> Dépublier
                    </button>
                  </div>
                )}
              </article>
            ))}
            <SubscriptionManagement hotels={hotels} revision={revision} busy={busy} runAction={runAction} />
          </section>
        ) : user.role === 'client' ? (
          <section className="page-card max-w-2xl p-6 sm:p-8">
            {user.partnerApplicationStatus === 'pending' ? (
              <div className="flex gap-4">
                <Clock3 aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-[#a3663d]" />
                <div>
                  <h2 className="text-lg font-semibold">Demande en cours d’examen</h2>
                  <p className="mt-2 text-sm leading-6 text-[#68736b]">Notre équipe vérifie les informations de votre établissement. Vous pourrez gérer votre fiche dès que la demande sera approuvée.</p>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold">{user.partnerApplicationStatus === 'rejected' ? 'Soumettre une nouvelle demande' : 'Devenir partenaire hôtelier'}</h2>
                {user.partnerApplicationStatus === 'rejected' && <p className="mt-2 text-sm text-[#68736b]">Votre demande précédente n’a pas été approuvée. Vous pouvez corriger les informations et la soumettre à nouveau.</p>}
                <form className="mt-6 grid gap-4" onSubmit={submitApplication}>
                  <label className="grid gap-2 text-sm font-medium">Nom de l’établissement
                    <input className="input" required minLength={2} value={businessName} onChange={event => setBusinessName(event.target.value)} />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">Ville
                    <input className="input" required value={businessCity} onChange={event => setBusinessCity(event.target.value)} />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">Téléphone professionnel
                    <input className="input" type="tel" required value={businessPhone} onChange={event => setBusinessPhone(event.target.value)} />
                  </label>
                  <button className="btn-primary mt-2 w-full sm:w-fit" disabled={busy} type="submit">
                    <Plus aria-hidden="true" className="h-4 w-4" /> {busy ? 'Envoi…' : 'Envoyer ma demande'}
                  </button>
                </form>
              </>
            )}
          </section>
        ) : (
          <div className="space-y-6">
            <HotelierWorkspace hotels={hotels} rooms={rooms} busy={busy} runAction={runAction} />
            <SubscriptionManagement hotels={hotels} revision={revision} busy={busy} runAction={runAction} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
