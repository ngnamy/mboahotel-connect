// Interface pour les coordonnées géographiques
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Interface pour un hôtel avec coordonnées
export interface HotelWithLocation {
  id: string;
  name: string;
  location: string;
  city: string;
  coordinates: Coordinates;
  distance?: number; // Distance en kilomètres
}

/**
 * Calcule la distance entre deux points géographiques en utilisant la formule de Haversine
 * @param coord1 Coordonnées du premier point
 * @param coord2 Coordonnées du second point
 * @returns Distance en kilomètres
 */
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  // Vérification de sécurité
  if (!coord1 || !coord2 || 
      typeof coord1.latitude !== 'number' || typeof coord1.longitude !== 'number' ||
      typeof coord2.latitude !== 'number' || typeof coord2.longitude !== 'number') {
    return 0;
  }

  const R = 6371; // Rayon de la Terre en kilomètres
  
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) * Math.cos(toRadians(coord2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

/**
 * Convertit les degrés en radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Trie les hôtels par distance croissante
 */
export const sortHotelsByDistance = <T extends { distance?: number }>(hotels: T[]): T[] => {
  return hotels.sort((a, b) => {
    if (a.distance === undefined && b.distance === undefined) return 0;
    if (a.distance === undefined) return 1;
    if (b.distance === undefined) return -1;
    return a.distance - b.distance;
  });
};

/**
 * Filtre les hôtels dans un rayon donné
 */
export const filterHotelsByRadius = <T extends { distance?: number }>(
  hotels: T[], 
  maxDistance: number
): T[] => {
  return hotels.filter(hotel => 
    hotel.distance !== undefined && hotel.distance <= maxDistance
  );
};

/**
 * Formate la distance pour l'affichage
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

// Interface pour les détails de localisation
export interface LocationDetails {
  city: string;
  district?: string;
  street?: string;
  fullAddress?: string;
  country?: string;
  region?: string;
  postcode?: string;
  houseNumber?: string;
  neighbourhood?: string;
}

/**
 * Obtient la ville la plus proche basée sur les coordonnées
 * (Fonction simplifiée pour le Cameroun)
 */
export const getNearestCity = (coordinates: Coordinates): string => {
  const cities = [
    { name: 'Yaoundé', lat: 3.8480, lng: 11.5021 },
    { name: 'Douala', lat: 4.0511, lng: 9.7679 },
    { name: 'Bafoussam', lat: 5.4781, lng: 10.4167 },
    { name: 'Bamenda', lat: 5.9597, lng: 10.1494 },
    { name: 'Garoua', lat: 9.3265, lng: 13.3958 },
    { name: 'Maroua', lat: 10.5913, lng: 14.3153 },
    { name: 'Ngaoundéré', lat: 7.3167, lng: 13.5833 },
  ];

  let nearestCity = cities[0];
  let minDistance = calculateDistance(coordinates, { 
    latitude: cities[0].lat, 
    longitude: cities[0].lng 
  });

  cities.forEach(city => {
    const distance = calculateDistance(coordinates, { 
      latitude: city.lat, 
      longitude: city.lng 
    });
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  });

  return nearestCity.name;
};

/**
 * Obtient les détails de localisation via géocodage inversé
 * Utilise l'API Nominatim d'OpenStreetMap (gratuite)
 */
export const getLocationDetails = async (coordinates: Coordinates): Promise<LocationDetails> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.latitude}&lon=${coordinates.longitude}&zoom=18&addressdetails=1&accept-language=fr`
    );
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des détails de localisation');
    }
    
    const data = await response.json();
    
    // Extraire les informations d'adresse
    const address = data.address || {};
    
    const locationDetails: LocationDetails = {
      city: address.city || address.town || address.village || getNearestCity(coordinates),
      district: address.suburb || address.neighbourhood || address.quarter || address.district,
      street: address.road || address.street,
      country: address.country || 'Cameroun',
      region: address.state || address.region,
      postcode: address.postcode,
      houseNumber: address.house_number,
      neighbourhood: address.neighbourhood || address.suburb,
      fullAddress: data.display_name || ''
    };
    
    return locationDetails;
  } catch (error) {
    console.error('Erreur lors du géocodage inversé:', error);
    
    // Fallback vers la détection de ville simple
    return {
      city: getNearestCity(coordinates),
      country: 'Cameroun'
    };
  }
};

/**
 * Formate les détails de localisation pour l'affichage
 */
export const formatLocationDetails = (details: LocationDetails): string => {
  const parts = [];
  
  if (details.houseNumber && details.street) {
    parts.push(`${details.houseNumber} ${details.street}`);
  } else if (details.street) {
    parts.push(details.street);
  }
  
  if (details.neighbourhood || details.district) {
    parts.push(details.neighbourhood || details.district);
  }
  
  if (details.city) {
    parts.push(details.city);
  }
  
  if (details.region && details.region !== details.city) {
    parts.push(details.region);
  }
  
  return parts.join(', ') || details.city || 'Position inconnue';
};

/**
 * Formate une adresse courte pour l'affichage compact
 */
export const formatShortAddress = (details: LocationDetails): string => {
  const parts = [];
  
  if (details.neighbourhood || details.district) {
    parts.push(details.neighbourhood || details.district);
  }
  
  if (details.city) {
    parts.push(details.city);
  }
  
  return parts.join(', ') || details.city || 'Position inconnue';
};