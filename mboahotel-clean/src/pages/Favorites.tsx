import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockHotels } from './Search'; // Réutilisation des données de la page de recherche
import { Heart, Star, MapPin } from 'lucide-react';
import FavoriteButton from '../components/FavoriteButton';

const Favorites: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-20 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Connectez-vous pour voir vos favoris</h2>
        <p className="text-gray-600 mb-6">Créez un compte ou connectez-vous pour sauvegarder les hôtels qui vous plaisent et les retrouver facilement.</p>
        <Link to="/login" className="btn-primary">
          Se connecter
        </Link>
      </div>
    );
  }

  const favoriteHotels = mockHotels.filter(hotel => user.favorites.includes(hotel.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes Hôtels Favoris</h1>
        {favoriteHotels.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-sm">
            <Heart className="mx-auto h-12 w-12 text-gray-400" />
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteHotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group relative">
                <FavoriteButton hotelId={hotel.id} />
                <Link to={`/hotel/${hotel.id}`}>
                  <div className="h-48 relative overflow-hidden">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors pr-2">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{hotel.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3 flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {hotel.location}
                    </p>
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        {hotel.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600"> FCFA / nuit</span>
                    </div>
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

