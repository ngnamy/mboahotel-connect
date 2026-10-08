import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Calendar, Users, CreditCard, ArrowLeft, MapPin, Star } from 'lucide-react';

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

  const [availabilityMessage, setAvailabilityMessage] = useState('');

  if (!bookingDetails) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="page-card mx-4 max-w-md p-6 text-center">
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAvailabilityMessage('La réservation ne peut pas être transmise pour le moment. Aucune réservation n’a été créée.');
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

  return (
    <div className="page-shell">
      <div className="page-container max-w-5xl">
        <p role="status" className="mb-6 rounded-xl border border-[#e4d0a2] bg-[#f8f3e9] p-4 text-sm leading-6 text-[#5c4324]">
          Cette page est un aperçu : les réservations ne sont pas enregistrées et aucun e-mail de confirmation n’est envoyé.
        </p>
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
            <form onSubmit={handleSubmit} className="page-card p-5 sm:p-6">
              {availabilityMessage && <p role="alert" className="mb-5 rounded-xl border border-[#e4d0a2] bg-[#f8f3e9] p-4 text-sm text-[#5c4324]">{availabilityMessage}</p>}
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

              <button type="submit" disabled className="btn-primary w-full cursor-not-allowed py-3 text-lg opacity-60">
                Réservation indisponible
              </button>
            </form>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="page-card p-5 sm:sticky sm:top-24 sm:p-6">
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

              <div className="mt-4 rounded-xl border border-[#e4d0a2] bg-[#f8f3e9] p-3">
                <div className="flex items-center text-[#5c4324] text-sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span>Aucun paiement traité</span>
                </div>
                <p className="mt-1 text-xs text-[#76552b]">
                  La réservation n’est pas encore connectée à un service de paiement.
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