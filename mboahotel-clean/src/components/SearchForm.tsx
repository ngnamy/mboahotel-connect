import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

const SearchForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Rediriger vers la page de recherche avec les paramètres
    const params = new URLSearchParams();
    if (searchData.destination) params.set('destination', searchData.destination);
    if (searchData.checkIn) params.set('checkIn', searchData.checkIn);
    if (searchData.checkOut) params.set('checkOut', searchData.checkOut);
    params.set('guests', searchData.guests.toString());
    
    navigate(`/search?${params.toString()}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) : value
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Destination */}
          <div className="md:col-span-1">
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="destination"
                name="destination"
                value={searchData.destination}
                onChange={handleInputChange}
                placeholder="Où souhaitez-vous aller ?"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Date d'arrivée */}
          <div className="md:col-span-1">
            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
              Arrivée
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={searchData.checkIn}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Date de départ */}
          <div className="md:col-span-1">
            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
              Départ
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={searchData.checkOut}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Nombre de personnes */}
          <div className="md:col-span-1">
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
              Voyageurs
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                id="guests"
                name="guests"
                value={searchData.guests}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value={1}>1 personne</option>
                <option value={2}>2 personnes</option>
                <option value={3}>3 personnes</option>
                <option value={4}>4 personnes</option>
                <option value={5}>5+ personnes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bouton de recherche */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2 text-lg"
          >
            <Search className="w-5 h-5" />
            <span>Rechercher des hôtels</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;