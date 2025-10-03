import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Star, 
  Shield, 
  CreditCard, 
  Headphones,
  ChevronLeft,
  ChevronRight,
  Quote
} from 'lucide-react';
import SearchForm from '../components/SearchForm';
import { useBooking } from '../hooks/useBooking';
import { BookingDetails } from '../types/booking';  // Type manquant

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { createBooking, isLoading } = useBooking();  // useBooking n'est pas correctement configuré
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const featuredHotels = [
    {
      id: 1,
      name: 'Hôtel Mont Fébé',
      city: 'Yaoundé',
      rating: 4.5,
      price: 85000,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
      features: ['Piscine', 'Restaurant', 'WiFi gratuit']
    },
    {
      id: 2,
      name: 'Akwa Palace',
      city: 'Douala',
      rating: 4.8,
      price: 120000,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80',
      features: ['Spa', 'Centre d\'affaires', 'Parking']
    },
    {
      id: 3,
      name: 'Résidence La Falaise',
      city: 'Bafoussam',
      rating: 4.2,
      price: 65000,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbb5eb?w=500&q=80',
      features: ['Vue montagne', 'Restaurant', 'Jardin']
    },
    {
      id: 4,
      name: 'Ayaba Hotel',
      city: 'Bamenda',
      rating: 4.0,
      price: 55000,
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&q=80',
      features: ['Bar', 'Terrasse', 'WiFi gratuit']
    },
    {
      id: 5,
      name: 'Krystal Palace',
      city: 'Douala',
      rating: 4.6,
      price: 95000,
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80',
      features: ['Piscine', 'Salle de sport', 'Spa']
    }
  ];

  const testimonials = [
    {
      name: 'Marie Ngono',
      city: 'Yaoundé',
      text: 'Simple, rapide et le paiement via Mobile Money a rendu la réservation si facile ! Je recommande vivement.',
      rating: 5
    },
    {
      name: 'Paul Mbarga',
      city: 'Douala',
      text: 'Excellent service client',
      rating: 5
    },
    {
      name: 'Fatima Alhadji',
      city: 'Garoua',
      text: 'J\'ai trouvé l\'hôtel parfait pour mes vacances en famille. Interface très intuitive.',
      rating: 4
    }
  ];

  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth * 0.8; // Défile de 80% de la largeur visible
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleBookNow = async (hotelId: number) => {
    setSelectedHotel(hotelId);
    
    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = localStorage.getItem('token'); // ou votre méthode d'authentification
    
    if (!isLoggedIn) {
      // Rediriger vers la page de connexion avec un retour prévu
      navigate(`/login?redirect=/hotel/${hotelId}/booking`);
      return;
    }

    try {
      // Créer un objet de réservation de base
      const bookingDetails: BookingDetails = {
        hotelId,
        roomType: "standard",
        checkIn: new Date().toISOString(),
        checkOut: new Date(Date.now() + 86400000).toISOString(), // +24h
        numberOfRooms: 1,
        totalPrice: 75000, // Prix par défaut ou récupéré depuis les props
      };

      // Rediriger vers la page de confirmation de réservation
      navigate(`/hotel/${hotelId}/booking`, { 
        state: { bookingDetails } 
      });
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white">
        {/* Conteneur pour l'image et le voile en arrière-plan */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="../../public/images/baniere/3192.jpg"
            alt="Piscine d'un hôtel de luxe au crépuscule"
            className="w-full h-full object-cover"
          />
          {/* Voile sombre pour la lisibilité du texte */}
          <div className="absolute inset-0 bg-black bg-opacity-25" />
        </div>

        {/* Contenu de la bannière, positionné par-dessus */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Trouvez votre hôtel de rêve<br />
              <span className="text-blue-200">au cœur du Cameroun</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Découvrez et réservez facilement les meilleurs établissements hôteliers du Cameroun avec des tarifs transparents et un paiement sécurisé
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir MboaHotel Connect ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              La première plateforme de réservation hôtelière 100% camerounaise, conçue pour répondre aux besoins locaux
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <CreditCard className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Paiement local sécurisé</h3>
              <p className="text-gray-600 leading-relaxed">
                Payez facilement avec Mobile Money, Orange Money ou carte bancaire. 
                Transactions 100% sécurisées et adaptées au marché camerounais.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Hôtels vérifiés et de qualité</h3>
              <p className="text-gray-600 leading-relaxed">
                Tous nos établissements partenaires sont rigoureusement sélectionnés et vérifiés 
                pour garantir la qualité de votre séjour.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <Headphones className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Assistance 24/7</h3>
              <p className="text-gray-600 leading-relaxed">
                Notre équipe locale est disponible 24h/24 et 7j/7 pour vous accompagner 
                avant, pendant et après votre réservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Hôtels à la une
              </h2>
              <p className="text-lg text-gray-600">
                Découvrez une sélection des meilleurs établissements du Cameroun
              </p>
            </div>
            <div className="hidden md:flex space-x-2">
              <button 
                onClick={() => scroll('left')}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
            >
              {featuredHotels.map((hotel) => (
                <div key={hotel.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4">
                  <Link
                    to={`/hotel/${hotel.id.toString()}`}
                    className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group h-full flex flex-col"
                  >
                    <div className="h-48 relative overflow-hidden">
                      <img src={hotel.image} alt={hotel.name} className="hotel-card-image" />
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all"></div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {hotel.name}
                          </h3>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-700">{hotel.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3 flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {hotel.city}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {hotel.features.slice(0, 2).map((feature, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-auto pt-2">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
                            {hotel.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-600"> FCFA</span>
                          <p className="text-xs text-gray-500">par nuit</p>
                        </div>
                        <span className="text-blue-600 font-medium group-hover:text-blue-700">
                          Voir détails →
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/search"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Search className="mr-2 h-5 w-5" />
              Voir tous les hôtels
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-lg text-gray-600">
              Des milliers de voyageurs nous font confiance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 relative">
                <Quote className="h-8 w-8 text-blue-600 mb-4" />
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.city}</p>
                  </div>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Destinations populaires
            </h2>
            <p className="text-lg text-gray-600">
              Explorez les villes les plus visitées du Cameroun
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Yaoundé', hotels: 45, description: 'Capitale politique', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center' },
              { name: 'Douala', hotels: 38, description: 'Capitale économique', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center' },
              { name: 'Bafoussam', hotels: 12, description: 'Région de l\'Ouest', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center' },
              { name: 'Bamenda', hotels: 8, description: 'Nord-Ouest', image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop&crop=center' },
            ].map((city) => (
              <Link
                key={city.name}
                to={`/search?destination=${encodeURIComponent(city.name)}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={city.image} 
                    alt={`Vue de ${city.name}`}
                    className="hotel-card-image"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all"></div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{city.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{city.description}</p>
                  <p className="text-blue-600 font-medium">{city.hotels} hôtels disponibles</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section for Hoteliers */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Vous êtes hôtelier ?
            </h2>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Rejoignez MboaHotel Connect et développez votre activité. 
              Bénéficiez d'une visibilité accrue, d'une gestion simplifiée des réservations 
              et d'un accompagnement personnalisé.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register?role=hotelier"
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Inscrire mon hôtel
              </Link>
              <Link
                to="/contact"
                className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
