import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Building2, Check, Clock3, Plus, X } from 'lucide-react';
import PageIntro from '../components/PageIntro';
import { useAuth } from '../contexts/AuthContext';
import { requireSupabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

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
  const [hotelName, setHotelName] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [hotelCity, setHotelCity] = useState('');
  const [hotelRegion, setHotelRegion] = useState('');
  const [hotelPhone, setHotelPhone] = useState(user?.phone ?? '');
  const [hotelEmail, setHotelEmail] = useState(user?.email ?? '');
  const [roomHotelId, setRoomHotelId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [roomCapacity, setRoomCapacity] = useState('2');
  const [roomPrice, setRoomPrice] = useState('');
  const [roomUnits, setRoomUnits] = useState('1');

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
        setRoomHotelId(current => current || ownedHotels[0]?.id || '');
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

  const createHotel = (event: FormEvent) => {
    event.preventDefault();
    void runAction(async () => {
      const { error: insertError } = await requireSupabase().from('hotels').insert({
        owner_id: user!.id,
        name: hotelName.trim(),
        address: hotelAddress.trim(),
        city: hotelCity.trim(),
        region: hotelRegion.trim(),
        phone: hotelPhone.trim(),
        email: hotelEmail.trim(),
      });
      if (insertError) throw insertError;
      setHotelName('');
      setHotelAddress('');
    }, 'Votre établissement a été soumis pour validation.');
  };

  const createRoom = (event: FormEvent) => {
    event.preventDefault();
    void runAction(async () => {
      const { error: insertError } = await requireSupabase().from('hotel_rooms').insert({
        hotel_id: roomHotelId,
        name: roomName.trim(),
        description: roomDescription.trim(),
        capacity: Number(roomCapacity),
        price_xaf: Number(roomPrice),
        total_units: Number(roomUnits),
        is_active: true,
      });
      if (insertError) throw insertError;
      setRoomName('');
      setRoomDescription('');
      setRoomPrice('');
    }, 'La chambre a été ajoutée.');
  };

  const toggleRoom = (room: Room) => {
    void runAction(async () => {
      const { error: updateError } = await requireSupabase()
        .from('hotel_rooms')
        .update({ is_active: !room.is_active, updated_at: new Date().toISOString() })
        .eq('id', room.id);
      if (updateError) throw updateError;
    }, room.is_active ? 'Chambre désactivée.' : 'Chambre activée.');
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
          <div className="grid gap-6 xl:grid-cols-2">
            <section className="page-card p-6 sm:p-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef4ef] text-[#174c3a]"><Building2 aria-hidden="true" className="h-5 w-5" /></span>
              <h2 className="mt-4 text-xl font-semibold">Ajouter un établissement</h2>
              <p className="mt-2 text-sm leading-6 text-[#68736b]">Les nouvelles fiches sont soumises à validation avant leur publication.</p>
              <form className="mt-6 grid gap-4" onSubmit={createHotel}>
                <label className="grid gap-2 text-sm font-medium">Nom de l’établissement<input className="input" required value={hotelName} onChange={event => setHotelName(event.target.value)} /></label>
                <label className="grid gap-2 text-sm font-medium">Adresse<input className="input" required value={hotelAddress} onChange={event => setHotelAddress(event.target.value)} /></label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">Ville<input className="input" required value={hotelCity} onChange={event => setHotelCity(event.target.value)} /></label>
                  <label className="grid gap-2 text-sm font-medium">Région<input className="input" required value={hotelRegion} onChange={event => setHotelRegion(event.target.value)} /></label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">Téléphone<input className="input" type="tel" required value={hotelPhone} onChange={event => setHotelPhone(event.target.value)} /></label>
                  <label className="grid gap-2 text-sm font-medium">E-mail<input className="input" type="email" required value={hotelEmail} onChange={event => setHotelEmail(event.target.value)} /></label>
                </div>
                <button className="btn-primary mt-2 w-full sm:w-fit" disabled={busy} type="submit">{busy ? 'Envoi…' : 'Soumettre l’établissement'}</button>
              </form>
            </section>

            <section className="page-card p-6 sm:p-8">
              <h2 className="text-xl font-semibold">Ajouter un type de chambre</h2>
              <p className="mt-2 text-sm leading-6 text-[#68736b]">Les chambres sont enregistrées avec leur capacité, prix par nuit et nombre d’unités.</p>
              {hotels.length === 0 ? (
                <p className="mt-6 rounded-xl bg-[#f5f1e8] p-4 text-sm text-[#5c4324]">Soumettez d’abord un établissement. Vous pourrez ensuite y ajouter les chambres.</p>
              ) : (
                <form className="mt-6 grid gap-4" onSubmit={createRoom}>
                  <label className="grid gap-2 text-sm font-medium">Établissement
                    <select className="input" required value={roomHotelId} onChange={event => setRoomHotelId(event.target.value)}>
                      {hotels.map(hotel => <option key={hotel.id} value={hotel.id}>{hotel.name}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-medium">Nom du type de chambre<input className="input" required value={roomName} onChange={event => setRoomName(event.target.value)} /></label>
                  <label className="grid gap-2 text-sm font-medium">Description<textarea className="input min-h-24" value={roomDescription} onChange={event => setRoomDescription(event.target.value)} /></label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="grid gap-2 text-sm font-medium">Capacité<input className="input" type="number" min="1" required value={roomCapacity} onChange={event => setRoomCapacity(event.target.value)} /></label>
                    <label className="grid gap-2 text-sm font-medium">Prix/nuit (XAF)<input className="input" type="number" min="1" required value={roomPrice} onChange={event => setRoomPrice(event.target.value)} /></label>
                    <label className="grid gap-2 text-sm font-medium">Unités<input className="input" type="number" min="1" required value={roomUnits} onChange={event => setRoomUnits(event.target.value)} /></label>
                  </div>
                  <button className="btn-primary mt-2 w-full sm:w-fit" disabled={busy || !roomHotelId} type="submit"><Plus aria-hidden="true" className="h-4 w-4" /> Ajouter la chambre</button>
                </form>
              )}
            </section>

            <section className="page-card p-6 sm:col-span-2 sm:p-8">
              <h2 className="text-xl font-semibold">Mes établissements et chambres</h2>
              {hotels.length === 0 ? (
                <p className="mt-4 text-sm text-[#68736b]">Aucun établissement enregistré pour le moment.</p>
              ) : (
                <div className="mt-5 space-y-5">
                  {hotels.map(hotel => (
                    <article key={hotel.id} className="rounded-xl border border-[#e8e7e0] p-4 sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div><h3 className="font-semibold">{hotel.name}</h3><p className="mt-1 text-sm text-[#68736b]">{hotel.address}, {hotel.city} · {hotel.region}</p></div>
                        <span className="rounded-full bg-[#f5f1e8] px-3 py-1 text-xs font-semibold capitalize text-[#5c4324]">{hotel.status === 'approved' ? 'Publié' : hotel.status === 'rejected' ? 'Refusé' : 'En validation'}</span>
                      </div>
                      <div className="mt-4 divide-y divide-[#e8e7e0]">
                        {rooms.filter(room => room.hotel_id === hotel.id).map(room => (
                          <div key={room.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                            <div><p className="font-medium">{room.name}</p><p className="text-sm text-[#68736b]">{room.capacity} personne(s) · {room.price_xaf.toLocaleString()} XAF/nuit · {room.total_units} unité(s)</p></div>
                            <button type="button" disabled={busy} onClick={() => toggleRoom(room)} className="btn-secondary min-h-10 px-3 py-2 text-sm">{room.is_active ? 'Désactiver' : 'Activer'}</button>
                          </div>
                        ))}
                        {rooms.every(room => room.hotel_id !== hotel.id) && <p className="py-3 text-sm text-[#68736b]">Aucune chambre ajoutée.</p>}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
