import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Check, Calendar, MapPin, User, Mail, Phone, Download, Share2 } from 'lucide-react';

const BookingSuccess: React.FC = () => {
  const location = useLocation();
  const { bookingId, customerInfo, items, total } = location.state || {};

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Réservation non trouvée</h2>
          <p className="text-gray-600 mb-6">Aucune information de réservation disponible.</p>
          <Link to="/" className="btn-primary">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* En-tête de confirmation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Réservation confirmée !
          </h1>
          <p className="text-lg text-gray-600">
            Votre réservation a été traitée avec succès
          </p>
        </div>

        {/* Détails de la réservation */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Détails de la réservation</h2>
            <div className="text-right">
              <p className="text-sm text-gray-600">Numéro de réservation</p>
              <p className="text-lg font-bold text-blue-600">{bookingId}</p>
            </div>
          </div>

          {/* Informations client */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informations client
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Nom :</span> {customerInfo?.firstName} {customerInfo?.lastName}</p>
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {customerInfo?.email}
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  {customerInfo?.phone}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Récapitulatif financier
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Sous-total :</span>
                  <span>{total?.toLocaleString()} XAF</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes :</span>
                  <span>Incluses</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total payé :</span>
                  <span className="text-blue-600">{total?.toLocaleString()} XAF</span>
                </div>
              </div>
            </div>
          </div>

          {/* Réservations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vos réservations</h3>
            <div className="space-y-4">
              {items?.map((item: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.image}
                      alt={item.roomName}
                      className="w-20 h-15 object-cover object-center rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.hotelName}</h4>
                      <p className="text-gray-600">{item.roomName}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                          {formatDate(item.checkIn)} → {formatDate(item.checkOut)}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{item.nights} nuit{item.nights > 1 ? 's' : ''}</span>
                        <span className="mx-2">•</span>
                        <span>{item.quantity} chambre{item.quantity > 1 ? 's' : ''}</span>
                      </div>

                      <div className="mt-2">
                        <span className="text-lg font-bold text-gray-900">
                          {(item.price * item.quantity * item.nights).toLocaleString()} XAF
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochaines étapes</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-5 h-5 mr-2" />
              Télécharger la confirmation
            </button>
            <button className="flex items-center justify-center bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">
              <Share2 className="w-5 h-5 mr-2" />
              Partager la réservation
            </button>
          </div>
        </div>

        {/* Informations importantes */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Informations importantes</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Un email de confirmation a été envoyé à {customerInfo?.email}</li>
            <li>• Présentez-vous à la réception avec une pièce d'identité valide</li>
            <li>• Les horaires de check-in et check-out sont indiqués dans votre confirmation</li>
            <li>• Pour toute modification, contactez directement l'hôtel ou notre service client</li>
          </ul>
        </div>

        {/* Actions finales */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservations" className="btn-primary">
              Voir mes réservations
            </Link>
            <Link to="/search" className="btn-secondary">
              Réserver un autre hôtel
            </Link>
            <Link to="/" className="btn-secondary">
              Retour à l'accueil
            </Link>
          </div>
          
          <p className="text-sm text-gray-600">
            Besoin d'aide ? <Link to="/contact" className="text-blue-600 hover:text-blue-700">Contactez notre service client</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;