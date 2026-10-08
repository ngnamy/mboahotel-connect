import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Building2, MapPin } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="bg-[#103b2d] text-white">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#e3bd82]">
              <Building2 aria-hidden="true" className="h-6 w-6" />
            </span>
            <span className="text-xl font-bold tracking-tight">MboaHotel</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">
            Explorez les hébergements et les destinations du Cameroun, et préparez votre prochain séjour.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 text-sm text-white/70">
            <MapPin aria-hidden="true" className="h-4 w-4 text-[#e3bd82]" />
            Cameroun
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/50">Explorer</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link className="text-white/80 transition-colors hover:text-white" to="/search">Tous les hôtels</Link></li>
            <li><Link className="text-white/80 transition-colors hover:text-white" to="/testimonials">Témoignages</Link></li>
            <li><Link className="text-white/80 transition-colors hover:text-white" to="/about">À propos</Link></li>
            <li><Link className="text-white/80 transition-colors hover:text-white" to="/faq">Questions fréquentes</Link></li>
            <li><Link className="text-white/80 transition-colors hover:text-white" to="/contact">Nous contacter</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/50">Votre espace</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link className="text-white/80 transition-colors hover:text-white" to="/login">Connexion</Link></li>
            <li><Link className="text-white/80 transition-colors hover:text-white" to="/register">Créer un compte</Link></li>
            <li>
              <Link className="inline-flex items-center gap-1 text-[#e3bd82] transition-colors hover:text-white" to="/register?role=hotelier">
                Proposer un hébergement
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} MboaHotel Connect</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link className="transition-colors hover:text-white" to="/privacy">Confidentialité</Link>
          <Link className="transition-colors hover:text-white" to="/terms">Conditions d’utilisation</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
