import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Check,
  Compass,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import SearchForm from '../components/SearchForm';
import { usePublicHotels } from '../lib/publicHotels';

const featuredHotels = [
  {
    id: '1',
    name: 'Hôtel La Falaise',
    city: 'Yaoundé',
    location: 'Bastos',
    price: 45000,
    image: '/images/hotels/hotel-la-falaise.svg',
    features: ['Piscine', 'Restaurant', 'Wi-Fi'],
  },
  {
    id: '2',
    name: 'Hôtel Akwa Palace',
    city: 'Douala',
    location: 'Akwa',
    price: 75000,
    image: '/images/hotels/hotel-akwa-palace.svg',
    features: ['Spa', 'Restaurant', 'Navette aéroport'],
  },
];

const destinations = [
  {
    name: 'Yaoundé',
    region: 'Centre',
    image: '/images/cities/yaounde.svg',
    description: 'La capitale au cœur des collines',
  },
  {
    name: 'Douala',
    region: 'Littoral',
    image: '/images/cities/douala.svg',
    description: 'L’énergie de la capitale économique',
  },
  {
    name: 'Bafoussam',
    region: 'Ouest',
    image: '/images/cities/bafoussam.svg',
    description: 'À la découverte des hauts plateaux',
  },
  {
    name: 'Bamenda',
    region: 'Nord-Ouest',
    image: '/images/cities/bamenda.svg',
    description: 'Entre collines et traditions',
  },
];

const Home: React.FC = () => {
  const { hotels: publishedHotels, isConfigured, isLoading, error } = usePublicHotels();
  const hotelsToFeature = isConfigured
    ? publishedHotels.slice(0, 2).map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        city: hotel.city,
        location: hotel.address,
        price: hotel.price,
        image: hotel.image,
        features: hotel.amenities,
      }))
    : featuredHotels;

  return (
  <div className="overflow-hidden">
    <section className="relative isolate min-h-[620px] bg-[#103b2d] sm:min-h-[680px]">
      <img
        src="/images/baniere/3192.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0d2e23]/90 via-[#12392c]/70 to-[#12392c]/25" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#faf9f6] to-transparent" />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="max-w-3xl text-white">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-[#e2b767]" />
            Votre prochaine escale commence ici
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Le Cameroun,
            <span className="block font-serif italic text-[#f0d8a9]">à votre rythme.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
            Trouvez un lieu où poser vos valises, des rues de Douala aux collines de Yaoundé.
          </p>
        </div>

        <div className="mt-10 max-w-6xl">
          <SearchForm />
          <p className="mt-3 text-xs text-white/75">
            Les tarifs et disponibilités affichés dans cette version sont indicatifs et doivent être confirmés.
          </p>
        </div>
      </div>
    </section>

    <section className="relative z-10 mx-auto -mt-2 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="grid gap-4 rounded-3xl border border-[#e8e7e0] bg-white p-5 shadow-[0_18px_55px_rgba(23,37,31,0.07)] sm:grid-cols-3 sm:p-7">
        <div className="flex items-start gap-4 p-2">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e9f0eb] text-[#174c3a]">
            <Compass aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold text-[#17251f]">Explorez à votre façon</h2>
            <p className="mt-1 text-sm leading-6 text-[#68736b]">Recherchez par destination et comparez les options.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-2">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f5f1e8] text-[#966d32]">
            <MapPin aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold text-[#17251f]">Du Nord au Sud</h2>
            <p className="mt-1 text-sm leading-6 text-[#68736b]">Parcourez les grandes villes et les régions du pays.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-2">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f7eee9] text-[#a05235]">
            <Building2 aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold text-[#17251f]">Un espace pour les hôteliers</h2>
            <p className="mt-1 text-sm leading-6 text-[#68736b]">Découvrez comment présenter votre établissement.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a3663d]">Pour commencer</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#17251f] sm:text-4xl">
            Quelques adresses à découvrir
          </h2>
          <p className="mt-3 text-base leading-7 text-[#68736b]">
            {isConfigured
              ? 'Découvrez les établissements approuvés et publiés par nos partenaires.'
              : 'Parcourez un aperçu de démonstration en attendant la configuration du catalogue.'}
          </p>
        </div>
        <Link to="/search" className="group inline-flex min-h-[44px] items-center gap-2 self-start text-sm font-semibold text-[#174c3a] hover:text-[#103b2d] sm:self-auto">
          Explorer les hôtels
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {isLoading ? (
        <p role="status" className="py-8 text-sm text-[#68736b]">Chargement des établissements publiés…</p>
      ) : error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>
      ) : hotelsToFeature.length ? (
      <div className="grid gap-6 lg:grid-cols-2">
        {hotelsToFeature.map(hotel => (
          <Link
            key={hotel.id}
            to={`/hotel/${hotel.id}`}
            className="group grid overflow-hidden rounded-3xl border border-[#e8e7e0] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(23,37,31,0.1)] sm:grid-cols-[0.95fr_1.05fr]"
          >
            <div className="relative min-h-56 overflow-hidden bg-[#f0eee8] sm:min-h-[280px]">
              <img src={hotel.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#174c3a] backdrop-blur">
                {hotel.city}
              </span>
            </div>
            <div className="flex flex-col justify-between p-6 sm:p-7">
              <div>
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a857d]">
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                  {hotel.location}, {hotel.city}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#17251f]">{hotel.name}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {hotel.features.map(feature => (
                    <span key={feature} className="rounded-full bg-[#f5f4ef] px-3 py-1.5 text-xs font-medium text-[#59645d]">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex items-end justify-between gap-4 border-t border-[#eeede7] pt-5">
                <p className="text-sm text-[#68736b]">
                  <span className="block text-xs">À partir de</span>
                  <span className="mt-1 inline-flex items-baseline gap-1">
                    {hotel.price > 0 ? (
                      <>
                        <strong className="text-xl font-semibold text-[#17251f]">{hotel.price.toLocaleString('fr-FR')}</strong>
                        <span className="text-xs">XAF / nuit</span>
                      </>
                    ) : <strong className="text-sm font-semibold text-[#68736b]">Tarif à confirmer</strong>}
                  </span>
                </p>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#e9f0eb] text-[#174c3a] transition-colors group-hover:bg-[#174c3a] group-hover:text-white">
                  <ArrowRight aria-hidden="true" className="h-5 w-5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      ) : (
        <div className="page-card p-6 text-sm leading-6 text-[#68736b]">
          Aucun établissement n’est publié pour le moment. Revenez bientôt pour découvrir les premières adresses partenaires.
        </div>
      )}
      {!isConfigured && (
        <p className="mt-4 text-xs leading-5 text-[#858d87]">
          Les informations, photos, tarifs et disponibilités de cet aperçu restent à vérifier avant toute réservation.
        </p>
      )}
    </section>

    <section className="bg-[#f2f0e9] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a3663d]">Inspirations locales</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#17251f] sm:text-4xl">Où poser vos valises ?</h2>
          <p className="mt-3 text-base leading-7 text-[#68736b]">Choisissez une ville pour explorer les résultats disponibles.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {destinations.map(destination => (
            <Link
              key={destination.name}
              to={`/search?destination=${encodeURIComponent(destination.name)}`}
              className="group overflow-hidden rounded-2xl border border-[#e2e0d8] bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#e8e7e0]">
                <img src={destination.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a7443]">{destination.region}</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-[#17251f] sm:text-lg">{destination.name}</h3>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-[#174c3a] transition-transform group-hover:translate-x-1" />
                </div>
                <p className="mt-1 hidden text-xs leading-5 text-[#68736b] sm:block">{destination.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#174c3a] px-6 py-12 text-white sm:px-12 sm:py-16">
        <div className="absolute -right-14 -top-20 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -right-2 -top-8 h-40 w-40 rounded-full border border-white/10" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#e3bd82]">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              Partenaires hôteliers
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Faites découvrir votre établissement.</h2>
            <p className="mt-4 max-w-xl leading-7 text-white/75">
              Découvrez l’espace partenaire et les étapes pour proposer votre hébergement sur MboaHotel.
            </p>
          </div>
          <Link to="/register?role=hotelier" className="btn-secondary w-full border-white/20 bg-white text-[#174c3a] hover:bg-[#f5f1e8] sm:w-auto">
            En savoir plus
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-sm text-white/75">
          <span className="inline-flex items-center gap-2"><Check aria-hidden="true" className="h-4 w-4 text-[#e3bd82]" />Présentation de votre hébergement</span>
          <span className="inline-flex items-center gap-2"><ShieldCheck aria-hidden="true" className="h-4 w-4 text-[#e3bd82]" />Informations gérées par établissement</span>
          <span className="inline-flex items-center gap-2"><Star aria-hidden="true" className="h-4 w-4 text-[#e3bd82]" />Contact avec notre équipe</span>
        </div>
      </div>
    </section>
  </div>
  );
};

export default Home;
