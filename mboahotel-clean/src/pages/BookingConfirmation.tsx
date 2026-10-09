import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Check, MapPin, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { requireSupabase } from '../lib/supabase';

interface BookingItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  capacity: number;
}

interface BookingDetails {
  hotelId: string;
  hotelName: string;
  selectedRooms: BookingItem[];
  totalPrice: number;
  checkIn: string;
  checkOut: string;
}

const errorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error !== 'object' || error === null) return String(error);
  const details = error as { message?: unknown; details?: unknown; hint?: unknown };
  return [details.message, details.details, details.hint]
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .join(' — ') || 'Une erreur inattendue est survenue.';
};

const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const { user, updateProfile } = useAuth();
  const bookingDetails = (location.state as { bookingDetails?: BookingDetails } | null)?.bookingDetails;
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [guestCount, setGuestCount] = useState(1);
  const [checkIn, setCheckIn] = useState(bookingDetails?.checkIn ?? '');
  const [checkOut, setCheckOut] = useState(bookingDetails?.checkOut ?? '');
  const [specialRequests, setSpecialRequests] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhone(user.phone ?? '');
  }, [user?.id, user?.firstName, user?.lastName, user?.phone]);

  const returnState = { from: { pathname: location.pathname, state: location.state } };

  if (!bookingDetails) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="page-card mx-4 max-w-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Sélection manquante</h1>
          <p className="mt-3 text-gray-600">Choisissez vos dates et vos chambres avant d’envoyer une demande.</p>
          <Link to="/search" className="btn-primary mt-6">Rechercher un établissement</Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="page-card mx-4 max-w-lg p-6 text-center sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Connectez-vous pour réserver</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Votre sélection est prête. Connectez-vous à votre compte client pour envoyer la demande à {bookingDetails.hotelName}.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/login" state={returnState} className="btn-primary">Se connecter</Link>
            <Link to="/register" state={returnState} className="btn-secondary">Créer un compte</Link>
          </div>
        </div>
      </div>
    );
  }

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86400000))
    : 0;
  const maximumGuests = bookingDetails.selectedRooms.reduce(
    (capacity, room) => capacity + room.quantity * room.capacity,
    0,
  );
  const totalPrice = bookingDetails.selectedRooms.reduce(
    (total, room) => total + room.price * room.quantity * nights,
    0,
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (user.role !== 'client') throw new Error('Utilisez un compte client pour effectuer une réservation.');
      if (!firstName.trim() || !lastName.trim()) throw new Error('Renseignez votre prénom et votre nom.');
      if (!phone.trim()) throw new Error('Renseignez votre numéro de téléphone.');
      if (checkIn < new Date().toISOString().slice(0, 10) || !nights) {
        throw new Error('Choisissez des dates de séjour valides.');
      }
      if (specialRequests.length > 1000) throw new Error('Les demandes spéciales ne peuvent pas dépasser 1 000 caractères.');

      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
      });

      const { error: reservationError } = await requireSupabase().rpc('create_online_reservations', {
        p_hotel_id: bookingDetails.hotelId,
        p_room_selections: bookingDetails.selectedRooms.map(room => ({
          room_id: room.id,
          room_count: room.quantity,
        })),
        p_check_in: checkIn,
        p_check_out: checkOut,
        p_guest_count: guestCount,
        p_special_requests: specialRequests.trim(),
      });
      if (reservationError) throw reservationError;
      setSubmitted(true);
    } catch (submitError) {
      console.error('Échec de la demande de réservation:', submitError);
      setError(errorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="page-card mx-4 max-w-xl p-6 text-center sm:p-9">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
            <Check aria-hidden="true" className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-gray-900">Demande envoyée</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Votre demande pour {bookingDetails.hotelName} est enregistrée en attente de confirmation par l’établissement.
            Aucun paiement n’a été effectué et les chambres ne sont pas bloquées avant confirmation.
          </p>
          <Link to="/reservations" className="btn-primary mt-6">Suivre mes réservations</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-container max-w-5xl">
        <div className="mb-8">
          <Link to={`/hotel/${bookingDetails.hotelId}`} className="mb-4 inline-flex items-center text-[#174c3a] hover:underline">
            <ArrowLeft aria-hidden="true" className="mr-2 h-4 w-4" /> Retour à l’établissement
          </Link>
          <h1 className="page-title">Demande de réservation</h1>
          <p className="page-description text-base">L’établissement confirmera la disponibilité avant que votre séjour soit réservé.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <form onSubmit={handleSubmit} className="page-card space-y-5 p-5 sm:p-6 lg:col-span-2">
            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
            <div className="rounded-xl border border-[#e4d0a2] bg-[#f8f3e9] p-4 text-sm leading-6 text-[#5c4324]">
              La demande sera envoyée sans paiement. Elle ne devient confirmée qu’après validation par l’établissement.
            </div>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">Coordonnées du client</h2>
              <p className="mt-1 text-sm text-gray-600">{user.email}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-gray-700">
                  Prénom *
                  <input required autoComplete="given-name" value={firstName} onChange={event => setFirstName(event.target.value)} className="input" />
                </label>
                <label className="grid gap-2 text-sm font-medium text-gray-700">
                  Nom *
                  <input required autoComplete="family-name" value={lastName} onChange={event => setLastName(event.target.value)} className="input" />
                </label>
              </div>
              <label htmlFor="phone" className="mt-4 block text-sm font-medium text-gray-700">Téléphone de contact *</label>
              <input
                id="phone"
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={event => setPhone(event.target.value)}
                className="input mt-2"
                placeholder="+237 6XX XX XX XX"
              />
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">Détails du séjour</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-gray-700">
                  Arrivée *
                  <input type="date" required min={new Date().toISOString().slice(0, 10)} value={checkIn} onChange={event => setCheckIn(event.target.value)} className="input" />
                </label>
                <label className="grid gap-2 text-sm font-medium text-gray-700">
                  Départ *
                  <input type="date" required min={checkIn || new Date().toISOString().slice(0, 10)} value={checkOut} onChange={event => setCheckOut(event.target.value)} className="input" />
                </label>
                <label className="grid gap-2 text-sm font-medium text-gray-700 sm:col-span-2">
                  Nombre de voyageurs *
                  <input type="number" min={1} max={maximumGuests || undefined} required value={guestCount} onChange={event => setGuestCount(Number(event.target.value))} className="input" />
                  {maximumGuests > 0 && <span className="text-xs font-normal text-gray-500">Capacité maximale des chambres sélectionnées : {maximumGuests} voyageurs.</span>}
                </label>
              </div>
            </section>

            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Demandes spéciales (facultatif)
              <textarea
                maxLength={1000}
                rows={3}
                value={specialRequests}
                onChange={event => setSpecialRequests(event.target.value)}
                className="input resize-y"
                placeholder="Précisions utiles à l’établissement"
              />
            </label>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 text-base">
              {isSubmitting ? 'Envoi de la demande…' : 'Envoyer la demande de réservation'}
            </button>
          </form>

          <aside className="page-card h-fit p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-gray-900">Récapitulatif</h2>
            <h3 className="mt-4 font-semibold text-gray-900">{bookingDetails.hotelName}</h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-600"><MapPin aria-hidden="true" className="h-4 w-4" />Établissement sélectionné</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-600"><Star aria-hidden="true" className="h-4 w-4 text-amber-500" />Prix et disponibilité à confirmer</p>
            <div className="my-4 space-y-2 border-y py-4">
              {bookingDetails.selectedRooms.map(room => (
                <div key={room.id} className="flex justify-between gap-3 text-sm">
                  <span>{room.quantity} × {room.name}</span>
                  <span>{(room.quantity * room.price).toLocaleString()} XAF/nuit</span>
                </div>
              ))}
              <p className="flex items-center gap-2 pt-2 text-sm text-gray-600"><Calendar aria-hidden="true" className="h-4 w-4" />{nights} nuit{nights > 1 ? 's' : ''}</p>
            </div>
            <p className="flex justify-between gap-3 text-base font-bold">
              <span>Total indicatif</span>
              <span>{totalPrice.toLocaleString()} XAF</span>
            </p>
            <p className="mt-2 text-xs leading-5 text-gray-500">Le montant final sera confirmé par l’établissement. Aucun paiement en ligne n’est activé pour le moment.</p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
