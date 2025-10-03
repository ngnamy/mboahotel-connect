import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FavoriteButtonProps {
  hotelId: string;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ hotelId, className }) => {
  const { user, isFavorite, addFavorite, removeFavorite } = useAuth();
  const navigate = useNavigate();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    isFavorite(hotelId) ? removeFavorite(hotelId) : addFavorite(hotelId);
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`absolute top-3 right-3 bg-black/30 backdrop-blur-sm p-2 rounded-full z-10 hover:bg-black/50 transition-colors duration-200 ${className}`}
      aria-label="Ajouter aux favoris"
    >
      <Heart className={`w-5 h-5 transition-all ${user && isFavorite(hotelId) ? 'text-red-500 fill-current' : 'text-white'}`} />
    </button>
  );
};

export default FavoriteButton;

