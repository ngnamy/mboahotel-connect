import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CalendarDays, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageIntro from '../components/PageIntro';

const Reservations: React.FC = () => {
  return (
    <div className="page-shell">
      <Helmet>
        <title>Mes réservations | MboaHotel Connect</title>
      </Helmet>
      <div className="page-container max-w-4xl">
        <PageIntro
          eyebrow="Votre espace"
          title="Mes réservations"
          description="Retrouvez ici vos séjours lorsque le service de réservation sera disponible."
        />
        <section className="page-card px-6 py-12 text-center sm:px-10">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef4ef] text-[#174c3a]">
            <CalendarDays aria-hidden="true" className="h-7 w-7" />
          </span>
          <h2 className="mt-5 text-xl font-semibold text-[#17251f]">Aucune réservation à afficher</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#68736b]">
            Les réservations de cette version ne sont pas enregistrées sur un serveur. Vous ne pouvez pas encore consulter ou gérer un séjour depuis cet espace.
          </p>
          <Link to="/search" className="btn-primary mt-6">
            <Search aria-hidden="true" className="h-4 w-4" /> Découvrir les hébergements
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Reservations;