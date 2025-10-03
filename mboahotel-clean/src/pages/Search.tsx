import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Calendar, Users, Star, Wifi, Car, Coffee, Waves, Plane, UtensilsCrossed, Presentation, Snowflake, Heart, Filter, ChevronDown } from 'lucide-react';
import Pagination from '../components/Pagination';
import LocationSearchSimple from '../components/LocationSearchSimple';
import { calculateDistance, sortHotelsByDistance, formatDistance } from '../utils/geolocation';

interface Hotel {
  id: string;
  name: string;
  type: string;
  location: string;
  city: string;
  rating: number;
  reviewCount: number;
  price: number;
  image: string;
  amenities: string[];
  stars: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
}

const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Hôtel La Falaise',
    type: 'Hôtel 4 étoiles',
    location: 'Bastos, Yaoundé',
    city: 'Yaoundé',
    rating: 8.5,
    reviewCount: 150,
    price: 45000,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center',
    amenities: ['Piscine', 'Wi-Fi gratuit', 'Restaurant', 'Parking'],
    stars: 4,
    coordinates: { latitude: 3.8480, longitude: 11.5021 }
  },
  {
    id: '2',
    name: 'Résidence Mont Fébé',
    type: 'Résidence 3 étoiles',
    location: 'Mont Fébé, Yaoundé',
    city: 'Yaoundé',
    rating: 7.8,
    reviewCount: 89,
    price: 32000,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop&crop=center',
    amenities: ['Wi-Fi gratuit', 'Petit-déjeuner inclus', 'Climatisation'],
    stars: 3,
    coordinates: { latitude: 3.8650, longitude: 11.5180 }
  },
  {
    id: '3',
    name: 'Hôtel Akwa Palace',
    type: 'Hôtel 5 étoiles',
    location: 'Akwa, Douala',
    city: 'Douala',
    rating: 9.2,
    reviewCount: 203,
    price: 75000,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop&crop=center',
    amenities: ['Piscine', 'Wi-Fi gratuit', 'Restaurant', 'Salle de conférence', 'Navette aéroport'],
    stars: 5,
    coordinates: { latitude: 4.0511, longitude: 9.7679 }
  },
  {
    id: '4',
    name: 'Hôtel des Députés',
    type: 'Hôtel 3 étoiles',
    location: 'Centre-ville, Yaoundé',
    city: 'Yaoundé',
    rating: 7.5,
    reviewCount: 67,
    price: 28000,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&crop=center',
    amenities: ['Wi-Fi gratuit', 'Restaurant', 'Parking'],
    stars: 3,
    coordinates: { latitude: 3.8667, longitude: 11.5167 }
  },
  {
    id: '5',
    name: 'Pullman Douala Rabingha',
    type: 'Hôtel 5 étoiles',
    location: 'Rabingha, Douala',
    city: 'Douala',
    rating: 8.8,
    reviewCount: 145,
    price: 95000,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop&crop=center',
    amenities: ['Piscine', 'Wi-Fi gratuit', 'Restaurant', 'Spa', 'Salle de fitness'],
    stars: 5,
    coordinates: { latitude: 4.0611, longitude: 9.7879 }
  },
  {
    id: '6',
    name: 'Hôtel Altitel',
    type: 'Hôtel 4 étoiles',
    location: 'Centre-ville, Bafoussam',
    city: 'Bafoussam',
    rating: 8.1,
    reviewCount: 92,
    price: 38000,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&crop=center',
    amenities: ['Wi-Fi gratuit', 'Restaurant', 'Parking', 'Climatisation'],
    stars: 4,
    coordinates: { latitude: 5.4781, longitude: 10.4167 }
  },
  {
    id: '7',
    name: 'Ayaba Hotel',
    type: 'Hôtel 3 étoiles',
    location: 'Station Hill, Bamenda',
    city: 'Bamenda',
    rating: 7.2,
    reviewCount: 54,
    price: 25000,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop&crop=center',
    amenities: ['Wi-Fi gratuit', 'Restaurant', 'Parking'],
    stars: 3,
    coordinates: { latitude: 5.9597, longitude: 10.1494 }
  },
  {
    id: '4',
    name: 'Hôtel Ibis Douala',
    type: 'Hôtel 3 étoiles',
    location: 'Bonanjo, Douala',
    city: 'Douala',
    rating: 7.5,
    reviewCount: 124,
    price: 38000,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&crop=center',
    amenities: ['Wi-Fi gratuit', 'Restaurant', 'Climatisation', 'Parking'],
    stars: 3,
    coordinates: { latitude: 4.0483, longitude: 9.7043 }
  },
  {
    id: '5',
    name: 'Hôtel Altitel Bafoussam',
    type: 'Hôtel 3 étoiles',
    location: 'Centre-ville, Bafoussam',
    city: 'Bafoussam',
    rating: 7.2,
    reviewCount: 67,
    price: 28000,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop&crop=center',
    amenities: ['Wi-Fi gratuit', 'Restaurant', 'Parking'],
    stars: 3,
    coordinates: { latitude: 5.4781, longitude: 10.4167 }
  },
  {
    id: '6',
    name: 'Ayaba Hotel Bamenda',
    type: 'Hôtel 4 étoiles',
    location: 'Commercial Avenue, Bamenda',
    city: 'Bamenda',
    rating: 8.1,
    reviewCount: 95,
    price: 42000,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&crop=center',
    amenities: ['Wi-Fi gratuit', 'Restaurant', 'Bar', 'Parking', 'Climatisation'],
    stars: 4,
    coordinates: { latitude: 5.9597, longitude: 10.1494 }
  },
  {
    id: '7',
    name: 'Hôtel Djeuga Palace',
    type: 'Hôtel 4 étoiles',
    location: 'Centre-ville, Yaoundé',
    city: 'Yaoundé',
    rating: 8.0,
    reviewCount: 178,
    price: 48000,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop&crop=center',
    amenities: ['Piscine', 'Wi-Fi gratuit', 'Restaurant', 'Salle de fitness', 'Spa'],
    stars: 4,
    coordinates: { latitude: 3.8667, longitude: 11.5167 }
  },
  {
    id: '8',
    name: 'Pullman Douala Rabingha',
    type: 'Hôtel 5 étoiles',
    location: 'Rabingha, Douala',
    city: 'Douala',
    rating: 9.0,
    reviewCount: 156,
    price: 85000,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop&crop=center',
    amenities: ['Piscine', 'Wi-Fi gratuit', 'Restaurant gastronomique', 'Spa', 'Salle de conférence', 'Navette aéroport'],
    stars: 5,
    coordinates: { latitude: 4.0611, longitude: 9.7879 }
  },
  {
    id: '9',
    name: 'Hôtel Franco',
    type: 'Hôtel 3 étoiles',
    location: 'Mvan, Yaoundé',
    city: 'Yaoundé',
    rating: 7.3,
    reviewCount: 112,
    price: 35000,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop&crop=center',
    amenities: ['Wi-Fi gratuit', 'Restaurant', 'Parking', 'Climatisation'],
    stars: 3,
    coordinates: { latitude: 3.8580, longitude: 11.5123 }
  },
  {
    id: '10',
    name: 'Résidence La Fontaine',
    type: 'Résidence 2 étoiles',
    location: 'Bafoussam',
    city: 'Bafoussam',
    rating: 6.8,
    reviewCount: 43,
    price: 22000,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop&crop=center',
    amenities: ['Wi-Fi gratuit', 'Parking'],
    stars: 2,
    coordinates: { latitude: 5.4681, longitude: 10.4067 }
  },
  {
    id: '11',
    name: 'Presbyterian Guest House',
    type: 'Auberge 2 étoiles',
    location: 'Station Hill, Bamenda',
    city: 'Bamenda',
    rating: 7.0,
    reviewCount: 58,
    price: 25000,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop&crop=center',
    amenities: ['Wi-Fi gratuit', 'Restaurant', 'Parking'],
    stars: 2,
    coordinates: { latitude: 5.9697, longitude: 10.1594 }
  },
  {
    id: '12',
    name: 'Hôtel des Députés',
    type: 'Hôtel 3 étoiles',
    location: 'Quartier du Lac, Yaoundé',
    city: 'Yaoundé',
    rating: 7.6,
    reviewCount: 87,
    price: 40000,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop&crop=center',
    amenities: ['Wi-Fi gratuit', 'Restaurant', 'Bar', 'Parking', 'Piscine'],
    stars: 3,
    coordinates: { latitude: 3.8567, longitude: 11.5267 }
  }
];

const Search: React.FC = () => {
  const [urlSearchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  
  const [searchParams, setSearchParams] = useState({
    destination: urlSearchParams.get('destination') || '',
    checkIn: urlSearchParams.get('checkIn') || '',
    checkOut: urlSearchParams.get('checkOut') || '',
    guests: parseInt(urlSearchParams.get('guests') || '2')
  });

  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    minRating: 0,
    minStars: 0,
    amenities: [] as string[],
    hotelType: '',
    policies: [] as string[]
  });

  const [sortBy, setSortBy] = useState('price');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Nombre d'hôtels par page
  
  // État pour la géolocalisation
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    city: string;
    details?: any;
  } | null>(null);

  // Mettre à jour les paramètres de recherche quand l'URL change
  useEffect(() => {
    setSearchParams({
      destination: urlSearchParams.get('destination') || '',
      checkIn: urlSearchParams.get('checkIn') || '',
      checkOut: urlSearchParams.get('checkOut') || '',
      guests: parseInt(urlSearchParams.get('guests') || '2')
    });
  }, [urlSearchParams]);

  // Fonctions pour la géolocalisation - Version simplifiée
  const handleLocationFound = (latitude: number, longitude: number, city: string, details?: any) => {
    console.log('Location found:', { latitude, longitude, city, details });
    setUserLocation({ latitude, longitude, city, details });
    
    // Mettre automatiquement la destination
    setSearchParams(prev => ({ ...prev, destination: city }));
    
    // Changer automatiquement le tri par distance
    setSortBy('distance');
    
    setError(null);
  };

  const handleLocationCleared = () => {
    setUserLocation(null);
  };

  // Calculer les distances quand la position de l'utilisateur change
  const calculateHotelDistances = (hotels: Hotel[]) => {
    if (!userLocation) return hotels;

    return hotels.map(hotel => {
      // Vérifier que l'hôtel a des coordonnées valides
      if (!hotel.coordinates || 
          typeof hotel.coordinates.latitude !== 'number' || 
          typeof hotel.coordinates.longitude !== 'number') {
        return hotel; // Retourner l'hôtel sans distance si pas de coordonnées
      }

      return {
        ...hotel,
        distance: calculateDistance(
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          hotel.coordinates
        )
      };
    });
  };

  // Réinitialiser la pagination quand le tri ou le nombre d'éléments par page change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, itemsPerPage]);

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Wi-Fi gratuit': <Wifi className="w-4 h-4" />,
    'Parking': <Car className="w-4 h-4" />,
    'Petit-déjeuner inclus': <Coffee className="w-4 h-4" />,
    'Piscine': <Waves className="w-4 h-4" />,
    'Navette aéroport': <Plane className="w-4 h-4" />,
    'Restaurant': <UtensilsCrossed className="w-4 h-4" />,
    'Salle de conférence': <Presentation className="w-4 h-4" />,
    'Climatisation': <Snowflake className="w-4 h-4" />
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handlePolicyToggle = (policy: string) => {
    setFilters(prev => ({
      ...prev,
      policies: prev.policies.includes(policy)
        ? prev.policies.filter(p => p !== policy)
        : [...prev.policies, policy]
    }));
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      minRating: rating
    }));
  };

  const handleStarsChange = (stars: number) => {
    setFilters(prev => ({
      ...prev,
      minStars: stars
    }));
  };

  const handleHotelTypeChange = (type: string) => {
    setFilters(prev => ({
      ...prev,
      hotelType: prev.hotelType === type ? '' : type
    }));
  };

  const getRatingText = (rating: number) => {
    if (rating >= 9) return 'Exceptionnel';
    if (rating >= 8) return 'Excellent';
    if (rating >= 7) return 'Très bien';
    if (rating >= 6) return 'Bien';
    return 'Correct';
  };

  // Fonction de tri des hôtels
  const sortHotels = (hotels: Hotel[], sortBy: string) => {
    const sorted = [...hotels];
    switch (sortBy) {
      case 'price':
        return sorted.sort((a, b) => a.price - b.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'popular':
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      default:
        return sorted;
    }
  };



  // Fonction de navigation de pagination
  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll vers le haut de la liste
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fonction de filtrage instantané
  const getFilteredHotels = () => {
    let filtered = [...hotelsWithDistances];

    // Filtre par destination (paramètre de recherche principal)
    if (searchParams.destination && searchParams.destination.trim() !== '') {
      const searchTerm = searchParams.destination.toLowerCase().trim();
      console.log('Filtering hotels for:', searchTerm);
      console.log('Available hotels:', mockHotels.map(h => ({ name: h.name, city: h.city })));
      
      // Si on a une géolocalisation, on peut être plus flexible et montrer tous les hôtels
      // triés par distance plutôt que de filtrer strictement par ville
      if (userLocation) {
        // Afficher tous les hôtels mais ils seront triés par distance
        console.log('Showing all hotels sorted by distance from user location');
      } else {
        // Filtrage normal par ville/nom/location
        filtered = filtered.filter(hotel =>
          hotel.city.toLowerCase().includes(searchTerm) ||
          hotel.location.toLowerCase().includes(searchTerm) ||
          hotel.name.toLowerCase().includes(searchTerm)
        );
      }
      
      console.log('Filtered hotels:', filtered.length);
    }

    // Filtre par prix
    filtered = filtered.filter(hotel => 
      hotel.price >= filters.priceRange[0] && hotel.price <= filters.priceRange[1]
    );

    // Filtre par note
    if (filters.minRating > 0) {
      filtered = filtered.filter(hotel => hotel.rating >= filters.minRating);
    }

    // Filtre par étoiles
    if (filters.minStars > 0) {
      filtered = filtered.filter(hotel => hotel.stars >= filters.minStars);
    }

    // Filtre par équipements
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(hotel =>
        filters.amenities.every(amenity => hotel.amenities.includes(amenity))
      );
    }

    // Filtre par type d'hôtel
    if (filters.hotelType) {
      filtered = filtered.filter(hotel => 
        hotel.type.toLowerCase().includes(filters.hotelType.toLowerCase())
      );
    }

    return filtered;
  };

  // Fonction de tri
  const getSortedHotels = (hotels: Hotel[]) => {
    const sorted = [...hotels];
    
    switch (sortBy) {
      case 'price':
        return sorted.sort((a, b) => a.price - b.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'popular':
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'distance':
        return sortHotelsByDistance(sorted);
      default:
        return sorted;
    }
  };

  // Hôtels avec distances calculées, puis filtrés et triés
  const hotelsWithDistances = calculateHotelDistances(mockHotels);
  const filteredAndSortedHotels = getSortedHotels(getFilteredHotels());

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredAndSortedHotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHotels = filteredAndSortedHotels.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre de recherche compacte */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Indicateur de recherche active */}
          {searchParams.destination && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Recherche active :</span> "{searchParams.destination}"
                    <span className="hidden sm:inline">
                      {searchParams.checkIn && searchParams.checkOut && (
                        <span> • Du {new Date(searchParams.checkIn).toLocaleDateString('fr-FR')} au {new Date(searchParams.checkOut).toLocaleDateString('fr-FR')}</span>
                      )}
                      {searchParams.guests > 1 && (
                        <span> • {searchParams.guests} personnes</span>
                      )}
                    </span>
                  </p>
                  
                  {/* Détails de localisation si disponibles */}
                  {userLocation?.details && (
                    <div className="mt-2 text-xs text-blue-700 flex items-center">
                      <span className="mr-1">📍</span>
                      <span>
                        {userLocation.details.street && `${userLocation.details.street}, `}
                        {userLocation.details.district && `${userLocation.details.district}, `}
                        {userLocation.city}
                      </span>
                    </div>
                  )}
                </div>
                
                {userLocation && (
                  <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    🎯 Géolocalisé
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Destination - Pleine largeur sur mobile */}
            <div className="flex items-center space-x-2 w-full lg:flex-1">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchParams.destination}
                onChange={(e) => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
                className="input flex-1"
                placeholder="Destination"
              />
            </div>
            
            {/* Dates - Responsive */}
            <div className="flex items-center space-x-2 w-full lg:w-auto">
              <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="date"
                value={searchParams.checkIn}
                onChange={(e) => setSearchParams(prev => ({ ...prev, checkIn: e.target.value }))}
                className="input flex-1 lg:w-36"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={searchParams.checkOut}
                onChange={(e) => setSearchParams(prev => ({ ...prev, checkOut: e.target.value }))}
                className="input flex-1 lg:w-36"
              />
            </div>
            
            {/* Invités et bouton recherche */}
            <div className="flex items-center space-x-2 w-full lg:w-auto">
              <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <select
                value={searchParams.guests}
                onChange={(e) => setSearchParams(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                className="input flex-1 lg:w-24"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4+</option>
              </select>
            </div>
            
            <button 
              onClick={() => {
                // Mettre à jour l'URL avec les nouveaux paramètres
                const params = new URLSearchParams();
                if (searchParams.destination) params.set('destination', searchParams.destination);
                if (searchParams.checkIn) params.set('checkIn', searchParams.checkIn);
                if (searchParams.checkOut) params.set('checkOut', searchParams.checkOut);
                params.set('guests', searchParams.guests.toString());
                
                window.history.pushState({}, '', `/search?${params.toString()}`);
              }}
              className="btn-primary flex items-center justify-center space-x-2 w-full lg:w-auto"
            >
              <SearchIcon className="w-4 h-4" />
              <span>Rechercher</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Recherche géolocalisée */}
        <div className="mb-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}
          <LocationSearchSimple
            onLocationFound={handleLocationFound}
            onLocationCleared={handleLocationCleared}
            currentLocation={userLocation}
          />
          
          {/* Message informatif quand la géolocalisation est active */}
          {userLocation && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">📍</div>
                <div className="flex-1">
                  <h4 className="text-green-800 font-bold mb-2">Votre position actuelle</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-green-700">
                      <span className="mr-2">🏙️</span>
                      <span className="font-medium">Ville :</span>
                      <span className="ml-1">{userLocation.city}</span>
                    </div>
                    
                    {userLocation.details?.district && (
                      <div className="flex items-center text-green-700">
                        <span className="mr-2">🏘️</span>
                        <span className="font-medium">Quartier :</span>
                        <span className="ml-1">{userLocation.details.district}</span>
                      </div>
                    )}
                    
                    {userLocation.details?.street && (
                      <div className="flex items-center text-green-700">
                        <span className="mr-2">🛣️</span>
                        <span className="font-medium">Rue :</span>
                        <span className="ml-1">{userLocation.details.street}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-green-600 mt-3 pt-2 border-t border-green-200">
                      <span className="mr-2">🎯</span>
                      <span className="font-medium">Hôtels triés par distance depuis cette position</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Panneau de filtres - Responsive */}
          <div className={`lg:w-80 lg:flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 lg:sticky lg:top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filtres</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFilters({
                      priceRange: [0, 100000],
                      minRating: 0,
                      minStars: 0,
                      amenities: [],
                      hotelType: '',
                      policies: []
                    })}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded"
                  >
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filtres actifs - Responsive */}
              {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100000 || 
                filters.minRating > 0 || filters.minStars > 0 || 
                filters.amenities.length > 0 || filters.hotelType || 
                filters.policies.length > 0) && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Filtres actifs :</h4>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100000) && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs sm:text-sm">
                        {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()} XAF
                      </span>
                    )}
                    {filters.minRating > 0 && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs sm:text-sm">
                        Note {filters.minRating}+
                      </span>
                    )}
                    {filters.minStars > 0 && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs sm:text-sm">
                        {filters.minStars}+ étoiles
                      </span>
                    )}
                    {filters.hotelType && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs sm:text-sm">
                        {filters.hotelType}
                      </span>
                    )}
                    {filters.amenities.map(amenity => (
                      <span key={amenity} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs sm:text-sm">
                        {amenity}
                      </span>
                    ))}
                    {filters.policies.map(policy => (
                      <span key={policy} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs sm:text-sm">
                        {policy === 'pets' ? 'Animaux acceptés' : 'Annulation gratuite'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Prix */}
                <div>
                  <h4 className="font-medium mb-3">Prix par nuit</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="price" 
                        className="mr-2" 
                        checked={filters.priceRange[0] === 10000 && filters.priceRange[1] === 20000}
                        onChange={() => handlePriceRangeChange(10000, 20000)}
                      />
                      <span>10 000 - 20 000 XAF</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="price" 
                        className="mr-2" 
                        checked={filters.priceRange[0] === 20000 && filters.priceRange[1] === 40000}
                        onChange={() => handlePriceRangeChange(20000, 40000)}
                      />
                      <span>20 000 - 40 000 XAF</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="price" 
                        className="mr-2" 
                        checked={filters.priceRange[0] === 40000 && filters.priceRange[1] === 60000}
                        onChange={() => handlePriceRangeChange(40000, 60000)}
                      />
                      <span>40 000 - 60 000 XAF</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="price" 
                        className="mr-2" 
                        checked={filters.priceRange[0] === 60000 && filters.priceRange[1] === 100000}
                        onChange={() => handlePriceRangeChange(60000, 100000)}
                      />
                      <span>60 000+ XAF</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="price" 
                        className="mr-2" 
                        checked={filters.priceRange[0] === 0 && filters.priceRange[1] === 100000}
                        onChange={() => handlePriceRangeChange(0, 100000)}
                      />
                      <span>Tous les prix</span>
                    </label>
                  </div>
                </div>

                {/* Note des clients */}
                <div>
                  <h4 className="font-medium mb-3">Note des clients</h4>
                  <div className="space-y-2">
                    {[9, 8, 7, 6, 0].map(rating => (
                      <label key={rating} className="flex items-center">
                        <input 
                          type="radio" 
                          name="rating" 
                          className="mr-2" 
                          checked={filters.minRating === rating}
                          onChange={() => handleRatingChange(rating)}
                        />
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span>
                            {rating === 0 ? 'Toutes les notes' : `${rating}+ ${getRatingText(rating)}`}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Catégorie d'étoiles */}
                <div>
                  <h4 className="font-medium mb-3">Catégorie</h4>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 0].map(stars => (
                      <label key={stars} className="flex items-center">
                        <input 
                          type="radio" 
                          name="stars" 
                          className="mr-2" 
                          checked={filters.minStars === stars}
                          onChange={() => handleStarsChange(stars)}
                        />
                        <div className="flex items-center">
                          {stars > 0 ? (
                            <>
                              {Array.from({ length: stars }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                              <span className="ml-1">{stars}+ étoile{stars > 1 ? 's' : ''}</span>
                            </>
                          ) : (
                            <span>Toutes catégories</span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type d'établissement */}
                <div>
                  <h4 className="font-medium mb-3">Type d'établissement</h4>
                  <div className="space-y-2">
                    {['Hôtel', 'Résidence', 'Auberge', 'Lodge'].map(type => (
                      <label key={type} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2" 
                          checked={filters.hotelType === type}
                          onChange={() => handleHotelTypeChange(type)}
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Services et équipements */}
                <div>
                  <h4 className="font-medium mb-3">Services et équipements</h4>
                  <div className="space-y-2">
                    {Object.keys(amenityIcons).map(amenity => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                        />
                        <div className="flex items-center">
                          {amenityIcons[amenity]}
                          <span className="ml-2">{amenity}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Politiques */}
                <div>
                  <h4 className="font-medium mb-3">Politiques</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={filters.policies.includes('pets')}
                        onChange={() => handlePolicyToggle('pets')}
                      />
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 text-red-400 mr-2" />
                        <span>Animaux acceptés</span>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2" 
                        checked={filters.policies.includes('cancellation')}
                        onChange={() => handlePolicyToggle('cancellation')}
                      />
                      <span>Annulation gratuite</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des résultats - Responsive */}
          <div className="flex-1 w-full lg:w-auto">
            {/* Bouton filtres mobile */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Filtres</span>
                  {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100000 || 
                    filters.minRating > 0 || filters.minStars > 0 || 
                    filters.amenities.length > 0 || filters.hotelType || 
                    filters.policies.length > 0) && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      Actifs
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {/* Options de tri - Responsive */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-gray-600 text-sm sm:text-base">
                    {filteredAndSortedHotels.length} hôtel{filteredAndSortedHotels.length > 1 ? 's' : ''} trouvé{filteredAndSortedHotels.length > 1 ? 's' : ''}
                    <span className="hidden sm:inline">
                      {searchParams.destination && (
                        <span className="text-blue-600 font-medium"> pour "{searchParams.destination}"</span>
                      )}
                    </span>
                  </span>
                  {filteredAndSortedHotels.length !== mockHotels.length && (
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
                      Sur {mockHotels.length} hôtels au total
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-600 whitespace-nowrap">Afficher:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                      className="input w-16 sm:w-20"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-gray-600 whitespace-nowrap">par page</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-600 whitespace-nowrap">Trier par:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input w-full sm:w-48"
                    >
                      <option value="price">Prix le plus bas d'abord</option>
                      <option value="rating">Meilleure note d'abord</option>
                      <option value="popular">Plus populaire</option>
                      {userLocation && <option value="distance">Plus proche d'abord</option>}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des hôtels */}
            <div className="space-y-6">
              {filteredAndSortedHotels.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Aucun hôtel trouvé
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchParams.destination 
                      ? `Aucun hôtel trouvé pour "${searchParams.destination}". Essayez une autre destination ou modifiez vos filtres.`
                      : 'Aucun hôtel ne correspond à vos critères de recherche.'
                    }
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSearchParams(prev => ({ ...prev, destination: '' }));
                        setFilters({
                          priceRange: [0, 100000],
                          minRating: 0,
                          minStars: 0,
                          amenities: [],
                          hotelType: '',
                          policies: []
                        });
                      }}
                      className="btn-primary mr-2"
                    >
                      Réinitialiser la recherche
                    </button>
                    <button
                      onClick={() => setFilters({
                        priceRange: [0, 100000],
                        minRating: 0,
                        minStars: 0,
                        amenities: [],
                        hotelType: '',
                        policies: []
                      })}
                      className="btn-secondary"
                    >
                      Réinitialiser les filtres uniquement
                    </button>
                  </div>
                </div>
              ) : (
                currentHotels.map(hotel => (
                <div key={hotel.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image - Responsive */}
                    <div className="w-full sm:w-64 h-48 sm:h-48 flex-shrink-0 image-container sm:rounded-l-lg">
                      <img 
                        src={hotel.image} 
                        alt={hotel.name}
                        className="hotel-image-hover w-full h-full object-cover"
                      />
                    </div>

                    {/* Informations - Responsive */}
                    <div className="flex-1 p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{hotel.name}</h3>
                          <p className="text-sm text-gray-600">{hotel.type}</p>
                          <div className="flex items-center mt-1">
                            <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{hotel.location}</span>
                            {hotel.distance && (
                              <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                📍 {formatDistance(hotel.distance)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex sm:flex-col items-center sm:items-end sm:text-right">
                          <div className="flex items-center">
                            <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold mr-2">
                              {hotel.rating}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{getRatingText(hotel.rating)}</div>
                              <div className="text-xs text-gray-500">{hotel.reviewCount} avis</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Étoiles */}
                      <div className="flex items-center mb-3">
                        {Array.from({ length: hotel.stars }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>

                      {/* Points forts - Responsive */}
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                        {hotel.amenities.slice(0, 4).map(amenity => (
                          <div key={amenity} className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">
                            {amenityIcons[amenity]}
                            <span className="ml-1 hidden sm:inline">{amenity}</span>
                          </div>
                        ))}
                        {hotel.amenities.length > 4 && (
                          <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm text-gray-600">
                            +{hotel.amenities.length - 4}
                          </div>
                        )}
                      </div>

                      {/* Prix et bouton - Responsive */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
                        <div>
                          <div className="text-xl sm:text-2xl font-bold text-gray-900">
                            {hotel.price.toLocaleString()} XAF
                          </div>
                          <div className="text-sm text-gray-600">par nuit, taxes incluses</div>
                        </div>
                        
                        <Link 
                          to={`/hotel/${hotel.id}`}
                          className="btn-primary inline-block text-center w-full sm:w-auto"
                        >
                          Voir l'hôtel
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAndSortedHotels.length}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
              showInfo={true}
              showQuickJump={totalPages > 10}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;