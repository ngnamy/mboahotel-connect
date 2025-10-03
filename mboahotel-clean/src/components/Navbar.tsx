import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Hotel, User, LogOut, Menu, X, Building2, Heart } from 'lucide-react';
import CartIcon from './CartIcon';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">MboaHotel Connect</span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Accueil
            </Link>
            <Link to="/search" className="text-gray-700 hover:text-blue-600 font-medium">
              Nos Hôtels
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">
              À propos
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
              Contact
            </Link>
          </div>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <CartIcon />
            
            {!user && (
              <Link
                to="/register?role=hotelier"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Listez votre hôtel
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                    to="/favorites"
                    className="block px-3 py-2 text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mes Favoris
                  </Link>
                <Link
                  to="/reservations"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Mes réservations
                </Link>
                
                {user.role === 'hotelier' && (
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Tableau de bord
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {user.firstName} {user.lastName}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                >
                  <User className="h-4 w-4" />
                  <span>Connexion</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <CartIcon />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/search"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Nos Hôtels
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {!user && (
                <div className="border-t pt-2">
                  <Link
                    to="/register?role=hotelier"
                    className="block px-3 py-2 text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Listez votre hôtel
                  </Link>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 bg-blue-600 text-white rounded-lg mx-3 mt-2 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </div>
              )}

              {user && (
                <div className="border-t pt-2">
                  <Link
                    to="/reservations"
                    className="block px-3 py-2 text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mes réservations
                  </Link>
                  {user.role === 'hotelier' && (
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Tableau de bord
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-red-600"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;