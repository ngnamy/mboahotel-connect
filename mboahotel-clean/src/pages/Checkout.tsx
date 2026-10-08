import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Check,
  ArrowLeft
} from 'lucide-react';

const Checkout: React.FC = () => {
  const { state } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    specialRequests: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [availabilityMessage, setAvailabilityMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAvailabilityMessage('La réservation et le paiement ne sont pas encore disponibles. Aucune commande n’a été transmise.');
  };

  if (state.items.length === 0) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="page-card mx-4 max-w-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Panier vide</h2>
          <p className="text-gray-600 mb-6">Votre panier est vide. Ajoutez des chambres pour continuer.</p>
          <button
            onClick={() => navigate('/search')}
            className="btn-primary"
          >
            Rechercher des hôtels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-container max-w-5xl">
        {/* En-tête */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au panier
          </button>
          <h1 className="page-title">Finaliser votre séjour</h1>
          <p className="page-description text-base">Consultez votre sélection. La confirmation de réservation n’est pas encore active.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {availabilityMessage && <p role="alert" className="rounded-xl border border-[#e4d0a2] bg-[#f8f3e9] p-4 text-sm text-[#5c4324]">{availabilityMessage}</p>}
              <div className="rounded-xl border border-[#e4d0a2] bg-[#f8f3e9] p-4 text-sm leading-6 text-[#5c4324]">
                Cette version ne transmet aucune réservation et ne traite aucun paiement. Les options ci-dessous sont présentées à titre d’aperçu.
              </div>
              {/* Informations personnelles */}
              <div className="page-card p-5 sm:p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informations personnelles
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
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

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="input pl-10"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="input pl-10"
                        placeholder="+237 6XX XX XX XX"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
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
              </div>

              {/* Méthode de paiement */}
              <div className="page-card p-5 sm:p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Méthode de paiement
                </h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                    <span>Carte bancaire</span>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile"
                      checked={paymentMethod === 'mobile'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <Phone className="w-5 h-5 mr-2 text-gray-600" />
                    <span>Mobile Money (MTN/Orange)</span>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="hotel"
                      checked={paymentMethod === 'hotel'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                    <span>Paiement à l'hôtel</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled
                className="btn-primary w-full cursor-not-allowed opacity-60"
              >
                Réservation indisponible
              </button>
            </form>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="page-card p-5 sm:sticky sm:top-24 sm:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Récapitulatif</h3>
              
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <img
                      src={item.image}
                      alt={item.roomName}
                      className="w-16 h-12 object-cover object-center rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.hotelName}
                      </h4>
                      <p className="text-sm text-gray-600">{item.roomName}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{item.nights} nuit{item.nights > 1 ? 's' : ''}</span>
                        <span className="mx-2">•</span>
                        <span>{item.quantity} chambre{item.quantity > 1 ? 's' : ''}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {(item.price * item.quantity * item.nights).toLocaleString()} XAF
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total indicatif</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {state.total.toLocaleString()} XAF
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Taxes et frais à confirmer auprès de l’établissement
                </p>
              </div>

              <div className="rounded-xl border border-[#e4d0a2] bg-[#f8f3e9] p-4">
                <div className="flex items-center text-green-800 text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Paiement 100% sécurisé</span>
                </div>
                <p className="mt-1 text-xs text-[#76552b]">
                  Aucun paiement n’est traité dans cette version.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;