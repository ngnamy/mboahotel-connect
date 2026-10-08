import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockHotels } from './Search'; // Réutilisation des données de la page de recherche
import { Heart, Star, MapPin } from 'lucide-react';
import FavoriteButton from '../components/FavoriteButton';
import PageIntro from '../components/PageIntro';
import { usePublicHotels } from '../lib/publicHotels';

const Favorites: React.FC = () => {
  const { user, favoriteHotelIds } = useAuth();
  const { hotels: publishedHotels, isConfigured, isLoading, error } = usePublicHotels();

  if (!user) {
    return (
      <div className="page-shell">
        <div className="page-container max-w-3xl">
          <div className="page-card p-8 text-center sm:p-12">
            <Heart aria-hidden="true" className="mx-auto h-10 w-10 text-[#174c3a]" />
            <h1 className="page-title">Connectez-vous pour voir vos favoris</h1>
            <p className="page-description mb-6">Connectez-vous pour retrouver les hébergements que vous avez enregistrés sur cet appareil.</p>
            <Link to="/login" className="btn-primary">Se connecter</Link>
          </div>
        </div>
      </div>
    );
  }

  const favoriteHotels = isConfigured
    ? publishedHotels
        .filter(hotel => favoriteHotelIds.includes(hotel.id))
        .map(hotel => ({
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          location: `${hotel.address}, ${hotel.city}`,
          price: hotel.price,
          rating: 0,
        }))
    : mockHotels
        .filter(hotel => favoriteHotelIds.includes(hotel.id))
        .map(hotel => ({
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          location: hotel.location,
          price: hotel.price,
          rating: hotel.rating,
        }));

  return (
    <div className="page-shell">
      <div className="page-container">
        <PageIntro
          eyebrow="Votre sélection"
          title="Mes hébergements favoris"
          description="Les favoris sont conservés localement sur cet appareil et ne sont pas synchronisés avec un serveur."
        />
        {isLoading ? (
          <div role="status" className="page-card p-6 text-center text-sm text-[#68736b]">Chargement de vos favoris…</div>
        ) : error ? (
          <div role="alert" className="page-card border-red-200 bg-red-50 p-6 text-sm text-red-800">{error}</div>
        ) : favoriteHotels.length === 0 ? (
          <div className="page-card p-8 text-center sm:p-12">
            <Heart aria-hidden="true" className="mx-auto h-12 w-12 text-[#7b847d]" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Vous n'avez pas encore de favoris</h3>
            <p className="mt-1 text-sm text-gray-500">
              Cliquez sur l'icône cœur sur un hôtel pour l'ajouter à votre liste.
            </p>
            <div className="mt-6">
              <Link to="/search" className="btn-primary">
                Découvrir des hôtels
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favoriteHotels.map((hotel) => (
              <div key={hotel.id} className="page-card group relative overflow-hidden transition-shadow hover:shadow-xl">
                <FavoriteButton hotelId={hotel.id} />
                <Link to={`/hotel/${hotel.id}`}>
                  <div className="h-48 relative overflow-hidden">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="pr-2 text-lg font-semibold text-[#17251f] transition-colors group-hover:text-[#174c3a]">
                        {hotel.name}
                      </h3>
                      {hotel.rating > 0 && (
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <Star className="h-4 w-4 fill-current text-[#b88b3d]" />
                          <span className="text-sm font-medium text-gray-700">{hotel.rating}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {hotel.location}
                    </p>
                    {hotel.price > 0 ? <div>
                      <span className="text-xl font-bold text-gray-900">
                        {hotel.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600"> FCFA / nuit</span>
                    </div> : <p className="text-sm text-gray-600">Tarif à confirmer</p>}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
