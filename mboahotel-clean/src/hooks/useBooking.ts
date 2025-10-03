import { useState } from 'react';
import { BookingDetails } from '../types/booking';

export const useBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (bookingDetails: BookingDetails) => {
    setIsLoading(true);
    try {
      // Simuler un appel API (à remplacer par votre véritable appel API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ajoutez ici votre logique d'appel API
      console.log('Réservation créée:', bookingDetails);
      
      return bookingDetails;
    } catch (err) {
      setError('Erreur lors de la création de la réservation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createBooking, isLoading, error };
};