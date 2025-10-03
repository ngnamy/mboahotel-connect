import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Calendar, Users, CreditCard, Check, ArrowLeft, MapPin, Star } from 'lucide-react';

interface BookingItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface BookingDetails {
  hotelId: string;
  hotelName: string;
  selectedRooms: BookingItem[];
  totalPrice: number;
  checkIn: string;
  checkOut: string;
}

const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails: BookingDetails = location.state?.bookingDetails;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkIn: bookingDetails?.checkIn || '',
    checkOut: bookingDetails?.checkOut || '',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Informations manquantes</h2>
          <p className="text-gray-600 mb-6">Aucune information de réservation trouvée. Veuillez recommencer votre sélection.</p>
          <Link to="/search" className="btn-primary">
            Retour à la recherche
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'une requête API
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingConfirmed(true);
    }, 2000);
  };

  const calculateNights = () => {
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = calculateNights();
  const totalWithNights = bookingDetails.totalPrice * nights;

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-green-600 mb-6">
              <Check className="w-20 h-20 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Réservation confirmée !</h1>
            <p className="text-lg text-gray-600 mb-6">
              Votre réservation à <strong>{bookingDetails.hotelName}</strong> a été confirmée.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Numéro de réservation</p>
              <p className="text-xl font-bold text-blue-600">MHC-{Date.now().toString().slice(-8)}</p>
            </div>
            <p className="text-gray-600 mb-8">
              Un email de confirmation a été envoyé à <strong>{formData.email}</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/reservations" className="btn-primary">
                Voir mes réservations
              </Link>
              <Link to="/" className="btn-secondary">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          <Link 
            to={`/hotel/${bookingDetails.hotelId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux détails de l'hôtel
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Finaliser votre réservation</h1>
          <p className="text-gray-600 mt-2">Complétez vos informations pour confirmer votre séjour</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Informations personnelles</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="+237 6XX XX XX XX"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dates de séjour</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
                    Arrivée *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      id="checkIn"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleInputChange}
                      required
                      className="input pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
                    Départ *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      id="checkOut"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleInputChange}
                      required
                      className="input pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                  Demandes spéciales (optionnel)
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={3}
                  className="input resize-none"
                  placeholder="Lit bébé, étage élevé, vue mer, etc."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Confirmation en cours...
                  </div>
                ) : (
                  'Confirmer la réservation'
                )}
              </button>
            </form>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Récapitulatif</h3>
              
              <div className="mb-4 pb-4 border-b">
                <h4 className="font-semibold text-gray-900 mb-2">{bookingDetails.hotelName}</h4>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Yaoundé, Cameroun</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                  <span>4.5 étoiles</span>
                </div>
              </div>

              <div className="mb-4 pb-4 border-b">
                <h5 className="font-medium text-gray-900 mb-2">Chambres sélectionnées</h5>
                {bookingDetails.selectedRooms.map(room => (
                  <div key={room.id} className="flex justify-between text-sm mb-2">
                    <span>{room.quantity}x {room.name}</span>
                    <span>{(room.quantity * room.price).toLocaleString()} XAF</span>
                  </div>
                ))}
              </div>

              <div className="mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm mb-2">
                  <span>Durée du séjour</span>
                  <span>{nights} nuit{nights > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Prix par nuit</span>
                  <span>{bookingDetails.totalPrice.toLocaleString()} XAF</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">{totalWithNights.toLocaleString()} XAF</span>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center text-blue-800 text-sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span>Paiement sécurisé</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Vos informations sont protégées par un cryptage SSL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;