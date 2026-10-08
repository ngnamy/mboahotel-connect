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
  const favorite = isFavorite(hotelId);

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
      className={`absolute top-3 right-3 z-10 rounded-full bg-black/30 p-2 backdrop-blur-sm transition-colors duration-200 hover:bg-black/50 ${className || ''}`}
      aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-pressed={favorite}
    >
      <Heart className={`h-5 w-5 transition-all ${user && favorite ? 'fill-current text-red-500' : 'text-white'}`} />
    </button>
  );
};

export default FavoriteButton;
