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
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Ouvrir le panier${state.itemCount ? `, ${state.itemCount} article${state.itemCount > 1 ? 's' : ''}` : ''}`}
        aria-expanded={isOpen}
        aria-controls="cart-dropdown"
        className="relative rounded-xl p-2 text-[#59645d] transition-colors hover:bg-[#f1eee7] hover:text-[#174c3a]"
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
          <button
            type="button"
            className="fixed inset-0 z-40" 
            aria-label="Fermer le panier"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Contenu du panier */}
          <div id="cart-dropdown" className="absolute right-0 top-full z-50 mt-2 max-h-96 w-80 overflow-hidden rounded-2xl border border-[#e8e7e0] bg-white shadow-[0_18px_55px_rgba(23,37,31,0.16)] sm:w-96">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#17251f]">
                  Panier ({state.itemCount})
                </h3>
                <button
                  type="button"
                  aria-label="Fermer le panier"
                  onClick={() => setIsOpen(false)}
                  className="text-[#7b847d] hover:text-[#174c3a]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {state.items.length === 0 ? (
              <div className="p-6 text-center">
                <ShoppingCart className="mx-auto mb-3 h-12 w-12 text-[#c8ccc6]" />
                <p className="text-[#59645d]">Votre panier est vide</p>
                <p className="mt-1 text-sm text-[#858d87]">
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
                          <h4 className="truncate text-sm font-medium text-[#17251f]">
                            {item.hotelName}
                          </h4>
                          <p className="text-sm text-[#68736b]">{item.roomName}</p>
                          
                          <div className="mt-1 flex items-center text-xs text-[#858d87]">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{formatDate(item.checkIn)} - {formatDate(item.checkOut)}</span>
                            <span className="mx-2">•</span>
                            <span>{item.nights} nuit{item.nights > 1 ? 's' : ''}</span>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                aria-label={`Retirer une chambre ${item.roomName}`}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="rounded-full p-1 hover:bg-[#f1eee7]"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                aria-label={`Ajouter une chambre ${item.roomName}`}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="rounded-full p-1 hover:bg-[#f1eee7]"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-sm font-semibold text-[#17251f]">
                                {(item.price * item.quantity * item.nights).toLocaleString()} XAF
                              </p>
                              <button
                                type="button"
                                aria-label={`Supprimer ${item.roomName} de votre panier`}
                                onClick={() => removeItem(item.id)}
                                className="text-xs text-[#9b4533] hover:text-[#773222]"
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

                <div className="border-t border-[#eeede7] bg-[#faf9f6] p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-semibold text-[#17251f]">Total</span>
                    <span className="text-xl font-bold text-[#174c3a]">
                      {state.total.toLocaleString()} XAF
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <Link
                      to="/cart"
                      onClick={() => setIsOpen(false)}
                      className="btn-secondary min-h-[44px] w-full text-sm"
                    >
                      Voir le panier
                    </Link>
                    <Link
                      to="/checkout"
                      onClick={() => setIsOpen(false)}
                      className="btn-primary min-h-[44px] w-full text-sm"
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