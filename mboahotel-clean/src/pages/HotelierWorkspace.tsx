import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Building2, ImagePlus, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../types/supabase';
import { requireSupabase } from '../lib/supabase';

type Hotel = Database['public']['Tables']['hotels']['Row'];
type Room = Database['public']['Tables']['hotel_rooms']['Row'];
type Photo = Database['public']['Tables']['hotel_photos']['Row'];
type RoomPhoto = Database['public']['Tables']['hotel_room_photos']['Row'];

interface HotelierWorkspaceProps {
  hotels: Hotel[];
  rooms: Room[];
  busy: boolean;
  runAction: (action: () => Promise<void>, successMessage: string) => Promise<void>;
}

const HotelierWorkspace: React.FC<HotelierWorkspaceProps> = ({ hotels, rooms, busy, runAction }) => {
  const roomPhotoLimit = 3;
  const { user } = useAuth();
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [roomPhotos, setRoomPhotos] = useState<RoomPhoto[]>([]);
  const [photoLimit, setPhotoLimit] = useState(3);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [roomPhotoManagementId, setRoomPhotoManagementId] = useState('');
  const [photosError, setPhotosError] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [hotelDescription, setHotelDescription] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [hotelCity, setHotelCity] = useState('');
  const [hotelRegion, setHotelRegion] = useState('');
  const [hotelPhone, setHotelPhone] = useState('');
  const [hotelEmail, setHotelEmail] = useState('');
  const [hotelWebsite, setHotelWebsite] = useState('');
  const [hotelLatitude, setHotelLatitude] = useState('');
  const [hotelLongitude, setHotelLongitude] = useState('');
  const [hotelLocationError, setHotelLocationError] = useState('');
  const [amenitiesText, setAmenitiesText] = useState('');
  const [hotelStars, setHotelStars] = useState('0');
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelAddress, setNewHotelAddress] = useState('');
  const [newHotelCity, setNewHotelCity] = useState('');
  const [newHotelRegion, setNewHotelRegion] = useState('');
  const [newHotelPhone, setNewHotelPhone] = useState('');
  const [newHotelEmail, setNewHotelEmail] = useState('');
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [roomCapacity, setRoomCapacity] = useState('2');
  const [roomPrice, setRoomPrice] = useState('');
  const [roomUnits, setRoomUnits] = useState('1');
  const selectedHotel = hotels.find(hotel => hotel.id === selectedHotelId);

  useEffect(() => {
    if (!hotels.some(hotel => hotel.id === selectedHotelId)) {
      setSelectedHotelId(hotels[0]?.id ?? '');
    }
  }, [hotels, selectedHotelId]);

  useEffect(() => {
    if (!selectedHotel) {
      setPhotos([]);
      setRoomPhotos([]);
      setPhotoLimit(3);
      setPhotosLoading(false);
      setPhotosError('');
      return;
    }
    let active = true;
    setPhotosLoading(true);
    setPhotos([]);
    setRoomPhotos([]);
    setPhotoLimit(3);
    setPhotosError('');
    const loadPhotos = async () => {
      const client = requireSupabase();
      const hotelRoomIds = rooms.filter(room => room.hotel_id === selectedHotel.id).map(room => room.id);
      const [{ data, error }, { data: roomPhotoRows, error: roomPhotoError }, { data: subscription, error: subscriptionError }] = await Promise.all([
        client
          .from('hotel_photos')
          .select('*')
          .eq('hotel_id', selectedHotel.id)
          .order('sort_order', { ascending: true }),
        hotelRoomIds.length
          ? client
            .from('hotel_room_photos')
            .select('*')
            .in('room_id', hotelRoomIds)
            .order('sort_order', { ascending: true })
          : Promise.resolve({ data: [], error: null }),
        client
          .from('hotel_subscriptions')
          .select('plan_id')
          .eq('hotel_id', selectedHotel.id)
          .eq('status', 'active')
          .gt('current_period_end', new Date().toISOString())
          .limit(1)
          .maybeSingle(),
      ]);
      if (error || roomPhotoError || subscriptionError) {
        const loadError = error ?? roomPhotoError ?? subscriptionError;
        console.error('Impossible de charger les photos ou les droits de l’établissement:', loadError);
        if (active) {
          setPhotosError(loadError.message);
          setPhotosLoading(false);
        }
        return;
      }
      let limit = 3;
      if (subscription) {
        const { data: plan, error: planError } = await client
          .from('hotel_subscription_plans')
          .select('max_photos')
          .eq('id', subscription.plan_id)
          .maybeSingle();
        if (planError) {
          console.error('Impossible de charger la limite photo de la formule:', planError);
          if (active) {
            setPhotosError(planError.message);
            setPhotosLoading(false);
          }
          return;
        }
        if (plan) limit = plan.max_photos;
      }
      if (active) {
        setPhotos(data ?? []);
        setRoomPhotos(roomPhotoRows ?? []);
        setPhotoLimit(limit);
        setPhotosLoading(false);
      }
    };
    void loadPhotos();
    return () => {
      active = false;
    };
  }, [selectedHotel?.id, rooms]);

  const usedPhotoCount = photos.length;
  const remainingPhotoCount = Math.max(0, photoLimit - usedPhotoCount);

  useEffect(() => {
    if (!selectedHotel) return;
    setHotelLocationError('');
    setHotelName(selectedHotel.name);
    setHotelDescription(selectedHotel.description);
    setHotelAddress(selectedHotel.address);
    setHotelCity(selectedHotel.city);
    setHotelRegion(selectedHotel.region);
    setHotelPhone(selectedHotel.phone);
    setHotelEmail(selectedHotel.email);
    setHotelWebsite(selectedHotel.website ?? '');
    setHotelLatitude(selectedHotel.latitude === null ? '' : String(selectedHotel.latitude));
    setHotelLongitude(selectedHotel.longitude === null ? '' : String(selectedHotel.longitude));
    setAmenitiesText(selectedHotel.amenities.join(', '));
    setHotelStars(String(selectedHotel.stars));
    setCheckInTime(selectedHotel.check_in_time?.slice(0, 5) ?? '');
    setCheckOutTime(selectedHotel.check_out_time?.slice(0, 5) ?? '');
    setCancellationPolicy(selectedHotel.cancellation_policy);
  }, [selectedHotel]);

  const resetRoomForm = () => {
    setRoomId('');
    setRoomName('');
    setRoomDescription('');
    setRoomCapacity('2');
    setRoomPrice('');
    setRoomUnits('1');
  };

  const createHotel = (event: FormEvent) => {
    event.preventDefault();
    void runAction(async () => {
      if (!user) throw new Error('Connectez-vous pour enregistrer un établissement.');
      const { error } = await requireSupabase().from('hotels').insert({
        owner_id: user.id,
        name: newHotelName.trim(),
        description: '',
        address: newHotelAddress.trim(),
        city: newHotelCity.trim(),
        region: newHotelRegion.trim(),
        phone: newHotelPhone.trim(),
        email: newHotelEmail.trim(),
        website: null,
      });
      if (error) throw error;
      setNewHotelName('');
      setNewHotelAddress('');
      setNewHotelCity('');
      setNewHotelRegion('');
      setNewHotelPhone('');
      setNewHotelEmail('');
    }, 'La fiche a été soumise pour validation.');
  };

  const saveHotel = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedHotel) return;
    const latitude = hotelLatitude.trim() ? Number(hotelLatitude) : null;
    const longitude = hotelLongitude.trim() ? Number(hotelLongitude) : null;
    if ((latitude === null) !== (longitude === null)) {
      setHotelLocationError('Renseignez la latitude et la longitude, ou laissez les deux champs vides.');
      return;
    }
    if (
      latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) ||
      longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)
    ) {
      setHotelLocationError('Coordonnées invalides : latitude de -90 à 90 et longitude de -180 à 180.');
      return;
    }
    setHotelLocationError('');
    void runAction(async () => {
      const { error } = await requireSupabase().from('hotels').update({
        name: hotelName.trim(),
        description: hotelDescription.trim(),
        address: hotelAddress.trim(),
        city: hotelCity.trim(),
        region: hotelRegion.trim(),
        phone: hotelPhone.trim(),
        email: hotelEmail.trim(),
        website: hotelWebsite.trim() || null,
        latitude,
        longitude,
        amenities: amenitiesText.split(',').map(item => item.trim()).filter(Boolean),
        stars: Number(hotelStars),
        check_in_time: checkInTime || null,
        check_out_time: checkOutTime || null,
        cancellation_policy: cancellationPolicy.trim(),
        updated_at: new Date().toISOString(),
      }).eq('id', selectedHotel.id);
      if (error) throw error;
    }, 'La fiche a été enregistrée. Une modification des informations publiques exige une nouvelle validation.');
  };

  const useCurrentHotelLocation = () => {
    if (!navigator.geolocation) {
      setHotelLocationError('La géolocalisation n’est pas prise en charge par ce navigateur.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        setHotelLatitude(position.coords.latitude.toFixed(6));
        setHotelLongitude(position.coords.longitude.toFixed(6));
        setHotelLocationError('');
      },
      locationError => {
        const message = locationError.code === locationError.PERMISSION_DENIED
          ? 'Autorisez la géolocalisation pour renseigner la position de l’établissement.'
          : locationError.code === locationError.TIMEOUT
            ? 'La localisation a expiré. Réessayez ou saisissez les coordonnées manuellement.'
            : 'Position indisponible. Réessayez sur place ou saisissez les coordonnées manuellement.';
        setHotelLocationError(message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  };

  const submitRoom = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedHotel) return;
    void runAction(async () => {
      const client = requireSupabase();
      const roomValues = {
        name: roomName.trim(),
        description: roomDescription.trim(),
        capacity: Number(roomCapacity),
        price_xaf: Number(roomPrice),
        total_units: Number(roomUnits),
      };
      if (roomId) {
        const { error } = await client.from('hotel_rooms').update({
          ...roomValues,
          updated_at: new Date().toISOString(),
        }).eq('id', roomId);
        if (error) throw error;
      } else {
        const { data: newRoom, error } = await client.from('hotel_rooms')
          .insert({ ...roomValues, hotel_id: selectedHotel.id, is_active: true })
          .select('id')
          .single();
        if (error) throw error;
        setRoomPhotoManagementId(newRoom.id);
      }
      resetRoomForm();
    }, roomId ? 'La chambre a été modifiée.' : 'La chambre a été ajoutée.');
  };

  const uploadPhotos = (event: ChangeEvent<HTMLInputElement>, targetRoomId?: string) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!selectedHotel || !files.length) return;
    void runAction(async () => {
      const currentPhotoCount = targetRoomId
        ? roomPhotos.filter(photo => photo.room_id === targetRoomId).length
        : photos.length;
      const currentPhotoLimit = targetRoomId ? roomPhotoLimit : photoLimit;
      const remainingUploadCount = Math.max(0, currentPhotoLimit - currentPhotoCount);
      if (files.length > remainingUploadCount) {
        if (targetRoomId) {
          throw new Error(`Une chambre peut avoir au maximum ${roomPhotoLimit} photos. Il reste ${remainingUploadCount} emplacement(s) pour cette chambre.`);
        }
        throw new Error(`Votre formule autorise ${photoLimit} photo(s) au total. Il vous reste ${remainingPhotoCount} emplacement(s).`);
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      for (const file of files) {
        if (!allowedTypes.includes(file.type)) throw new Error('Formats acceptés : JPEG, PNG et WebP.');
        if (file.size > 5 * 1024 * 1024) throw new Error('Chaque photo doit faire 5 Mo maximum.');
      }

      const client = requireSupabase();
      const uploadedPaths: string[] = [];
      let uploadStage = 'Téléversement du fichier dans le stockage';
      try {
        for (const file of files) {
          const extension = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp';
          const path = targetRoomId
            ? `${selectedHotel.id}/rooms/${targetRoomId}/${crypto.randomUUID()}.${extension}`
            : `${selectedHotel.id}/${crypto.randomUUID()}.${extension}`;
          const { error } = await client.storage.from('hotel-gallery').upload(path, file, {
            contentType: file.type,
            upsert: false,
          });
          if (error) throw error;
          uploadedPaths.push(path);
        }
        uploadStage = targetRoomId ? 'Enregistrement des photos de la chambre' : 'Enregistrement des photos dans la galerie';
        const { data: newPhotos, error } = targetRoomId
          ? await client.from('hotel_room_photos').insert(uploadedPaths.map((path, index) => ({
            room_id: targetRoomId,
            storage_path: path,
            alt_text: files[index].name.replace(/\.[^.]+$/, '').slice(0, 250),
            sort_order: roomPhotos.filter(photo => photo.room_id === targetRoomId).length + index,
          }))).select()
          : await client.from('hotel_photos').insert(uploadedPaths.map((path, index) => ({
            hotel_id: selectedHotel.id,
            storage_path: path,
            alt_text: files[index].name.replace(/\.[^.]+$/, '').slice(0, 250),
            sort_order: photos.length + index,
          }))).select();
        if (error) throw error;
        if (targetRoomId) setRoomPhotos(current => [...current, ...(newPhotos ?? [])]);
        else setPhotos(current => [...current, ...(newPhotos ?? [])]);
      } catch (uploadError) {
        if (uploadedPaths.length) {
          const { error: cleanupError } = await client.storage.from('hotel-gallery').remove(uploadedPaths);
          if (cleanupError) console.error('Impossible de supprimer les fichiers dont la publication a échoué:', cleanupError);
        }
        const reason = uploadError instanceof Error ? uploadError.message : JSON.stringify(uploadError);
        throw new Error(`${uploadStage} : ${reason}`);
      }
    }, targetRoomId ? 'Les photos de la chambre ont été ajoutées.' : 'Les photos ont été ajoutées à la galerie.');
  };

  const removePhoto = (photo: Photo) => {
    void runAction(async () => {
      const client = requireSupabase();
      const { error: fileError } = await client.storage.from('hotel-gallery').remove([photo.storage_path]);
      if (fileError) throw fileError;
      const { error: rowError } = await client.from('hotel_photos').delete().eq('id', photo.id);
      if (rowError) throw rowError;
      setPhotos(current => current.filter(item => item.id !== photo.id));
    }, 'La photo a été supprimée.');
  };

  const removeRoomPhoto = (photo: RoomPhoto) => {
    void runAction(async () => {
      const client = requireSupabase();
      const { error: fileError } = await client.storage.from('hotel-gallery').remove([photo.storage_path]);
      if (fileError) throw fileError;
      const { error: rowError } = await client.from('hotel_room_photos').delete().eq('id', photo.id);
      if (rowError) throw rowError;
      setRoomPhotos(current => current.filter(item => item.id !== photo.id));
    }, 'La photo de la chambre a été supprimée.');
  };

  const toggleRoom = (room: Room) => {
    void runAction(async () => {
      const { error } = await requireSupabase().from('hotel_rooms')
        .update({ is_active: !room.is_active, updated_at: new Date().toISOString() })
        .eq('id', room.id);
      if (error) throw error;
    }, room.is_active ? 'La chambre est masquée du catalogue.' : 'La chambre est de nouveau active.');
  };

  const deleteRoom = (room: Room) => {
    if (!window.confirm(`Supprimer le type de chambre « ${room.name} » ?`)) return;
    void runAction(async () => {
      const client = requireSupabase();
      const { data: storedPhotos, error: photosError } = await client
        .from('hotel_room_photos')
        .select('storage_path')
        .eq('room_id', room.id);
      if (photosError) throw photosError;
      if (storedPhotos?.length) {
        const { error: fileError } = await client.storage.from('hotel-gallery').remove(storedPhotos.map(photo => photo.storage_path));
        if (fileError) throw fileError;
      }
      const { error } = await client.from('hotel_rooms').delete().eq('id', room.id);
      if (error) throw error;
      setRoomPhotos(current => current.filter(photo => photo.room_id !== room.id));
    }, 'Le type de chambre a été supprimé.');
  };

  return (
    <div className="space-y-6">
      <section className="page-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Building2 aria-hidden="true" className="h-6 w-6 text-[#174c3a]" />
          <div>
            <h2 className="text-xl font-semibold">Ajouter un établissement</h2>
            <p className="mt-1 text-sm text-[#68736b]">La fiche sera examinée avant sa publication.</p>
          </div>
        </div>
        <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={createHotel}>
          <label className="grid gap-2 text-sm font-medium">Nom de l’établissement<input className="input" required value={newHotelName} onChange={event => setNewHotelName(event.target.value)} /></label>
          <label className="grid gap-2 text-sm font-medium">Adresse<input className="input" required value={newHotelAddress} onChange={event => setNewHotelAddress(event.target.value)} /></label>
          <label className="grid gap-2 text-sm font-medium">Ville<input className="input" required value={newHotelCity} onChange={event => setNewHotelCity(event.target.value)} /></label>
          <label className="grid gap-2 text-sm font-medium">Région<input className="input" required value={newHotelRegion} onChange={event => setNewHotelRegion(event.target.value)} /></label>
          <label className="grid gap-2 text-sm font-medium">Téléphone<input className="input" type="tel" required value={newHotelPhone} onChange={event => setNewHotelPhone(event.target.value)} /></label>
          <label className="grid gap-2 text-sm font-medium">E-mail<input className="input" type="email" required value={newHotelEmail} onChange={event => setNewHotelEmail(event.target.value)} /></label>
          <button className="btn-primary w-full sm:w-fit" disabled={busy} type="submit"><Plus aria-hidden="true" className="h-4 w-4" /> Soumettre l’établissement</button>
        </form>
      </section>

      {!hotels.length ? (
        <p className="page-card p-6 text-sm text-[#68736b]">Après l’approbation de votre demande partenaire, ajoutez votre premier établissement ici.</p>
      ) : (
        <>
          <section className="page-card p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Fiche de l’établissement</h2>
                <p className="mt-1 text-sm text-[#68736b]">La modification des informations publiques renvoie la fiche en validation.</p>
              </div>
              <label className="grid gap-2 text-sm font-medium sm:min-w-64">Établissement
                <select className="input" value={selectedHotelId} onChange={event => setSelectedHotelId(event.target.value)}>
                  {hotels.map(hotel => <option key={hotel.id} value={hotel.id}>{hotel.name}</option>)}
                </select>
              </label>
            </div>
            {selectedHotel && (
              <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={saveHotel}>
                <label className="grid gap-2 text-sm font-medium">Nom<input className="input" required value={hotelName} onChange={event => setHotelName(event.target.value)} /></label>
                <label className="grid gap-2 text-sm font-medium">Adresse<input className="input" required value={hotelAddress} onChange={event => setHotelAddress(event.target.value)} /></label>
                <label className="grid gap-2 text-sm font-medium">Ville<input className="input" required value={hotelCity} onChange={event => setHotelCity(event.target.value)} /></label>
                <label className="grid gap-2 text-sm font-medium">Région<input className="input" required value={hotelRegion} onChange={event => setHotelRegion(event.target.value)} /></label>
                <label className="grid gap-2 text-sm font-medium">Téléphone<input className="input" type="tel" required value={hotelPhone} onChange={event => setHotelPhone(event.target.value)} /></label>
                <label className="grid gap-2 text-sm font-medium">E-mail<input className="input" type="email" required value={hotelEmail} onChange={event => setHotelEmail(event.target.value)} /></label>
                <label className="grid gap-2 text-sm font-medium">Site web<input className="input" type="url" placeholder="https://" value={hotelWebsite} onChange={event => setHotelWebsite(event.target.value)} /></label>
                <div className="grid gap-3 sm:col-span-2">
                  <div>
                    <p className="text-sm font-medium">Position GPS de l’établissement</p>
                    <p className="mt-1 text-xs text-[#68736b]">Renseignez-la depuis l’hôtel pour permettre aux voyageurs de trier les hébergements par proximité.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium">Latitude
                      <input className="input" type="number" step="any" min="-90" max="90" value={hotelLatitude} onChange={event => { setHotelLatitude(event.target.value); setHotelLocationError(''); }} placeholder="Ex. 3.848000" />
                    </label>
                    <label className="grid gap-2 text-sm font-medium">Longitude
                      <input className="input" type="number" step="any" min="-180" max="180" value={hotelLongitude} onChange={event => { setHotelLongitude(event.target.value); setHotelLocationError(''); }} placeholder="Ex. 11.502100" />
                    </label>
                  </div>
                  <button className="btn-secondary w-fit" type="button" disabled={busy} onClick={useCurrentHotelLocation}>
                    Utiliser ma position actuelle (à faire sur place)
                  </button>
                  {hotelLocationError && <p role="alert" className="text-sm text-red-700">{hotelLocationError}</p>}
                </div>
                <label className="grid gap-2 text-sm font-medium">Classement hôtelier
                  <select className="input" value={hotelStars} onChange={event => setHotelStars(event.target.value)}>
                    {[0, 1, 2, 3, 4, 5].map(stars => <option key={stars} value={stars}>{stars === 0 ? 'Non renseigné' : `${stars} étoile${stars > 1 ? 's' : ''}`}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium sm:col-span-2">Description
                  <textarea className="input min-h-28" maxLength={3000} value={hotelDescription} onChange={event => setHotelDescription(event.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-medium sm:col-span-2">Équipements (séparés par des virgules)
                  <input className="input" placeholder="Wi-Fi, Parking, Restaurant" value={amenitiesText} onChange={event => setAmenitiesText(event.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-medium">Heure d’arrivée<input className="input" type="time" value={checkInTime} onChange={event => setCheckInTime(event.target.value)} /></label>
                <label className="grid gap-2 text-sm font-medium">Heure de départ<input className="input" type="time" value={checkOutTime} onChange={event => setCheckOutTime(event.target.value)} /></label>
                <label className="grid gap-2 text-sm font-medium sm:col-span-2">Politique d’annulation
                  <textarea className="input min-h-20" maxLength={1000} value={cancellationPolicy} onChange={event => setCancellationPolicy(event.target.value)} />
                </label>
                <button className="btn-primary w-full sm:w-fit" disabled={busy} type="submit"><Save aria-hidden="true" className="h-4 w-4" /> Enregistrer la fiche</button>
              </form>
            )}
          </section>

          {selectedHotel && (
            <section className="page-card p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Photos de l’établissement</h2>
                  <p className="mt-1 text-sm text-[#68736b]">JPG, PNG ou WebP · 5 Mo maximum par image. Chaque chambre dispose en plus de son propre quota de trois photos.</p>
                  <p className="mt-1 text-sm font-medium text-[#174c3a]">{usedPhotoCount}/{photoLimit} photos de l’établissement utilisées · {remainingPhotoCount} emplacement(s) restant(s)</p>
                </div>
                <label className={`btn-secondary ${remainingPhotoCount ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`} aria-disabled={remainingPhotoCount === 0}>
                  <ImagePlus aria-hidden="true" className="h-4 w-4" /> Ajouter des photos
                  <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy || remainingPhotoCount === 0} onChange={uploadPhotos} />
                </label>
              </div>
              {photosError && <p role="alert" className="mt-3 text-sm text-red-700">Impossible de charger la galerie : {photosError}</p>}
              {photos.length ? (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {photos.map((photo, index) => {
                    const imageUrl = requireSupabase().storage.from('hotel-gallery').getPublicUrl(photo.storage_path).data.publicUrl;
                    return (
                      <figure key={photo.id} className="relative overflow-hidden rounded-xl border border-[#e8e7e0]">
                        <img className="aspect-[4/3] w-full object-cover" src={imageUrl} alt={photo.alt_text || selectedHotel.name} />
                        {index === 0 && <figcaption className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold">Photo principale</figcaption>}
                        <button type="button" aria-label={`Supprimer la photo ${index + 1}`} disabled={busy} onClick={() => removePhoto(photo)} className="absolute right-2 top-2 rounded-full bg-white p-2 text-red-700 shadow">
                          <Trash2 aria-hidden="true" className="h-4 w-4" />
                        </button>
                      </figure>
                    );
                  })}
                </div>
              ) : <p className="mt-5 rounded-xl bg-[#f5f1e8] p-4 text-sm text-[#5c4324]">Aucune photo ajoutée. Une image générique sera affichée jusqu’à votre premier téléversement.</p>}
            </section>
          )}

          <section className="page-card p-6 sm:p-8">
            <h2 className="text-xl font-semibold">{roomId ? 'Modifier le type de chambre' : 'Ajouter un type de chambre'}</h2>
            <p className="mt-2 text-sm leading-6 text-[#68736b]">Renseignez le tarif par nuit, la capacité et le nombre d’unités déclarées.</p>
            {selectedHotel && (
              <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={submitRoom}>
                <label className="grid gap-2 text-sm font-medium">Nom du type de chambre<input className="input" required value={roomName} onChange={event => setRoomName(event.target.value)} /></label>
                <label className="grid gap-2 text-sm font-medium">Capacité<input className="input" type="number" min="1" max="100" required value={roomCapacity} onChange={event => setRoomCapacity(event.target.value)} /></label>
                <label className="grid gap-2 text-sm font-medium">Prix/nuit (XAF)<input className="input" type="number" min="1" required value={roomPrice} onChange={event => setRoomPrice(event.target.value)} /></label>
                <label className="grid gap-2 text-sm font-medium">Nombre d’unités<input className="input" type="number" min="1" required value={roomUnits} onChange={event => setRoomUnits(event.target.value)} /></label>
                <label className="grid gap-2 text-sm font-medium sm:col-span-2">Description<textarea className="input min-h-20" value={roomDescription} onChange={event => setRoomDescription(event.target.value)} /></label>
                <div className="flex flex-wrap gap-3 sm:col-span-2">
                  <button className="btn-primary" disabled={busy} type="submit">{roomId ? <Save aria-hidden="true" className="h-4 w-4" /> : <Plus aria-hidden="true" className="h-4 w-4" />}{roomId ? 'Enregistrer la chambre' : 'Ajouter la chambre'}</button>
                  {roomId && <button className="btn-secondary" type="button" onClick={resetRoomForm}><X aria-hidden="true" className="h-4 w-4" /> Annuler</button>}
                </div>
              </form>
            )}
          </section>

          <section className="page-card p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Mes établissements et chambres</h2>
            <div className="mt-5 space-y-5">
              {hotels.map(hotel => (
                <article key={hotel.id} className="rounded-xl border border-[#e8e7e0] p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div><h3 className="font-semibold">{hotel.name}</h3><p className="mt-1 text-sm text-[#68736b]">{hotel.address}, {hotel.city} · {hotel.region}</p></div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#f5f1e8] px-3 py-1 text-xs font-semibold capitalize text-[#5c4324]">{hotel.status === 'approved' ? 'Publié' : hotel.status === 'rejected' ? 'Refusé' : 'En validation'}</span>
                      {hotel.id !== selectedHotelId && <button type="button" className="btn-secondary min-h-10 px-3 py-2 text-sm" onClick={() => setSelectedHotelId(hotel.id)}>Gérer cet établissement</button>}
                    </div>
                  </div>
                  <div className="mt-4 divide-y divide-[#e8e7e0]">
                    {rooms.filter(room => room.hotel_id === hotel.id).map(room => (
                      <div key={room.id} className="py-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div><p className="font-medium">{room.name}</p><p className="text-sm text-[#68736b]">{room.capacity} personne(s) · {room.price_xaf.toLocaleString()} XAF/nuit · {room.total_units} unité(s) déclarée(s)</p><p className="text-xs text-[#68736b]">{room.is_active ? 'Visible sur la fiche publiée' : 'Masquée'}</p></div>
                          <div className="flex flex-wrap gap-2">
                            <button type="button" disabled={busy} onClick={() => { setSelectedHotelId(hotel.id); setRoomId(room.id); setRoomName(room.name); setRoomDescription(room.description); setRoomCapacity(String(room.capacity)); setRoomPrice(String(room.price_xaf)); setRoomUnits(String(room.total_units)); }} className="btn-secondary min-h-10 px-3 py-2 text-sm"><Pencil aria-hidden="true" className="h-4 w-4" /> Modifier</button>
                            <button type="button" disabled={busy} onClick={() => toggleRoom(room)} className="btn-secondary min-h-10 px-3 py-2 text-sm">{room.is_active ? 'Désactiver' : 'Activer'}</button>
                            <button type="button" disabled={busy} onClick={() => deleteRoom(room)} className="btn-secondary min-h-10 px-3 py-2 text-sm text-red-700"><Trash2 aria-hidden="true" className="h-4 w-4" /> Supprimer</button>
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            setSelectedHotelId(hotel.id);
                            setRoomPhotoManagementId(current => current === room.id ? '' : room.id);
                          }}
                          className="btn-secondary mt-3 min-h-9 px-3 py-2 text-sm"
                        >
                          <ImagePlus aria-hidden="true" className="h-4 w-4" />
                          {roomPhotoManagementId === room.id ? 'Fermer les photos' : 'Gérer les photos de cette chambre'}
                        </button>
                        {roomPhotoManagementId === room.id && hotel.id === selectedHotelId && (
                          <div className="mt-3">
                            <p className="mb-2 text-sm text-[#68736b]">Ajoutez jusqu’à {roomPhotoLimit} photos qui seront visibles sur la fiche publique de cette chambre. {roomPhotos.filter(photo => photo.room_id === room.id).length}/{roomPhotoLimit} ajoutée(s).</p>
                            <label className={`btn-secondary min-h-9 px-3 py-2 text-sm ${roomPhotos.filter(photo => photo.room_id === room.id).length < roomPhotoLimit && !photosLoading ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`} aria-disabled={roomPhotos.filter(photo => photo.room_id === room.id).length >= roomPhotoLimit || photosLoading}>
                              <ImagePlus aria-hidden="true" className="h-4 w-4" /> Ajouter une photo à cette chambre
                              <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy || photosLoading || roomPhotos.filter(photo => photo.room_id === room.id).length >= roomPhotoLimit} onChange={event => uploadPhotos(event, room.id)} />
                            </label>
                            {photosLoading && <p role="status" className="mt-2 text-sm text-[#68736b]">Chargement des photos et du quota...</p>}
                            {roomPhotos.filter(photo => photo.room_id === room.id).length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {roomPhotos.filter(photo => photo.room_id === room.id).map((photo, index) => (
                                  <figure key={photo.id} className="relative h-20 w-28 overflow-hidden rounded-lg border border-[#e8e7e0]">
                                    <img className="h-full w-full object-cover" src={requireSupabase().storage.from('hotel-gallery').getPublicUrl(photo.storage_path).data.publicUrl} alt={photo.alt_text || `${room.name}, photo ${index + 1}`} />
                                    <button type="button" aria-label={`Supprimer la photo ${index + 1} de ${room.name}`} disabled={busy} onClick={() => removeRoomPhoto(photo)} className="absolute right-1 top-1 rounded-full bg-white p-1.5 text-red-700 shadow">
                                      <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                                    </button>
                                  </figure>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {rooms.every(room => room.hotel_id !== hotel.id) && <p className="py-3 text-sm text-[#68736b]">Aucune chambre ajoutée.</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default HotelierWorkspace;
