import React from 'react';
import { MapPin, Navigation, Globe, Building2, RefreshCw, X } from 'lucide-react';
import { LocationDetails } from '../utils/geolocation';

interface LocationDetailsCardAltProps {
  location: {
    latitude: number;
    longitude: number;
    city: string;
    details?: LocationDetails;
  };
  onRefresh?: () => void;
  onClear?: () => void;
  isRefreshing?: boolean;
}

const LocationDetailsCardAlt: React.FC<LocationDetailsCardAltProps> = ({
  location,
  onRefresh,
  onClear,
  isRefreshing = false
}) => {
  const { latitude, longitude, city, details } = location;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm">
      {/* En-tête avec titre et actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-green-800">Votre position</span>
        </div>
        
        <div className="flex space-x-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-sm"
              title="Actualiser la position"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
          )}
          {onClear && (
            <button
              onClick={onClear}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm"
              title="Effacer la position"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Effacer</span>
            </button>
          )}
        </div>
      </div>

      {/* Informations principales */}
      <div className="space-y-2">
        {/* Ville principale */}
        <div className="flex items-center space-x-3">
          <Building2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <span className="font-bold text-gray-900 text-lg">{city}</span>
            {details?.region && (
              <span className="text-gray-600 text-sm ml-2">({details.region})</span>
            )}
          </div>
        </div>

        {/* Détails d'adresse */}
        {details && (
          <div className="space-y-1.5 ml-8">
            {details.neighbourhood && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-blue-500">🏘️</span>
                <span className="text-gray-700 font-medium">Quartier: {details.neighbourhood}</span>
              </div>
            )}
            
            {details.street && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">🛣️</span>
                <span className="text-gray-700">
                  {details.houseNumber && `${details.houseNumber} `}
                  {details.street}
                </span>
              </div>
            )}
            
            {details.postcode && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-purple-500">📮</span>
                <span className="text-gray-600">Code postal: {details.postcode}</span>
              </div>
            )}
          </div>
        )}

        {/* Pays */}
        <div className="flex items-center space-x-2 text-sm">
          <Globe className="w-4 h-4 text-blue-500" />
          <span className="text-gray-700 font-medium">
            {details?.country || 'Cameroun'} 🇨🇲
          </span>
        </div>
      </div>

      {/* Coordonnées GPS */}
      <div className="mt-3 pt-3 border-t border-green-200">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">Coordonnées GPS:</span>
          <div className="text-xs font-mono text-gray-600 bg-white px-2 py-1 rounded border">
            {latitude.toFixed(6)}°, {longitude.toFixed(6)}°
          </div>
        </div>
      </div>

      {/* Adresse complète (si disponible) */}
      {details?.fullAddress && (
        <div className="mt-3 pt-3 border-t border-green-200">
          <div className="text-xs text-gray-500 mb-1">Adresse complète:</div>
          <div className="text-xs text-gray-700 bg-white p-2 rounded border leading-relaxed">
            {details.fullAddress}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDetailsCardAlt;