import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Building2, ClipboardList, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageIntro from '../components/PageIntro';

const Dashboard: React.FC = () => {
  return (
    <div className="page-shell">
      <Helmet>
        <title>Espace hôtelier | MboaHotel Connect</title>
        <meta name="description" content="Espace partenaire hôtelier MboaHotel Connect." />
      </Helmet>
      <div className="page-container">
        <PageIntro
          eyebrow="Espace partenaire"
          title="Votre tableau de bord"
          description="Les outils de gestion hôtelière sont en préparation. Cette page vous indique les prochaines étapes."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: <Building2 aria-hidden="true" className="h-5 w-5" />, title: 'Établissement', body: 'La création et la vérification de votre fiche ne sont pas encore disponibles.' },
            { icon: <ClipboardList aria-hidden="true" className="h-5 w-5" />, title: 'Disponibilités', body: 'La gestion des chambres, tarifs et disponibilités sera ajoutée avec le service partenaire.' },
            { icon: <Settings2 aria-hidden="true" className="h-5 w-5" />, title: 'Paramètres', body: 'Les préférences et accès du compte seront gérés ici.' },
          ].map(item => (
            <section key={item.title} className="page-card p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ef] text-[#174c3a]">{item.icon}</span>
              <h2 className="mt-4 text-lg font-semibold text-[#17251f]">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#68736b]">{item.body}</p>
            </section>
          ))}
        </div>
        <Link to="/contact" className="btn-primary mt-7">
          Contacter l’équipe partenaire <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;