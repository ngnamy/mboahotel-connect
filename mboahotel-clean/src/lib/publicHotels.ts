import { useEffect, useState } from 'react';
import { isSupabaseConfigured, requireSupabase } from './supabase';

export interface PublicHotelRoom {
  id: string;
  name: string;
  description: string;
  capacity: number;
  price: number;
  totalUnits: number;
  availableUnits: number | null;
  availabilityForDates: boolean;
  images: string[];
}

export interface PublicHotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  region: string;
  phone: string;
  email: string;
  website: string | null;
  coordinates: { latitude: number; longitude: number } | null;
  image: string;
  amenities: string[];
  stars: number;
  priorityListing: boolean;
  featuredListing: boolean;
  reservationsEnabled: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  cancellationPolicy: string;
  images: string[];
  price: number;
  rooms: PublicHotelRoom[];
}

export const usePublicHotels = (hotelId?: string, checkIn?: string, checkOut?: string) => {
  const [hotels, setHotels] = useState<PublicHotel[]>([]);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setHotels([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let active = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const client = requireSupabase();
        let hotelQuery = client
          .from('hotels')
          .select('id,name,description,address,city,region,phone,email,website,latitude,longitude,status,amenities,stars,check_in_time,check_out_time,cancellation_policy')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });
        if (hotelId) hotelQuery = hotelQuery.eq('id', hotelId);

        const { data: hotelRows, error: hotelError } = await hotelQuery;
        if (hotelError) throw hotelError;
        const rows = hotelRows ?? [];
        if (!rows.length) {
          if (active) setHotels([]);
          return;
        }

        const [{ data: roomRows, error: roomError }, { data: photoRows, error: photoError }, { data: entitlementRows, error: entitlementError }] = await Promise.all([
          client
            .from('hotel_rooms')
            .select('id,hotel_id,name,description,capacity,price_xaf,total_units')
            .eq('is_active', true)
            .in('hotel_id', rows.map(hotel => hotel.id))
            .order('price_xaf', { ascending: true }),
          client
            .from('hotel_photos')
            .select('hotel_id,storage_path,sort_order')
            .in('hotel_id', rows.map(hotel => hotel.id))
            .order('sort_order', { ascending: true }),
          client.rpc('get_public_hotel_entitlements', { p_hotel_ids: rows.map(hotel => hotel.id) }),
        ]);
        if (roomError) throw roomError;
        if (photoError) throw photoError;
        if (entitlementError) throw entitlementError;

        const roomIds = (roomRows ?? []).map(room => room.id);
        const validStay = Boolean(checkIn && checkOut && checkOut > checkIn);
        const { data: availabilityRows, error: availabilityError } = validStay && roomIds.length
          ? await client.rpc('get_public_room_availability', {
            p_room_ids: roomIds,
            p_check_in: checkIn,
            p_check_out: checkOut,
          })
          : { data: [], error: null };
        if (availabilityError) throw availabilityError;
        const availabilityByRoom = new Map((availabilityRows ?? []).map(item => [item.room_id, item]));
        const { data: roomPhotoRows, error: roomPhotoError } = roomIds.length
          ? await client
            .from('hotel_room_photos')
            .select('room_id,storage_path,sort_order')
            .in('room_id', roomIds)
            .order('sort_order', { ascending: true })
          : { data: [], error: null };
        if (roomPhotoError) throw roomPhotoError;

        const roomPhotosByRoom = new Map<string, string[]>();
        for (const photo of roomPhotoRows ?? []) {
          const images = roomPhotosByRoom.get(photo.room_id) ?? [];
          images.push(client.storage.from('hotel-gallery').getPublicUrl(photo.storage_path).data.publicUrl);
          roomPhotosByRoom.set(photo.room_id, images);
        }
        const roomsByHotel = new Map<string, PublicHotelRoom[]>();
        for (const room of roomRows ?? []) {
          const hotelRooms = roomsByHotel.get(room.hotel_id) ?? [];
          hotelRooms.push({
            id: room.id,
            name: room.name,
            description: room.description,
            capacity: room.capacity,
            price: room.price_xaf,
            totalUnits: room.total_units,
            availableUnits: validStay ? availabilityByRoom.get(room.id)?.available_units ?? null : null,
            availabilityForDates: validStay,
            images: roomPhotosByRoom.get(room.id) ?? [],
          });
          roomsByHotel.set(room.hotel_id, hotelRooms);
        }

        const photosByHotel = new Map<string, string[]>();
        for (const photo of photoRows ?? []) {
          const images = photosByHotel.get(photo.hotel_id) ?? [];
          images.push(client.storage.from('hotel-gallery').getPublicUrl(photo.storage_path).data.publicUrl);
          photosByHotel.set(photo.hotel_id, images);
        }

        const entitlementsByHotel = new Map((entitlementRows ?? []).map(item => [item.hotel_id, item]));
        const listings = rows.map(hotel => {
          const rooms = roomsByHotel.get(hotel.id) ?? [];
          const images = photosByHotel.get(hotel.id) ?? [];
          const entitlements = entitlementsByHotel.get(hotel.id);
          return {
            id: hotel.id,
            name: hotel.name,
            description: hotel.description.trim(),
            address: hotel.address,
            city: hotel.city,
            region: hotel.region,
            phone: hotel.phone,
            email: hotel.email,
            website: hotel.website,
            coordinates: hotel.latitude !== null && hotel.longitude !== null
              ? { latitude: hotel.latitude, longitude: hotel.longitude }
              : null,
            image: images[0] ?? '/images/hotels/hotel-placeholder.svg',
            images: images.length ? images : ['/images/hotels/hotel-placeholder.svg'],
            amenities: hotel.amenities ?? [],
            stars: hotel.stars ?? 0,
            priorityListing: entitlements?.priority_listing ?? false,
            featuredListing: entitlements?.featured_listing ?? false,
            reservationsEnabled: Boolean(entitlements),
            checkInTime: hotel.check_in_time,
            checkOutTime: hotel.check_out_time,
            cancellationPolicy: hotel.cancellation_policy,
            price: rooms[0]?.price ?? 0,
            rooms,
          };
        });
        if (active) setHotels(listings);
      } catch (loadError) {
        console.error('Impossible de charger les établissements publiés:', loadError);
        if (active) {
          setHotels([]);
          setError('Les établissements publiés sont momentanément indisponibles. Réessayez dans quelques instants.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [hotelId, checkIn, checkOut]);

  return { hotels, isConfigured: isSupabaseConfigured, isLoading, error };
};
