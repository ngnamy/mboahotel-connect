import { useEffect, useState } from 'react';
import { isSupabaseConfigured, requireSupabase } from './supabase';

export interface PublicHotelRoom {
  id: string;
  name: string;
  description: string;
  capacity: number;
  price: number;
  totalUnits: number;
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
  image: string;
  amenities: string[];
  stars: number;
  price: number;
  rooms: PublicHotelRoom[];
}

export const usePublicHotels = (hotelId?: string) => {
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
          .select('id,name,description,address,city,region,phone,email,website,status')
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

        const { data: roomRows, error: roomError } = await client
          .from('hotel_rooms')
          .select('id,hotel_id,name,description,capacity,price_xaf,total_units')
          .eq('is_active', true)
          .in('hotel_id', rows.map(hotel => hotel.id))
          .order('price_xaf', { ascending: true });
        if (roomError) throw roomError;

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
          });
          roomsByHotel.set(room.hotel_id, hotelRooms);
        }

        const listings = rows.map(hotel => {
          const rooms = roomsByHotel.get(hotel.id) ?? [];
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
            image: '/images/hotels/hotel-placeholder.svg',
            amenities: [],
            stars: 0,
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
  }, [hotelId]);

  return { hotels, isConfigured: isSupabaseConfigured, isLoading, error };
};
