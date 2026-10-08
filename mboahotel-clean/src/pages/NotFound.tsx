import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => (
  <main className="flex min-h-[65vh] items-center justify-center px-4 py-16">
    <div className="max-w-lg text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a3663d]">Erreur 404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#17251f] sm:text-5xl">
        Cette page n’existe pas.
      </h1>
      <p className="mt-4 leading-7 text-[#68736b]">
        Le lien a peut-être changé ou l’adresse est incorrecte. Repartons à la découverte.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/" className="btn-secondary">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Accueil
        </Link>
        <Link to="/search" className="btn-primary">
          <Search aria-hidden="true" className="h-4 w-4" />
          Explorer les hôtels
        </Link>
      </div>
    </div>
  </main>
);

export default NotFound;
