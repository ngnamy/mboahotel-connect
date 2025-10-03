import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Calendar, 
  Users, 
  MapPin,
  ArrowLeft,
  CreditCard
} from 'lucide-react';

const Cart: React.FC = () => {
  const { state, removeItem, updateQuantity, updateDates, clearCart } = useCart();
  const [editingDates, setEditingDates] = useState<string | null>(null);
  const [tempDates, setTempDates] = useState({ checkIn: '', checkOut: '' });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleEditDates = (itemId: string, checkIn: string, checkOut: string) => {
    setEditingDates(itemId);
    setTempDates({ checkIn, checkOut });
  };

  const handleSaveDates = (itemId: string) => {
    const nights = calculateNights(tempDates.checkIn, tempDates.checkOut);
    updateDates(itemId, tempDates.checkIn, tempDates.checkOut, nights);
    setEditingDates(null);
  };

  const handleCancelEdit = () => {
    setEditingDates(null);
    setTempDates({ checkIn: '', checkOut: '' });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Votre panier est vide
            </h1>
            <p className="text-gray-600 mb-8">
              Découvrez nos hôtels et ajoutez des chambres à votre panier pour commencer votre réservation.
            </p>
            <Link to="/search" className="btn-primary inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuer mes recherches
            </Link>
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
            to="/search"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continuer mes recherches
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Mon panier ({state.itemCount} article{state.itemCount > 1 ? 's' : ''})
            </h1>
            {state.items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Vider le panier
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={item.image}
                    alt={item.roomName}
                    className="w-24 h-18 object-cover object-center rounded-lg flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.hotelName}
                        </h3>
                        <p className="text-gray-600">{item.roomName}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Users className="w-4 h-4 mr-1" />
                          <span>Jusqu'à {item.maxCapacity} personnes</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Supprimer cet article"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Dates */}
                    <div className="mb-4">
                      {editingDates === item.id ? (
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <input
                              type="date"
                              value={tempDates.checkIn}
                              onChange={(e) => setTempDates(prev => ({ ...prev, checkIn: e.target.value }))}
                              className="text-sm border rounded px-2 py-1"
                            />
                            <span className="text-gray-400">→</span>
                            <input
                              type="date"
                              value={tempDates.checkOut}
                              onChange={(e) => setTempDates(prev => ({ ...prev, checkOut: e.target.value }))}
                              className="text-sm border rounded px-2 py-1"
                            />
                          </div>
                          <button
                            onClick={() => handleSaveDates(item.id)}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            Sauver
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-700 text-sm"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{formatDate(item.checkIn)} → {formatDate(item.checkOut)}</span>
                            <span className="ml-2 text-gray-500">
                              ({item.nights} nuit{item.nights > 1 ? 's' : ''})
                            </span>
                          </div>
                          <button
                            onClick={() => handleEditDates(item.id, item.checkIn, item.checkOut)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Modifier
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Quantité et prix */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">Quantité:</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {item.price.toLocaleString()} XAF × {item.quantity} × {item.nights} nuit{item.nights > 1 ? 's' : ''}
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {(item.price * item.quantity * item.nights).toLocaleString()} XAF
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h2>
              
              <div className="space-y-3 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}× {item.roomName} ({item.nights}n)
                    </span>
                    <span className="font-medium">
                      {(item.price * item.quantity * item.nights).toLocaleString()} XAF
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {state.total.toLocaleString()} XAF
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Taxes et frais inclus
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="cart-button-primary"
                >
                  <CreditCard className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Procéder au paiement</span>
                </Link>
                
                <Link
                  to="/search"
                  className="cart-button-secondary"
                >
                  <span>Continuer mes recherches</span>
                </Link>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center text-green-800 text-sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span>Paiement 100% sécurisé</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Vos données sont protégées par un cryptage SSL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;