import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CalendarDays, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageIntro from '../components/PageIntro';
import { useAuth } from '../contexts/AuthContext';
import { requireSupabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Reservation = Database['public']['Tables']['reservations']['Row'];

const Reservations: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [hotelNames, setHotelNames] = useState<Record<string, string>>({});
  const [roomNames, setRoomNames] = useState<Record<string, string>>({});
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadReservations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const client = requireSupabase();
      const { data, error: queryError } = await client
        .from('reservations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (queryError) throw queryError;
      const records = data ?? [];
      setReservations(records);

      const hotelIds = [...new Set(records.map(item => item.hotel_id))];
      const roomIds = [...new Set(records.map(item => item.room_id))];
      if (hotelIds.length) {
        const { data: hotelData, error: hotelError } = await client.from('hotels').select('id,name').in('id', hotelIds);
        if (hotelError) throw hotelError;
        setHotelNames(Object.fromEntries((hotelData ?? []).map(hotel => [hotel.id, hotel.name])));
      } else {
        setHotelNames({});
      }
      if (roomIds.length) {
        const { data: roomData, error: roomError } = await client.from('hotel_rooms').select('id,name').in('id', roomIds);
        if (roomError) throw roomError;
        setRoomNames(Object.fromEntries((roomData ?? []).map(room => [room.id, room.name])));
      } else {
        setRoomNames({});
      }
    } catch (loadError) {
      console.error('Échec du chargement des réservations:', loadError);
      setError(`Impossible de charger vos réservations : ${loadError instanceof Error ? loadError.message : String(loadError)}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await updateProfile({ firstName, lastName, phone });
      setMessage('Vos informations ont été mises à jour.');
    } catch (saveError) {
      console.error('Échec de la mise à jour du profil:', saveError);
      setError(saveError instanceof Error ? saveError.message : String(saveError));
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="page-shell">
      <Helmet><title>Mon compte | MboaHotel Connect</title></Helmet>
      <div className="page-container max-w-5xl">
        <PageIntro
          eyebrow="Votre espace"
          title="Mon compte"
          description="Gérez vos coordonnées et consultez les réservations associées à votre compte."
        />

        {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
        {message && <p role="status" className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">{message}</p>}

        <section className="page-card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef4ef] text-[#174c3a]"><User aria-hidden="true" className="h-5 w-5" /></span>
            <div><h2 className="text-xl font-semibold">Informations personnelles</h2><p className="mt-1 text-sm text-[#68736b]">{user.email}</p></div>
          </div>
          <form onSubmit={saveProfile} className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">Prénom<input className="input" required value={firstName} onChange={event => setFirstName(event.target.value)} /></label>
            <label className="grid gap-2 text-sm font-medium">Nom<input className="input" required value={lastName} onChange={event => setLastName(event.target.value)} /></label>
            <label className="grid gap-2 text-sm font-medium sm:col-span-2">Téléphone<input className="input" type="tel" value={phone} onChange={event => setPhone(event.target.value)} /></label>
            <button type="submit" className="btn-primary w-full sm:col-span-2 sm:w-fit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer les modifications'}</button>
          </form>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="section-title">Mes réservations</h2><p className="mt-1 text-sm text-[#68736b]">Suivez les demandes envoyées aux établissements et leur confirmation.</p></div>
          </div>
          {loading ? (
            <p role="status" className="py-5 text-sm text-[#68736b]">Chargement de vos réservations…</p>
          ) : reservations.length === 0 ? (
            <div className="page-card px-6 py-10 text-center sm:px-10">
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef4ef] text-[#174c3a]"><CalendarDays aria-hidden="true" className="h-7 w-7" /></span>
              <h3 className="mt-5 text-xl font-semibold text-[#17251f]">Aucune réservation enregistrée</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#68736b]">Vos demandes de réservation apparaîtront ici après leur envoi.</p>
              <Link to="/search" className="btn-primary mt-6"><Search aria-hidden="true" className="h-4 w-4" /> Découvrir les hébergements</Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {reservations.map(reservation => (
                <article key={reservation.id} className="page-card p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{hotelNames[reservation.hotel_id] ?? 'Établissement'}</h3>
                      <p className="mt-1 text-sm text-[#68736b]">{roomNames[reservation.room_id] ?? 'Chambre'} · {reservation.guest_count} voyageur(s) · {reservation.room_count} chambre(s)</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${reservation.status === 'pending' ? 'bg-amber-100 text-amber-900' : reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-[#eef4ef] text-[#174c3a]'}`}>{reservation.status === 'confirmed' ? 'Confirmée' : reservation.status === 'cancelled' ? 'Refusée / annulée' : reservation.status === 'completed' ? 'Terminée' : 'En attente de confirmation'}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-[#e8e7e0] pt-4 text-sm">
                    <p>{new Date(`${reservation.check_in}T00:00:00`).toLocaleDateString('fr-FR')} – {new Date(`${reservation.check_out}T00:00:00`).toLocaleDateString('fr-FR')}</p>
                    <p className="font-semibold">{reservation.total_price_xaf.toLocaleString()} XAF</p>
                  </div>
                  {reservation.special_requests && <p className="mt-3 rounded-xl bg-[#f5f1e8] p-3 text-sm leading-6 text-[#5c4324]">Votre demande : {reservation.special_requests}</p>}
                  {reservation.status === 'pending' && <p className="mt-3 text-sm text-[#68736b]">Aucun paiement n’a été effectué. La chambre n’est pas bloquée avant confirmation par l’établissement.</p>}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Reservations;
