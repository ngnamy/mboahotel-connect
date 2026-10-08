import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Heart, LogOut, Menu, User, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CartIcon from './CartIcon';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  const linkClass = (path: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      (path === '/' ? location.pathname === path : location.pathname.startsWith(path))
        ? 'text-[#174c3a]'
        : 'text-[#59645d] hover:text-[#174c3a]'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[#e8e7e0] bg-[#faf9f6]/95 backdrop-blur">
      <nav aria-label="Navigation principale" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[76px] items-center justify-between gap-4">
          <Link to="/" onClick={closeMenu} className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#174c3a] text-white shadow-sm">
              <Building2 aria-hidden="true" className="h-6 w-6" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-bold tracking-tight text-[#17251f] sm:text-lg">
                MboaHotel
              </span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7b847d] sm:block">
                Séjours au Cameroun
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            <Link to="/" className={linkClass('/')}>Accueil</Link>
            <Link to="/search" className={linkClass('/search')}>Explorer</Link>
            <Link to="/favorites" className={linkClass('/favorites')}>Favoris</Link>
            <Link to="/about" className={linkClass('/about')}>À propos</Link>
            <Link to="/contact" className={linkClass('/contact')}>Contact</Link>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <CartIcon />
            {user ? (
              <>
                <Link to="/reservations" className="px-3 py-2 text-sm font-medium text-[#59645d] hover:text-[#174c3a]">
                  Réservations
                </Link>
                {user.role === 'hotelier' && (
                  <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-[#59645d] hover:text-[#174c3a]">
                    Espace hôtelier
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl px-3 text-sm font-medium text-[#59645d] transition-colors hover:bg-[#f1eee7] hover:text-[#174c3a]"
                >
                  <LogOut aria-hidden="true" className="h-4 w-4" />
                  <span className="hidden xl:inline">Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-sm font-semibold text-[#174c3a] hover:text-[#103b2d]">
                  Connexion
                </Link>
                <Link to="/register" className="btn-primary min-h-[44px] px-4 py-2 text-sm">
                  Créer un compte
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <CartIcon />
            <button
              type="button"
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen(open => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#174c3a] transition-colors hover:bg-[#f1eee7]"
            >
              {isMenuOpen
                ? <X aria-hidden="true" className="h-5 w-5" />
                : <Menu aria-hidden="true" className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div id="mobile-navigation" className="border-t border-[#e8e7e0] pb-4 pt-3 md:hidden">
            <div className="grid gap-1">
              <Link to="/" onClick={closeMenu} className={linkClass('/')}>Accueil</Link>
              <Link to="/search" onClick={closeMenu} className={linkClass('/search')}>Explorer les hôtels</Link>
              <Link to="/favorites" onClick={closeMenu} className={linkClass('/favorites')}>
                <Heart aria-hidden="true" className="mr-2 inline h-4 w-4" /> Mes favoris
              </Link>
              <Link to="/about" onClick={closeMenu} className={linkClass('/about')}>À propos</Link>
              <Link to="/contact" onClick={closeMenu} className={linkClass('/contact')}>Contact</Link>
              {user ? (
                <>
                  <Link to="/reservations" onClick={closeMenu} className={linkClass('/reservations')}>Mes réservations</Link>
                  {user.role === 'hotelier' && (
                    <Link to="/dashboard" onClick={closeMenu} className={linkClass('/dashboard')}>Espace hôtelier</Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-[#9b4533] hover:bg-[#f7eee9]"
                  >
                    <LogOut aria-hidden="true" className="h-4 w-4" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#e8e7e0] pt-3">
                  <Link to="/login" onClick={closeMenu} className="btn-secondary text-sm">
                    <User aria-hidden="true" className="h-4 w-4" />
                    Connexion
                  </Link>
                  <Link to="/register" onClick={closeMenu} className="btn-primary text-sm">
                    Créer un compte
                  </Link>
                  <Link to="/register?role=hotelier" onClick={closeMenu} className="col-span-2 px-3 py-2 text-center text-sm font-medium text-[#174c3a]">
                    Vous êtes hôtelier ? Découvrir l’espace partenaire
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
