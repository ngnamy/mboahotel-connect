import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Calendar, Users } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const CartIcon: React.FC = () => {
  const { state, removeItem, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="relative">
      {/* Icône du panier */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
      >
        <ShoppingCart className="w-6 h-6" />
        {state.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {state.itemCount > 9 ? '9+' : state.itemCount}
          </span>
        )}
      </button>

      {/* Dropdown du panier */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Contenu du panier */}
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Panier ({state.itemCount})
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {state.items.length === 0 ? (
              <div className="p-6 text-center">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Votre panier est vide</p>
                <p className="text-sm text-gray-400 mt-1">
                  Ajoutez des chambres pour commencer
                </p>
              </div>
            ) : (
              <>
                <div className="max-h-64 overflow-y-auto">
                  {state.items.map((item) => (
                    <div key={item.id} className="p-4 border-b last:border-b-0">
                      <div className="flex items-start space-x-3">
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
                            <span>{formatDate(item.checkIn)} - {formatDate(item.checkOut)}</span>
                            <span className="mx-2">•</span>
                            <span>{item.nights} nuit{item.nights > 1 ? 's' : ''}</span>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 rounded-full hover:bg-gray-100"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded-full hover:bg-gray-100"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                {(item.price * item.quantity * item.nights).toLocaleString()} XAF
                              </p>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      {state.total.toLocaleString()} XAF
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <Link
                      to="/cart"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center bg-gray-200 text-gray-800 py-3 px-3 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium min-h-[44px] flex items-center justify-center"
                    >
                      Voir le panier
                    </Link>
                    <Link
                      to="/checkout"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center bg-blue-600 text-white py-3 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium min-h-[44px] flex items-center justify-center"
                    >
                      Finaliser la commande
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CartIcon;