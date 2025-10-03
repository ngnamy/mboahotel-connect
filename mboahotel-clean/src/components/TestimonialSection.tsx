import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Quote } from 'lucide-react';
import { Testimonial } from '../types/testimonial';

interface TestimonialSectionProps {
  testimonials: Testimonial[];
  showAll?: boolean;
  title?: string;
  subtitle?: string;
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({
  testimonials,
  showAll = false,
  title = "Ce que disent nos clients",
  subtitle = "Découvrez les expériences authentiques de nos utilisateurs"
}) => {
  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, 3);

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

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Grille de témoignages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                index === 1 ? 'md:scale-105' : ''
              }`}
            >
              {/* Icône de citation */}
              <div className="flex justify-between items-start mb-4">
                <Quote className="w-8 h-8 text-blue-500 opacity-50" />
                <div className="flex items-center space-x-1">
                  {renderStars(testimonial.rating)}
                </div>
              </div>

              {/* Contenu du témoignage */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {testimonial.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                  {testimonial.content}
                </p>
              </div>

              {/* Profil utilisateur */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {testimonial.userAvatar ? (
                    <img
                      src={testimonial.userAvatar}
                      alt={testimonial.userName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {testimonial.userName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-900">
                    {testimonial.userName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.location}
                  </div>
                </div>
              </div>

              {/* Badge hôtel si applicable */}
              {testimonial.hotelName && (
                <div className="mt-4 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full inline-block">
                  {testimonial.hotelName}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Statistiques */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {testimonials.length}
              </div>
              <div className="text-gray-600 text-sm">
                Témoignages
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {testimonials.length > 0 
                  ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                  : '0'
                }
              </div>
              <div className="text-gray-600 text-sm">
                Note moyenne
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {testimonials.filter(t => t.rating === 5).length}
              </div>
              <div className="text-gray-600 text-sm">
                5 étoiles
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {testimonials.reduce((sum, t) => sum + t.likes, 0)}
              </div>
              <div className="text-gray-600 text-sm">
                J'aime total
              </div>
            </div>
          </div>
        </div>

        {/* Bouton pour voir tous les témoignages */}
        {!showAll && testimonials.length > 3 && (
          <div className="text-center">
            <Link
              to="/testimonials"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <span>Voir tous les témoignages</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}

        {/* Call to action */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Vous aussi, partagez votre expérience !
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Aidez d'autres voyageurs en partageant votre expérience avec MboaHotel Connect. 
            Votre avis compte et contribue à améliorer notre service.
          </p>
          <Link
            to="/testimonials"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            <span>Écrire un témoignage</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;