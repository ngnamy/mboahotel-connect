import React, { useState } from 'react';
import { Star, Heart, MapPin, Calendar, Hotel, User } from 'lucide-react';
import { Testimonial, TestimonialCategory } from '../types/testimonial';

interface TestimonialCardProps {
  testimonial: Testimonial;
  onLike?: (testimonialId: string) => void;
  showActions?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  onLike,
  showActions = true
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(testimonial.likes);

  const handleLike = () => {
    if (onLike) {
      onLike(testimonial.id);
    }
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const getCategoryLabel = (category: TestimonialCategory) => {
    const labels = {
      [TestimonialCategory.GENERAL]: 'Général',
      [TestimonialCategory.HOTEL_EXPERIENCE]: 'Expérience Hôtel',
      [TestimonialCategory.APP_USAGE]: 'Utilisation App',
      [TestimonialCategory.CUSTOMER_SERVICE]: 'Service Client',
      [TestimonialCategory.BOOKING_PROCESS]: 'Réservation'
    };
    return labels[category];
  };

  const getCategoryColor = (category: TestimonialCategory) => {
    const colors = {
      [TestimonialCategory.GENERAL]: 'bg-blue-100 text-blue-800',
      [TestimonialCategory.HOTEL_EXPERIENCE]: 'bg-green-100 text-green-800',
      [TestimonialCategory.APP_USAGE]: 'bg-purple-100 text-purple-800',
      [TestimonialCategory.CUSTOMER_SERVICE]: 'bg-orange-100 text-orange-800',
      [TestimonialCategory.BOOKING_PROCESS]: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category];
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
      {/* En-tête avec utilisateur */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Avatar utilisateur */}
          <div className="relative">
            {testimonial.userAvatar ? (
              <img
                src={testimonial.userAvatar}
                alt={testimonial.userName}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
            {/* Indicateur de statut */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">{testimonial.userName}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-3 h-3" />
              <span>{testimonial.location}</span>
            </div>
          </div>
        </div>

        {/* Catégorie */}
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(testimonial.category)}`}>
          {getCategoryLabel(testimonial.category)}
        </span>
      </div>

      {/* Note et titre */}
      <div className="mb-3">
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center space-x-1">
            {renderStars(testimonial.rating)}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {testimonial.rating}/5
          </span>
        </div>
        <h4 className="text-lg font-bold text-gray-900 mb-2">
          {testimonial.title}
        </h4>
      </div>

      {/* Contenu du témoignage */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">
          {testimonial.content}
        </p>
      </div>

      {/* Hôtel concerné (si applicable) */}
      {testimonial.hotelName && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 text-blue-800">
            <Hotel className="w-4 h-4" />
            <span className="text-sm font-medium">Hôtel concerné :</span>
            <span className="text-sm">{testimonial.hotelName}</span>
          </div>
        </div>
      )}

      {/* Footer avec actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date(testimonial.createdAt).toLocaleDateString('fr-FR')}</span>
        </div>

        {showActions && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${
                isLiked
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{likesCount}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialCard;