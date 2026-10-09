import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BadgeCheck, Building2, CalendarDays, Check, Clock3, CreditCard, LayoutDashboard, Mail, Phone, Plus, Users, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PageIntro from '../components/PageIntro';
import { useAuth } from '../contexts/AuthContext';
import { requireSupabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import HotelierWorkspace from './HotelierWorkspace';
import SubscriptionManagement from './SubscriptionManagement';

type Application = Database['public']['Tables']['partner_applications']['Row'];
type Hotel = Database['public']['Tables']['hotels']['Row'];
type Room = Database['public']['Tables']['hotel_rooms']['Row'];
type Reservation = Database['public']['Tables']['reservations']['Row'];
type DashboardSection = 'overview' | 'partners' | 'hotels' | 'reservations' | 'subscriptions';
type DashboardMenuItem = { id: DashboardSection; label: string; icon: LucideIcon };
type ManualReservation = {
  hotelId: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  roomCount: number;
  specialRequests: string;
};

const errorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error !== 'object' || error === null) return String(error);

  const details = error as { message?: unknown; details?: unknown; hint?: unknown; code?: unknown };
  const messages = [details.message, details.details, details.hint]
    .filter((value): value is string => typeof value === 'string' && value.length > 0);
  const code = typeof details.code === 'string' ? ` (${details.code})` : '';
  return messages.length ? `${messages.join(' — ')}${code}` : 'Une erreur inattendue est survenue.';
};

const Dashboard: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicantDetails, setApplicantDetails] = useState<Record<string, { name: string; email: string }>>({});
  const [reviewHotels, setReviewHotels] = useState<Hotel[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [revision, setRevision] = useState(0);
  const [businessName, setBusinessName] = useState('');
  const [businessCity, setBusinessCity] = useState('');
  const [businessPhone, setBusinessPhone] = useState(user?.phone ?? '');
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const client = requireSupabase();
      if (user.role === 'admin') {
        const [
          { data, error: applicationsError },
          { data: hotelsData, error: hotelsError },
          { data: roomData, error: roomsError },
          { data: reservationData, error: reservationsError },
        ] = await Promise.all([
          client
          .from('partner_applications')
          .select('*')
          .order('submitted_at', { ascending: false }),
          client
            .from('hotels')
            .select('*')
            .order('created_at', { ascending: false }),
          client
            .from('hotel_rooms')
            .select('*')
            .order('created_at', { ascending: false }),
          client
            .from('reservations')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(500),
        ]);
        if (applicationsError) throw applicationsError;
        if (hotelsError) throw hotelsError;
        if (roomsError) throw roomsError;
        if (reservationsError) throw reservationsError;
        setApplications(data ?? []);
        setReviewHotels(hotelsData ?? []);
        setHotels(hotelsData ?? []);
        setRooms(roomData ?? []);
        setReservations(reservationData ?? []);
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
          const [{ data: roomData, error: roomsError }, { data: reservationData, error: reservationsError }] = await Promise.all([
            client
              .from('hotel_rooms')
              .select('*')
              .in('hotel_id', ownedHotels.map(hotel => hotel.id))
              .order('created_at', { ascending: false }),
            client
              .from('reservations')
              .select('*')
              .in('hotel_id', ownedHotels.map(hotel => hotel.id))
              .order('created_at', { ascending: false })
              .limit(100),
          ]);
          if (roomsError) throw roomsError;
          if (reservationsError) throw reservationsError;
          setRooms(roomData ?? []);
          setReservations(reservationData ?? []);
        } else {
          setRooms([]);
          setReservations([]);
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

  const reviewReservation = (reservationId: string, action: 'confirm' | 'reject' | 'cancel') => {
    void runAction(async () => {
      const { error: rpcError } = await requireSupabase().rpc('review_hotel_reservation', {
        p_reservation_id: reservationId,
        p_action: action,
      });
      if (rpcError) throw rpcError;
    }, action === 'confirm' ? 'La réservation a été confirmée.'
      : action === 'cancel' ? 'La réservation a été annulée.'
        : 'La demande de réservation a été refusée.');
  };

  const createReservation = (reservation: ManualReservation) => {
    void runAction(async () => {
      const { error: rpcError } = await requireSupabase().rpc('create_staff_reservation', {
        p_hotel_id: reservation.hotelId,
        p_room_id: reservation.roomId,
        p_guest_name: reservation.guestName,
        p_guest_email: reservation.guestEmail || null,
        p_guest_phone: reservation.guestPhone,
        p_check_in: reservation.checkIn,
        p_check_out: reservation.checkOut,
        p_guest_count: reservation.guestCount,
        p_room_count: reservation.roomCount,
        p_special_requests: reservation.specialRequests,
      });
      if (rpcError) throw rpcError;
    }, 'La réservation a été créée et confirmée.');
  };

  if (!user) return null;
  const dashboardItems = user.role === 'admin'
    ? [
        { id: 'overview' as const, label: 'Vue d’ensemble', icon: LayoutDashboard },
        { id: 'partners' as const, label: 'Demandes partenaires', icon: Users },
        { id: 'hotels' as const, label: 'Établissements', icon: Building2 },
        { id: 'reservations' as const, label: 'Réservations', icon: CalendarDays },
        { id: 'subscriptions' as const, label: 'Abonnements', icon: CreditCard },
      ]
    : [
        { id: 'overview' as const, label: 'Vue d’ensemble', icon: LayoutDashboard },
        { id: 'hotels' as const, label: 'Mes établissements', icon: Building2 },
        { id: 'reservations' as const, label: 'Réservations', icon: CalendarDays },
        { id: 'subscriptions' as const, label: 'Abonnements', icon: CreditCard },
      ];

  return (
    <div className="page-shell">
      <Helmet>
        <title>{user.role === 'admin' ? 'Administration' : 'Espace partenaire'} | MboaHotel Connect</title>
      </Helmet>
      <div className="page-container">
        <PageIntro
          eyebrow={user.role === 'admin' ? 'Administration' : 'Espace partenaire'}
          title={user.role === 'admin' ? 'Tableau de bord' : 'Votre espace de gestion'}
          description={user.role === 'admin'
            ? 'Pilotez les demandes, les établissements et les abonnements depuis un espace central.'
            : user.role === 'hotelier'
              ? 'Gérez vos hébergements, vos chambres et vos formules.'
              : 'Soumettez une demande pour ouvrir votre espace de gestion hôtelière.'}
        />

        {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        {message && <p role="status" className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">{message}</p>}

        {loading ? (
          <p role="status" className="text-sm text-[#68736b]">Chargement des données…</p>
        ) : user.role === 'admin' ? (
          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
            <DashboardMenu items={dashboardItems} activeSection={activeSection} onSelect={setActiveSection} />
            <section className="min-w-0 space-y-5">
              {activeSection === 'overview' && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <DashboardMetric label="Demandes partenaires" value={applications.filter(item => item.status === 'pending').length} detail="À examiner" icon={Users} />
                    <DashboardMetric label="À valider" value={reviewHotels.filter(item => item.status === 'pending' || item.status === 'rejected').length} detail="Fiches établissement" icon={Clock3} />
                    <DashboardMetric label="Établissements publiés" value={reviewHotels.filter(item => item.status === 'approved').length} detail="Visibles sur le catalogue" icon={BadgeCheck} />
                    <DashboardMetric label="Réservations en attente" value={reservations.filter(item => item.status === 'pending').length} detail="À traiter" icon={CalendarDays} />
                  </div>
                  <section className="page-card p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold">Actions à traiter</h2>
                        <p className="mt-1 text-sm text-[#68736b]">Les éléments en attente demandent votre attention.</p>
                      </div>
                      <button type="button" className="text-sm font-semibold text-[#174c3a]" onClick={() => setActiveSection('partners')}>
                        Voir les demandes
                      </button>
                    </div>
                    <div className="mt-4 divide-y divide-[#eeece5]">
                      {applications.filter(item => item.status === 'pending').slice(0, 4).map(application => (
                        <div key={application.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                          <div>
                            <p className="font-medium">{application.business_name}</p>
                            <p className="text-sm text-[#68736b]">{application.city} · Soumise le {new Date(application.submitted_at).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <button type="button" className="btn-secondary min-h-9 px-3 py-1.5 text-sm" onClick={() => setActiveSection('partners')}>Examiner</button>
                        </div>
                      ))}
                      {reviewHotels.filter(item => item.status === 'pending').slice(0, 3).map(hotel => (
                        <div key={hotel.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                          <div>
                            <p className="font-medium">{hotel.name}</p>
                            <p className="text-sm text-[#68736b]">{hotel.city} · Fiche à valider</p>
                          </div>
                          <button type="button" className="btn-secondary min-h-9 px-3 py-1.5 text-sm" onClick={() => setActiveSection('hotels')}>Examiner</button>
                        </div>
                      ))}
                      {!applications.some(item => item.status === 'pending') && !reviewHotels.some(item => item.status === 'pending') && (
                        <p className="py-4 text-sm text-[#68736b]">Tout est à jour : aucune demande ni fiche en attente.</p>
                      )}
                    </div>
                  </section>
                </>
              )}
              {activeSection === 'partners' && (
                <section className="space-y-4">
                  <DashboardSectionHeader title="Demandes partenaires" description="Vérifiez les coordonnées de l’entreprise avant d’accorder l’accès hôtelier." count={applications.filter(item => item.status === 'pending').length} />
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
                          <button type="button" disabled={busy} onClick={() => reviewApplication(application.id, true)} className="btn-primary"><Check aria-hidden="true" className="h-4 w-4" /> Approuver</button>
                          <button type="button" disabled={busy} onClick={() => reviewApplication(application.id, false)} className="btn-secondary"><X aria-hidden="true" className="h-4 w-4" /> Refuser</button>
                        </div>
                      )}
                    </article>
                  ))}
                </section>
              )}
              {activeSection === 'hotels' && (
                <section className="space-y-4">
                  <DashboardSectionHeader title="Établissements" description="Examinez les fiches avant leur publication sur le catalogue." count={reviewHotels.filter(item => item.status === 'pending').length} />
                  {reviewHotels.length === 0 ? (
                    <div className="page-card p-6 text-sm text-[#68736b]">Aucun établissement soumis pour le moment.</div>
                  ) : reviewHotels.map(hotel => (
                    <article key={hotel.id} className="page-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-[#17251f]">{hotel.name}</h3>
                        <p className="mt-1 text-sm text-[#68736b]">{hotel.address}, {hotel.city} · {hotel.region}</p>
                        <p className="mt-1 text-sm text-[#68736b]">{hotel.phone} · {hotel.email}</p>
                        <p className="mt-1 text-xs text-[#68736b]">État : {hotel.status} · Soumis le {new Date(hotel.created_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                      {hotel.status === 'pending' || hotel.status === 'rejected' ? (
                        <div className="flex flex-wrap gap-2">
                          <button type="button" disabled={busy} onClick={() => reviewHotel(hotel.id, true)} className="btn-primary"><Check aria-hidden="true" className="h-4 w-4" /> {hotel.status === 'pending' ? 'Approuver et publier' : 'Publier'}</button>
                          {hotel.status === 'pending' && <button type="button" disabled={busy} onClick={() => reviewHotel(hotel.id, false)} className="btn-secondary"><X aria-hidden="true" className="h-4 w-4" /> Refuser</button>}
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full bg-[#eef4ef] px-3 py-1 text-xs font-semibold text-[#174c3a]">Publié</span>
                          <button type="button" disabled={busy} onClick={() => reviewHotel(hotel.id, false)} className="btn-secondary min-h-10 px-3 py-2 text-sm"><X aria-hidden="true" className="h-4 w-4" /> Dépublier</button>
                        </div>
                      )}
                    </article>
                  ))}
                </section>
              )}
              {activeSection === 'reservations' && (
                <ReservationManagement
                  hotels={hotels}
                  rooms={rooms}
                  reservations={reservations}
                  busy={busy}
                  onCreate={createReservation}
                  onReview={reviewReservation}
                />
              )}
              {activeSection === 'subscriptions' && <SubscriptionManagement hotels={hotels} revision={revision} busy={busy} runAction={runAction} />}
            </section>
          </div>
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
          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
            <DashboardMenu items={dashboardItems} activeSection={activeSection} onSelect={setActiveSection} />
            <section className="min-w-0 space-y-5">
              {activeSection === 'overview' && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <DashboardMetric label="Établissements" value={hotels.length} detail="Dans votre espace" icon={Building2} />
                    <DashboardMetric label="Types de chambres" value={rooms.length} detail={`${rooms.filter(room => room.is_active).length} actifs`} icon={LayoutDashboard} />
                    <DashboardMetric label="Fiches à valider" value={hotels.filter(hotel => hotel.status === 'pending').length} detail="En attente de vérification" icon={Clock3} />
                    <DashboardMetric label="Demandes à traiter" value={reservations.filter(reservation => reservation.status === 'pending').length} detail="Réservations en attente" icon={CalendarDays} />
                  </div>
                  <section className="page-card p-5 sm:p-6">
                    <h2 className="text-lg font-semibold">Bienvenue dans votre espace hôtelier</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68736b]">Utilisez le menu pour gérer vos établissements, traiter les demandes de réservation, consulter les chambres et suivre votre formule.</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button type="button" className="btn-primary" onClick={() => setActiveSection('hotels')}><Building2 aria-hidden="true" className="h-4 w-4" /> Gérer mes établissements</button>
                      <button type="button" className="btn-secondary" onClick={() => setActiveSection('reservations')}><CalendarDays aria-hidden="true" className="h-4 w-4" /> Voir les réservations</button>
                      <button type="button" className="btn-secondary" onClick={() => setActiveSection('subscriptions')}><CreditCard aria-hidden="true" className="h-4 w-4" /> Voir les abonnements</button>
                    </div>
                  </section>
                </>
              )}
              {activeSection === 'hotels' && <HotelierWorkspace hotels={hotels} rooms={rooms} busy={busy} runAction={runAction} />}
              {activeSection === 'reservations' && (
                <ReservationManagement
                  hotels={hotels}
                  rooms={rooms}
                  reservations={reservations}
                  busy={busy}
                  onCreate={createReservation}
                  onReview={reviewReservation}
                />
              )}
              {activeSection === 'subscriptions' && <SubscriptionManagement hotels={hotels} revision={revision} busy={busy} runAction={runAction} />}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardMenu: React.FC<{
  items: DashboardMenuItem[];
  activeSection: DashboardSection;
  onSelect: (section: DashboardSection) => void;
}> = ({ items, activeSection, onSelect }) => (
  <nav aria-label="Sections du tableau de bord" className="page-card h-fit p-2 lg:sticky lg:top-24">
    <div className="flex gap-1 overflow-x-auto lg:grid">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onSelect(item.id)}
            className={`flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors lg:w-full ${
              isActive ? 'bg-[#174c3a] text-white' : 'text-[#59645d] hover:bg-[#f1f3ed] hover:text-[#174c3a]'
            }`}
          >
            <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

const ReservationManagement: React.FC<{
  hotels: Hotel[];
  rooms: Room[];
  reservations: Reservation[];
  busy: boolean;
  onCreate: (reservation: ManualReservation) => void;
  onReview: (reservationId: string, action: 'confirm' | 'reject' | 'cancel') => void;
}> = ({ hotels, rooms, reservations, busy, onCreate, onReview }) => {
  const availableHotels = hotels.filter(hotel => hotel.status === 'approved');
  const [hotelId, setHotelId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [checkIn, setCheckIn] = useState(() => formatLocalDate(new Date()));
  const [checkOut, setCheckOut] = useState(() => formatLocalDate(addDays(new Date(), 1)));
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const availableRooms = rooms.filter(room => room.hotel_id === hotelId && room.is_active);
  const minimumCheckOut = checkIn
    ? formatLocalDate(addDays(new Date(`${checkIn}T00:00:00`), 1))
    : formatLocalDate(addDays(new Date(), 1));

  useEffect(() => {
    if (!availableHotels.some(hotel => hotel.id === hotelId)) {
      setHotelId(availableHotels[0]?.id ?? '');
    }
  }, [availableHotels, hotelId]);

  useEffect(() => {
    if (!availableRooms.some(room => room.id === roomId)) {
      setRoomId(availableRooms[0]?.id ?? '');
    }
  }, [availableRooms, roomId]);

  const submitReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreate({
      hotelId,
      roomId,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      checkIn,
      checkOut,
      guestCount,
      roomCount,
      specialRequests: specialRequests.trim(),
    });
  };

  return (
    <section className="space-y-4">
      <DashboardSectionHeader
        title="Gestion des réservations"
        description="Saisissez les réservations prises par téléphone ou à l’accueil, puis suivez toutes les demandes."
        count={reservations.filter(reservation => reservation.status === 'pending').length}
      />
      <form className="page-card grid gap-4 p-5 sm:p-6" onSubmit={submitReservation}>
        <div>
          <h3 className="text-lg font-semibold text-[#17251f]">Enregistrer une réservation</h3>
          <p className="mt-1 text-sm leading-6 text-[#68736b]">La réservation sera confirmée après vérification du stock. Elle ne nécessite pas de compte client.</p>
        </div>
        {availableHotels.length === 0 ? (
          <p className="rounded-xl bg-[#f5f1e8] p-4 text-sm leading-6 text-[#5c4324]">Aucun établissement approuvé n’est disponible pour enregistrer une réservation.</p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Établissement
                <select className="input" required value={hotelId} onChange={event => setHotelId(event.target.value)}>
                  {availableHotels.map(hotel => <option key={hotel.id} value={hotel.id}>{hotel.name} · {hotel.city}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Chambre
                <select className="input" required disabled={!availableRooms.length} value={roomId} onChange={event => setRoomId(event.target.value)}>
                  {availableRooms.length
                    ? availableRooms.map(room => <option key={room.id} value={room.id}>{room.name} · {room.price_xaf.toLocaleString()} XAF/nuit · {room.total_units} unité(s)</option>)
                    : <option value="">Aucune chambre active</option>}
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Nom du client
                <input className="input" required minLength={2} maxLength={160} autoComplete="name" value={guestName} onChange={event => setGuestName(event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Téléphone du client
                <input className="input" type="tel" required maxLength={40} autoComplete="tel" value={guestPhone} onChange={event => setGuestPhone(event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-medium sm:col-span-2">
                E-mail du client (facultatif)
                <input className="input" type="email" maxLength={254} autoComplete="email" value={guestEmail} onChange={event => setGuestEmail(event.target.value)} />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-2 text-sm font-medium">
                Arrivée
                <input
                  className="input"
                  type="date"
                  required
                  min={formatLocalDate(new Date())}
                  value={checkIn}
                  onChange={event => {
                    const nextCheckIn = event.target.value;
                    setCheckIn(nextCheckIn);
                    if (checkOut <= nextCheckIn) {
                      setCheckOut(formatLocalDate(addDays(new Date(`${nextCheckIn}T00:00:00`), 1)));
                    }
                  }}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Départ
                <input className="input" type="date" required min={minimumCheckOut} value={checkOut} onChange={event => setCheckOut(event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Voyageurs
                <input className="input" type="number" min={1} max={100} required value={guestCount} onChange={event => setGuestCount(Number(event.target.value))} />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Nombre de chambres
                <input className="input" type="number" min={1} max={100} required value={roomCount} onChange={event => setRoomCount(Number(event.target.value))} />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              Demandes particulières (facultatif)
              <textarea className="input min-h-24" maxLength={2000} value={specialRequests} onChange={event => setSpecialRequests(event.target.value)} />
            </label>
            <button className="btn-primary w-full sm:w-fit" disabled={busy || !roomId} type="submit">
              <Plus aria-hidden="true" className="h-4 w-4" /> Enregistrer et confirmer
            </button>
          </>
        )}
      </form>
      {reservations.length === 0 ? (
        <div className="page-card p-6 text-sm text-[#68736b]">Aucune réservation enregistrée pour le moment.</div>
      ) : reservations.map(reservation => {
        const hotelName = hotels.find(hotel => hotel.id === reservation.hotel_id)?.name ?? 'Établissement';
        const roomName = rooms.find(room => room.id === reservation.room_id)?.name ?? 'Chambre';
        const statusLabel = reservation.status === 'confirmed' ? 'Confirmée'
          : reservation.status === 'cancelled' ? 'Annulée'
            : reservation.status === 'completed' ? 'Terminée' : 'En attente';
        const statusStyle = reservation.status === 'pending' ? 'bg-amber-100 text-amber-900'
          : reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-[#eef4ef] text-[#174c3a]';
        return (
          <article key={reservation.id} className="page-card space-y-4 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-[#17251f]">{hotelName} · {roomName}</h3>
                <p className="mt-1 text-sm text-[#68736b]">{reservation.room_count} chambre(s) · {reservation.guest_count} voyageur(s)</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}>{statusLabel}</span>
            </div>
            <div className="grid gap-2 border-t border-[#e8e7e0] pt-4 text-sm text-[#59645d] sm:grid-cols-2">
              <p className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="h-4 w-4" />{new Date(`${reservation.check_in}T00:00:00`).toLocaleDateString('fr-FR')} – {new Date(`${reservation.check_out}T00:00:00`).toLocaleDateString('fr-FR')}</p>
              <p className="font-semibold text-[#17251f]">{reservation.total_price_xaf.toLocaleString()} XAF · sans paiement</p>
              {reservation.guest_name && <p>{reservation.guest_name}{!reservation.user_id && <span className="ml-2 text-xs text-[#68736b]">(saisie par l’établissement)</span>}</p>}
              {reservation.guest_email && <a className="flex items-center gap-2 hover:underline" href={`mailto:${reservation.guest_email}`}><Mail aria-hidden="true" className="h-4 w-4" />{reservation.guest_email}</a>}
              {reservation.guest_phone && <a className="flex items-center gap-2 hover:underline" href={`tel:${reservation.guest_phone}`}><Phone aria-hidden="true" className="h-4 w-4" />{reservation.guest_phone}</a>}
            </div>
            {reservation.special_requests && (
              <p className="rounded-xl bg-[#f5f1e8] p-3 text-sm leading-6 text-[#5c4324]">Demande spéciale : {reservation.special_requests}</p>
            )}
            {reservation.status === 'pending' && (
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={busy} onClick={() => onReview(reservation.id, 'confirm')} className="btn-primary"><Check aria-hidden="true" className="h-4 w-4" /> Confirmer</button>
                <button type="button" disabled={busy} onClick={() => onReview(reservation.id, 'reject')} className="btn-secondary"><X aria-hidden="true" className="h-4 w-4" /> Refuser</button>
              </div>
            )}
            {reservation.status === 'confirmed' && (
              <button type="button" disabled={busy} onClick={() => onReview(reservation.id, 'cancel')} className="btn-secondary"><X aria-hidden="true" className="h-4 w-4" /> Annuler la réservation</button>
            )}
          </article>
        );
      })}
    </section>
  );
};

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const DashboardMetric: React.FC<{
  label: string;
  value: number;
  detail: string;
  icon: LucideIcon;
}> = ({ label, value, detail, icon: Icon }) => (
  <article className="page-card flex items-start gap-4 p-5">
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef4ef] text-[#174c3a]">
      <Icon aria-hidden="true" className="h-5 w-5" />
    </span>
    <div className="min-w-0">
      <p className="text-sm text-[#68736b]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#17251f]">{value}</p>
      <p className="mt-1 text-xs text-[#68736b]">{detail}</p>
    </div>
  </article>
);

const DashboardSectionHeader: React.FC<{ title: string; description: string; count: number }> = ({
  title,
  description,
  count,
}) => (
  <div className="page-card flex flex-wrap items-center justify-between gap-4 p-5">
    <div>
      <h2 className="text-lg font-semibold text-[#17251f]">{title}</h2>
      <p className="mt-1 text-sm text-[#68736b]">{description}</p>
    </div>
    <span className="rounded-full bg-[#f1f3ed] px-3 py-1 text-sm font-semibold text-[#174c3a]">{count} en attente</span>
  </div>
);

export default Dashboard;
