import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Compass, HeartHandshake, MapPin, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageIntro from '../components/PageIntro';

const values = [
  {
    icon: <MapPin aria-hidden="true" className="h-5 w-5" />,
    title: 'Ancré au Cameroun',
    description: 'Mettre en lumière les destinations et les hébergements des différentes régions du pays.',
  },
  {
    icon: <ShieldCheck aria-hidden="true" className="h-5 w-5" />,
    title: 'Une information claire',
    description: 'Présenter les informations utiles au séjour sans masquer ce qui reste à confirmer.',
  },
  {
    icon: <HeartHandshake aria-hidden="true" className="h-5 w-5" />,
    title: 'Pensé pour tous',
    description: 'Faciliter la découverte des hébergements pour les voyageurs comme pour les professionnels.',
  },
];

const About: React.FC = () => (
  <>
    <Helmet>
      <title>À propos | MboaHotel Connect</title>
      <meta name="description" content="Découvrez la vision de MboaHotel Connect, une expérience de découverte hôtelière pensée pour le Cameroun." />
    </Helmet>
    <div className="page-shell">
      <div className="page-container">
        <PageIntro
          eyebrow="Notre démarche"
          title="Le Cameroun mérite une belle vitrine pour ses séjours."
          description="MboaHotel Connect est un projet de plateforme pour rapprocher les voyageurs des hébergements camerounais, avec une expérience simple et lisible."
        >
          <Link to="/search" className="btn-primary">
            Explorer les hébergements <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link to="/contact" className="btn-secondary">Nous contacter</Link>
        </PageIntro>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]" aria-labelledby="vision-title">
          <div className="page-card p-6 sm:p-8">
            <p className="page-eyebrow">La vision</p>
            <h2 id="vision-title" className="section-title mt-3">Une découverte plus proche du terrain</h2>
            <p className="mt-4 leading-7 text-[#68736b]">
              Trouver un lieu où séjourner devrait être aussi simple que de préparer son voyage. Le projet met l’accent
              sur les destinations locales, une présentation claire des établissements et des outils adaptés aux usages
              des voyageurs au Cameroun.
            </p>
            <p className="mt-4 leading-7 text-[#68736b]">
              Le site est encore en construction : les établissements, tarifs et disponibilités présentés dans cette
              version sont des exemples et ne constituent pas une offre de réservation.
            </p>
          </div>
          <div className="rounded-2xl bg-[#174c3a] p-6 text-white sm:p-8">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#f0d8a9]">
              <Compass aria-hidden="true" className="h-5 w-5" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold">Découvrir, comparer, préparer.</h2>
            <p className="mt-3 leading-7 text-white/75">
              Notre priorité est de construire une expérience utile avant d’ouvrir les réservations réelles.
            </p>
            <Link to="/faq" className="mt-6 inline-flex items-center gap-2 font-semibold text-[#f0d8a9] hover:text-white">
              Consulter les questions fréquentes <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="values-title">
          <div className="mb-6 max-w-2xl">
            <p className="page-eyebrow">Nos engagements de conception</p>
            <h2 id="values-title" className="section-title mt-2">Une plateforme utile, honnête et locale</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {values.map(value => (
              <article key={value.title} className="page-card p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ef] text-[#174c3a]">
                  {value.icon}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[#17251f]">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#68736b]">{value.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  </>
);

export default About;
