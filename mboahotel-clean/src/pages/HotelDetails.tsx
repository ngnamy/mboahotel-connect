import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { 
  Star, 
  MapPin, 
  Wifi, 
  Car, 
  Coffee, 
  Waves, 
  Plane, 
  UtensilsCrossed, 
  Presentation, 
  Snowflake, 
  Heart,
  ThumbsUp,
  Clock,
  Shield,
  PlusCircle,
  MinusCircle,
  Camera
} from 'lucide-react';
import ReviewForm from '../components/ReviewForm';
import ImageGalleryModal from '../components/ImageGalleryModal';
import FavoriteButton from '../components/FavoriteButton';
import { mockHotels as catalogHotels } from './Search';
import { usePublicHotels } from '../lib/publicHotels';

// --- Définitions des types ---

interface Room {
  id: string;
  name: string;
  price: number;
  capacity: number;
  images: string[];
  availableCount: number;
}

interface Review {
  id: string;
  userName: string;
  rating: number; // Note de 1 à 5
  date: string;
  comment: string;
  helpful: number;
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  reviewCount: number;
  price: number;
  images: string[];
  amenities: string[];
  stars: number;
  description: string;
  phone?: string;
  email?: string;
  rooms: Room[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
}

// --- Données de simulation (à remplacer par des appels API) ---

const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Hôtel La Falaise',
    location: 'Bastos, Yaoundé',
    city: 'Yaoundé',
    rating: 4.5,
    reviewCount: 150,
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1542314831-068cd1dbb5eb?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop&crop=center',
    ],
    amenities: ['Piscine', 'Wi-Fi gratuit', 'Restaurant', 'Parking', 'Climatisation', 'Salle de sport'],
    stars: 4,
    description: "Situé au cœur du quartier chic de Bastos, l'Hôtel La Falaise offre un cadre luxueux et paisible pour vos séjours d'affaires ou de loisirs. Profitez de notre piscine, de notre restaurant gastronomique et de nos chambres spacieuses avec vue sur la ville.",
    rooms: [
      { id: 'r1', name: 'Chambre Standard', price: 45000, capacity: 2, images: [
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1598605272254-16f0c0ecdfa5?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop&crop=center'
      ], availableCount: 5 },
      { id: 'r2', name: 'Suite Junior', price: 75000, capacity: 3, images: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop&crop=center'
      ], availableCount: 2 },
    ],
    policies: {
      checkIn: '14:00',
      checkOut: '12:00',
      cancellation: 'Annulation gratuite jusqu\'à 24h avant l\'arrivée.'
    }
  },
  {
    id: '2',
    name: 'Hôtel Akwa Palace',
    location: 'Akwa, Douala',
    city: 'Douala',
    rating: 4.8,
    reviewCount: 203,
    price: 75000,
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop&crop=center',
    ],
    amenities: ['Piscine', 'Wi-Fi gratuit', 'Restaurant', 'Salle de conférence', 'Navette aéroport', 'Spa'],
    stars: 5,
    description: "L'Akwa Palace est une institution à Douala, combinant élégance traditionnelle et confort moderne. Idéal pour les voyageurs d'affaires, il dispose de salles de conférence équipées et d'un spa pour se détendre après une longue journée.",
    rooms: [
      { id: 'r3', name: 'Chambre Exécutive', price: 75000, capacity: 2, images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1595578312217-014c56a59564?w=800&h=600&fit=crop&crop=center'
      ], availableCount: 3 },
      { id: 'r4', name: 'Suite Présidentielle', price: 150000, capacity: 4, images: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1560185893-a55de8537e49?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1594563703937-fdc640497dcd?w=800&h=600&fit=crop&crop=center'
      ], availableCount: 0 },
    ],
    policies: {
      checkIn: '15:00',
      checkOut: '12:00',
      cancellation: 'Conditions spécifiques selon le tarif choisi.'
    }
  },
];

const getRatingText = (rating: number) => {
  if (rating >= 4.8) return 'Exceptionnel';
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4) return 'Très bien';
  if (rating >= 3.5) return 'Bien';
  return 'Correct';
};

// --- Composant principal ---

const HotelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { hotels: publishedHotels, isConfigured, isLoading, error: publishedHotelsError } = usePublicHotels(id);
  const publishedHotel = publishedHotels[0];
  const detailedHotel = !isConfigured ? mockHotels.find(h => h.id === id) : undefined;
  const catalogHotel = !isConfigured ? catalogHotels.find(h => h.id === id) : undefined;
  const isLiveListing = isConfigured && Boolean(publishedHotel);
  const liveHotel: Hotel | undefined = publishedHotel ? {
    id: publishedHotel.id,
    name: publishedHotel.name,
    location: `${publishedHotel.address}, ${publishedHotel.city}`,
    city: publishedHotel.city,
    rating: 0,
    reviewCount: 0,
    price: publishedHotel.price,
    images: [publishedHotel.image, publishedHotel.image, publishedHotel.image],
    amenities: publishedHotel.amenities,
    stars: publishedHotel.stars,
    description: publishedHotel.description || 'La description détaillée de cet établissement sera bientôt disponible. Contactez directement l’hôtel pour en savoir plus.',
    phone: publishedHotel.phone,
    email: publishedHotel.email,
    rooms: publishedHotel.rooms.map(room => ({
      id: room.id,
      name: room.name,
      price: room.price,
      capacity: room.capacity,
      images: [publishedHotel.image],
      availableCount: room.totalUnits,
    })),
    policies: {
      checkIn: 'À confirmer auprès de l’établissement',
      checkOut: 'À confirmer auprès de l’établissement',
      cancellation: 'Les conditions de séjour doivent être confirmées directement avec l’établissement.',
    },
  } : undefined;
  const hotel: Hotel | undefined = liveHotel || detailedHotel || (catalogHotel ? {
    id: catalogHotel.id,
    name: catalogHotel.name,
    location: catalogHotel.location,
    city: catalogHotel.city,
    rating: catalogHotel.rating / 2,
    reviewCount: catalogHotel.reviewCount,
    price: catalogHotel.price,
    images: [catalogHotel.image, catalogHotel.image, catalogHotel.image],
    amenities: catalogHotel.amenities,
    stars: catalogHotel.stars,
    description: 'Cette fiche de démonstration ne contient pas encore de détails vérifiés ni de chambres réservables.',
    rooms: [{
      id: `room-${catalogHotel.id}`,
      name: 'Disponibilité à confirmer',
      price: catalogHotel.price,
      capacity: 2,
      images: [catalogHotel.image],
      availableCount: 0,
    }],
    policies: {
      checkIn: 'À confirmer',
      checkOut: 'À confirmer',
      cancellation: 'Les conditions sont à vérifier directement auprès de l’établissement.',
    },
  } : undefined);
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>({});
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [checkIn, setCheckIn] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    return dayAfterTomorrow.toISOString().split('T')[0];
  });

  const initialReviews: Review[] = !isLiveListing && hotel ? [
    {
      id: '1',
      userName: hotel.id === '1' ? 'Marie K.' : 'Jean-Paul M.',
      rating: hotel.id === '1' ? 5 : 4,
      date: '2024-02-15',
      comment: hotel.id === '1' 
        ? 'Excellent séjour ! Le personnel est très accueillant et les chambres sont impeccables. La piscine est un vrai plus après une journée de travail.'
        : 'Très bon hôtel, bien situé. Le restaurant propose une excellente cuisine locale et internationale.',
      helpful: 12,
    },
    {
      id: '2',
      userName: hotel.id === '1' ? 'Jean-Paul M.' : 'Marie K.',
      rating: hotel.id === '1' ? 4 : 3,
      date: '2024-02-10',
      comment: hotel.id === '1'
        ? 'Très bon hôtel, bien situé à Bastos. Le restaurant propose une excellente cuisine locale et internationale.'
        : 'Séjour agréable. La chambre était un peu petite mais propre et fonctionnelle. Bon rapport qualité-prix.',
      helpful: 5,
    }
  ] : [];

  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const openImageGallery = (images: string[]) => {
    setGalleryImages(images);
    setIsGalleryOpen(true);
  };

  const closeImageGallery = () => {
    setIsGalleryOpen(false);
  };

  const handleSelectRoom = (roomId: string, increment: number) => {
    const room = hotel?.rooms.find(r => r.id === roomId);
    if (!room) return;

    setSelectedRooms(prev => {
      const currentQty = prev[roomId] || 0;
      const newQty = currentQty + increment;

      if (newQty > room.availableCount) {
        return prev; // Ne pas dépasser le nombre de chambres disponibles
      }

      const newSelection = { ...prev };
      if (newQty > 0) {
        newSelection[roomId] = newQty;
      } else {
        delete newSelection[roomId];
      }
      return newSelection;
    });
  };

  const calculateNights = () => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    return Number.isFinite(diffTime) && diffTime > 0
      ? Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      : 0;
  };

  const nights = calculateNights();

  const bookingSummary = useMemo(() => {
    if (!hotel || Object.keys(selectedRooms).length === 0) {
      return { total: 0, items: [] };
    }

    let total = 0;
    const items = Object.entries(selectedRooms).map(([roomId, quantity]) => {
      const room = hotel.rooms.find(r => r.id === roomId);
      if (!room) return null;
      const roomTotal = room.price * quantity * nights;
      total += roomTotal;
      return {
        id: roomId,
        name: room.name,
        quantity,
        price: room.price,
        total: roomTotal,
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);

    return { total, items };
  }, [selectedRooms, hotel, nights]);

  const handleAddToCart = () => {
    if (!hotel || Object.keys(selectedRooms).length === 0 || nights === 0) {
      setFeedback('Choisissez des dates valides et au moins une chambre.');
      return;
    }

    const selectedRoomCount = Object.values(selectedRooms).reduce((total, quantity) => total + quantity, 0);
    Object.entries(selectedRooms).forEach(([roomId, quantity]) => {
      const room = hotel.rooms.find(r => r.id === roomId);
      if (!room || quantity === 0) return;

      addItem({
        hotelId: hotel.id,
        hotelName: hotel.name,
        roomId: room.id,
        roomName: room.name,
        price: room.price,
        quantity,
        checkIn,
        checkOut,
        nights,
        image: room.images[0],
        maxCapacity: room.capacity
      });
    });

    // Réinitialiser la sélection après ajout au panier
    setSelectedRooms({});
    setFeedback(`${selectedRoomCount} chambre(s) ajoutée(s) au panier de démonstration. Cela ne réserve pas de séjour.`);
  };

  const handleReviewSubmit = (rating: number, comment: string) => {
    const newReview: Review = {
      id: `review-${Date.now()}`,
      userName: 'Vous (démo)',
      rating: rating,
      date: new Date().toISOString().split('T')[0],
      comment: comment,
      helpful: 0,
    };
    setReviews(previousReviews => [newReview, ...previousReviews]);
    setFeedback('Votre commentaire a été ajouté uniquement à cette démonstration ; il n’a pas été envoyé ni enregistré sur un serveur.');
  };

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Wi-Fi gratuit': <Wifi className="w-5 h-5" />,
    'Parking': <Car className="w-5 h-5" />,
    'Petit-déjeuner inclus': <Coffee className="w-5 h-5" />,
    'Piscine': <Waves className="w-5 h-5" />,
    'Navette aéroport': <Plane className="w-5 h-5" />,
    'Restaurant': <UtensilsCrossed className="w-5 h-5" />,
    'Salle de conférence': <Presentation className="w-5 h-5" />,
    'Climatisation': <Snowflake className="w-5 h-5" />,
    'Salle de sport': <Heart className="w-5 h-5" />,
    'Spa': <Star className="w-5 h-5" />
  };

  if (!hotel) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="text-center">
          {isLoading ? (
            <p role="status" className="text-sm text-[#68736b]">Chargement de la fiche établissement…</p>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Hôtel non trouvé</h2>
              <p className="text-gray-600">{publishedHotelsError || "Désolé, l'hôtel que vous cherchez n'existe pas ou n'est pas publié."}</p>
              <Link to="/search" className="mt-4 btn-primary">Retour à la recherche</Link>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell !py-0">
      <div className="page-container py-8">
        <p role="note" className="mb-6 rounded-xl border border-[#e4d0a2] bg-[#f8f3e9] p-4 text-sm leading-6 text-[#5c4324]">
          {isLiveListing
            ? 'Établissement partenaire publié. Les tarifs et la disponibilité par date sont à confirmer directement auprès de l’hôtel ; les réservations en ligne ne sont pas encore activées.'
            : 'Fiche de démonstration : établissement, tarifs, avis et disponibilités à confirmer directement auprès de l’hôtel.'}
        </p>
        {feedback && <p role="status" className="mb-6 rounded-xl border border-[#bfd4c4] bg-[#eef4ef] p-4 text-sm leading-6 text-[#103b2d]">{feedback}</p>}
        {/* En-tête */}
        <div className="relative mb-6 pr-12 sm:pr-14">
          <FavoriteButton hotelId={hotel.id} />
          <h1 className="text-4xl font-bold text-gray-900">{hotel.name}</h1>
          <div className="flex flex-wrap items-center mt-2 gap-x-4 gap-y-2">
            <div className="flex items-center">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-1" />
              <span>{hotel.location}</span>
            </div>
            {hotel.rating > 0 && <div className="flex items-center">
              <div className="bg-blue-600 text-white px-2 py-1 rounded font-semibold">
                {hotel.rating.toFixed(1)}
              </div>
              <span className="ml-2 text-gray-700 font-medium">{getRatingText(hotel.rating)}</span>
              <span className="ml-2 text-gray-500">({hotel.reviewCount} avis)</span>
            </div>}
          </div>
        </div>

        {/* Galerie d'images */}
        <div className="mb-8 grid h-72 grid-cols-2 gap-2 sm:h-96 sm:grid-cols-4 sm:grid-rows-2">
          <div className="col-span-2 row-span-2 image-container-hover">
            <img src={hotel.images[0]} alt={hotel.name} className="hotel-image-hover" />
          </div>
          <div className="image-container-hover hidden sm:block">
            <img src={hotel.images[1]} alt={hotel.name} className="hotel-image-hover" />
          </div>
          <div className="image-container-hover hidden sm:block">
            <img src={hotel.images[2]} alt={hotel.name} className="hotel-image-hover" />
          </div>
          <div className="image-container-hover hidden sm:block">
            <img src={hotel.images[0]} alt={hotel.name} className="hotel-image-hover" />
          </div>
          <div className="image-container-hover hidden sm:block">
            <img src={hotel.images[1]} alt={hotel.name} className="hotel-image-hover" />
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne de gauche : Détails */}
          <div className="lg:col-span-2">
            <div className="page-card p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{hotel.description}</p>

              {hotel.amenities.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Équipements populaires</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {hotel.amenities.map(amenity => (
                      <div key={amenity} className="flex items-center text-gray-700">
                        <div className="text-blue-600 mr-2">{amenityIcons[amenity] || <Star className="w-5 h-5" />}</div>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Chambres disponibles</h2>
              {hotel.rooms.length === 0 ? (
                <p className="rounded-xl bg-[#f5f1e8] p-4 text-sm text-[#5c4324]">Aucun type de chambre actif n’a encore été publié par cet établissement.</p>
              ) : <div className="space-y-4">
                {hotel.rooms.map(room => (
                  <div key={room.id} className="border rounded-lg p-4 flex flex-col md:flex-row items-start gap-4">
                    <div 
                      className="w-full md:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer group relative" 
                      onClick={() => openImageGallery(room.images)}
                    >
                      <img src={room.images[0]} alt={room.name} className="hotel-image transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                        <div className="text-white opacity-0 group-hover:opacity-100 font-semibold flex items-center">
                          <Camera className="w-5 h-5 mr-2" />
                          <span>Voir photos</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-grow flex flex-col sm:flex-row justify-between w-full">
                      <div className="flex-grow mb-4 sm:mb-0">
                        <h3 className="font-semibold text-lg">{room.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">Capacité: {room.capacity} personnes</p>
                        {isLiveListing
                          ? <p className="text-sm text-gray-600">{room.availableCount} unité{room.availableCount > 1 ? 's' : ''} déclarée{room.availableCount > 1 ? 's' : ''} · Disponibilité à confirmer</p>
                          : <p className={`text-sm font-medium ${room.availableCount > 0 ? (room.availableCount < 4 ? 'text-orange-600' : 'text-green-600') : 'text-red-600'}`}>
                              {room.availableCount > 0 ? `Plus que ${room.availableCount} disponible${room.availableCount > 1 ? 's' : ''}` : 'Épuisé'}
                            </p>}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="font-bold text-lg mb-2">{room.price.toLocaleString()} XAF / nuit</p>
                        {!isLiveListing && <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleSelectRoom(room.id, -1)}
                            disabled={!selectedRooms[room.id] || selectedRooms[room.id] === 0}
                            className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <MinusCircle className="w-5 h-5" />
                          </button>
                          <span className="w-8 text-center font-semibold text-lg">
                            {selectedRooms[room.id] || 0}
                          </span>
                          <button 
                            onClick={() => handleSelectRoom(room.id, 1)}
                            disabled={room.availableCount === 0 || (selectedRooms[room.id] || 0) >= room.availableCount}
                            className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <PlusCircle className="w-5 h-5" />
                          </button>
                        </div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>}
            </div>

            {/* Section des avis */}
            {isLiveListing ? (
              <div className="page-card mt-8 p-5 sm:p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Avis des clients</h2>
                <p className="text-sm leading-6 text-gray-600">Les avis ne sont pas encore collectés pour cet établissement.</p>
              </div>
            ) : <div className="page-card mt-8 p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Avis des clients ({reviews.length})</h2>
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 mr-3">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{review.userName}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        {review.rating}/5
                      </div>
                    </div>
                    
                    <p className="text-gray-700 my-3">{review.comment}</p>

                    <div className="flex items-center text-sm text-gray-500">
                      <button className="flex items-center hover:text-blue-600">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span>Utile ({review.helpful})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="mt-6 text-blue-600 hover:text-blue-700 font-medium">
                Voir tous les avis ({hotel.reviewCount})
              </button>

              <ReviewForm onSubmit={handleReviewSubmit} />
            </div>}
          </div>

          {/* Colonne de droite : Carte de réservation */}
          {isLiveListing ? (
          <div className="lg:col-span-1">
            <div className="page-card p-5 sm:sticky sm:top-24 sm:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Contacter l’établissement</h3>
              <p className="mb-5 text-sm leading-6 text-gray-600">La réservation en ligne n’est pas encore disponible. Contactez directement l’établissement pour vérifier les tarifs et les disponibilités de vos dates.</p>
              <div className="grid gap-3">
                <a href={`tel:${hotel.phone}`} className="btn-primary w-full">{hotel.phone}</a>
                <a href={`mailto:${hotel.email}`} className="btn-secondary w-full break-all">{hotel.email}</a>
              </div>
            </div>
          </div>
          ) : <div className="lg:col-span-1">
            <div className="page-card p-5 sm:sticky sm:top-24 sm:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Réservation</h3>
              
              {/* Sélection des dates */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arrivée
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="input text-sm"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Départ
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="input text-sm"
                      min={checkIn}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {nights} nuit{nights > 1 ? 's' : ''}
                </p>
              </div>

              {bookingSummary.total > 0 ? (
                <>
                  <div className="space-y-2 mb-4 border-b pb-4">
                    {bookingSummary.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.quantity} × {item.name} × {nights}n
                        </span>
                        <span className="font-medium">{item.total.toLocaleString()} XAF</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {bookingSummary.total.toLocaleString()} XAF
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={handleAddToCart}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center min-h-[48px]"
                    >
                      Ajouter au panier
                    </button>
                    <Link 
                      to="/cart"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center min-h-[48px] text-center"
                    >
                      Voir le panier
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-gray-900 mb-4">
                    À partir de <span className="text-blue-600">{hotel.price.toLocaleString()} XAF</span> / nuit
                  </p>
                  <button 
                    className="w-full bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center min-h-[48px] mb-4" 
                    disabled
                  >
                    Sélectionnez une chambre
                  </button>
                </>
              )}
              
              <div className="space-y-3 text-gray-700 mt-6 pt-4 border-t">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-500" />
                  <span>Check-in: {hotel.policies.checkIn}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-500" />
                  <span>Check-out: {hotel.policies.checkOut}</span>
                </div>
                <div className="flex items-start">
                  <Shield className="w-5 h-5 mr-2 text-gray-500 mt-1" />
                  <span className="text-sm">{hotel.policies.cancellation}</span>
                </div>
              </div>
            </div>
          </div>}
        </div>
      </div>
      {isGalleryOpen && (
        <ImageGalleryModal
          images={galleryImages}
          onClose={closeImageGallery}
        />
      )}
    </div>
  );
};

export default HotelDetails;
