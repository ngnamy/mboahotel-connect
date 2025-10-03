import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Testimonial } from '../types/testimonial';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  autoPlay = true,
  interval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex(prev => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
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

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl overflow-hidden">
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
      </div>

      <div className="relative p-8 md:p-12">
        {/* Icône de citation */}
        <div className="flex justify-center mb-6">
          <Quote className="w-12 h-12 text-white opacity-50" />
        </div>

        {/* Contenu du témoignage */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {renderStars(currentTestimonial.rating)}
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
            {currentTestimonial.title}
          </h3>
          
          <p className="text-blue-100 text-lg leading-relaxed max-w-3xl mx-auto mb-6">
            "{currentTestimonial.content.length > 200 
              ? currentTestimonial.content.substring(0, 200) + '...'
              : currentTestimonial.content}"
          </p>
        </div>

        {/* Profil utilisateur */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="relative">
            {currentTestimonial.userAvatar ? (
              <img
                src={currentTestimonial.userAvatar}
                alt={currentTestimonial.userName}
                className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                <span className="text-blue-600 font-bold text-xl">
                  {currentTestimonial.userName.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="text-center">
            <div className="font-semibold text-white text-lg">
              {currentTestimonial.userName}
            </div>
            <div className="text-blue-200 text-sm">
              {currentTestimonial.location}
            </div>
            {currentTestimonial.hotelName && (
              <div className="text-blue-300 text-xs mt-1">
                {currentTestimonial.hotelName}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        {testimonials.length > 1 && (
          <>
            {/* Boutons précédent/suivant */}
            <div className="flex justify-center items-center space-x-4 mb-6">
              <button
                onClick={goToPrevious}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              
              <span className="text-white/70 text-sm">
                {currentIndex + 1} / {testimonials.length}
              </span>
              
              <button
                onClick={goToNext}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Indicateurs de pagination */}
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Aller au témoignage ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TestimonialCarousel;