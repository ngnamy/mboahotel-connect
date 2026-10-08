import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Search, Users } from 'lucide-react';

interface SearchData {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

const getLocalDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const SearchForm: React.FC = () => {
  const navigate = useNavigate();
  const today = getLocalDateValue(new Date());
  const [searchData, setSearchData] = useState<SearchData>({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
  });
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (Boolean(searchData.checkIn) !== Boolean(searchData.checkOut)) {
      setError('Indiquez les deux dates de votre séjour.');
      return;
    }

    if (searchData.checkIn && searchData.checkOut <= searchData.checkIn) {
      setError('La date de départ doit être après la date d’arrivée.');
      return;
    }

    const params = new URLSearchParams();
    if (searchData.destination.trim()) params.set('destination', searchData.destination.trim());
    if (searchData.checkIn) params.set('checkIn', searchData.checkIn);
    if (searchData.checkOut) params.set('checkOut', searchData.checkOut);
    params.set('guests', String(searchData.guests));
    navigate(`/search?${params.toString()}`);
  };

  const updateField = (field: keyof SearchData, value: string | number) => {
    setSearchData(current => ({ ...current, [field]: value }));
    if (error) setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/70 bg-white p-4 shadow-[0_22px_70px_rgba(11,35,26,0.22)] sm:p-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.25fr_1fr_1fr_0.8fr_auto] xl:items-end">
        <div>
          <label htmlFor="destination" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66736b]">
            Destination
          </label>
          <div className="relative">
            <MapPin aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7f8b82]" />
            <input
              id="destination"
              name="destination"
              type="text"
              autoComplete="off"
              value={searchData.destination}
              onChange={event => updateField('destination', event.target.value)}
              placeholder="Ville ou établissement"
              className="input pl-12"
            />
          </div>
        </div>

        <div>
          <label htmlFor="checkIn" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66736b]">
            Arrivée
          </label>
          <div className="relative">
            <CalendarDays aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7f8b82]" />
            <input
              id="checkIn"
              name="checkIn"
              type="date"
              min={today}
              value={searchData.checkIn}
              onChange={event => updateField('checkIn', event.target.value)}
              className="input pl-12"
            />
          </div>
        </div>

        <div>
          <label htmlFor="checkOut" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66736b]">
            Départ
          </label>
          <div className="relative">
            <CalendarDays aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7f8b82]" />
            <input
              id="checkOut"
              name="checkOut"
              type="date"
              min={searchData.checkIn || today}
              value={searchData.checkOut}
              onChange={event => updateField('checkOut', event.target.value)}
              className="input pl-12"
            />
          </div>
        </div>

        <div>
          <label htmlFor="guests" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66736b]">
            Voyageurs
          </label>
          <div className="relative">
            <Users aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7f8b82]" />
            <select
              id="guests"
              name="guests"
              value={searchData.guests}
              onChange={event => updateField('guests', Number(event.target.value))}
              className="input appearance-none pl-12"
            >
              {[1, 2, 3, 4, 5, 6].map(guestCount => (
                <option key={guestCount} value={guestCount}>
                  {guestCount} {guestCount === 1 ? 'voyageur' : 'voyageurs'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary min-h-[48px] w-full md:col-span-2 xl:col-span-1">
          <Search aria-hidden="true" className="h-5 w-5" />
          <span>Rechercher</span>
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-xl bg-[#fff3ed] px-4 py-3 text-sm font-medium text-[#9b4533]">
          {error}
        </p>
      )}
    </form>
  );
};

export default SearchForm;
