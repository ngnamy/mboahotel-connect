import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { LocationDetails, formatShortAddress } from '../utils/geolocation';

interface LocationSummaryProps {
  location: {
    latitude: number;
    longitude: number;
    city: string;
    details?: LocationDetails;
  };
  compact?: boolean;
  showCoordinates?: boolean;
}

const LocationSummary: React.FC<LocationSummaryProps> = ({
  location,
  compact = false,
  showCoordinates = false
}) => {
  const { latitude, longitude, city, details } = location;

  if (compact) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
        <span className="text-green-700 font-medium truncate">
          {details ? formatShortAddress(details) : city}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
      <div className="flex items-center space-x-2 mb-2">
        <Navigation className="w-4 h-4 text-green-600" />
        <span className="text-green-800 font-semibold text-sm">Position actuelle</span>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🏙️</span>
          <span className="font-bold text-gray-900">{city}</span>
        </div>
        
        {details?.neighbourhood && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-blue-500">🏘️</span>
            <span className="text-gray-700">{details.neighbourhood}</span>
          </div>
        )}
        
        {details?.street && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">🛣️</span>
            <span className="text-gray-700">
              {details.houseNumber && `${details.houseNumber} `}
              {details.street}
            </span>
          </div>
        )}
        
        {showCoordinates && (
          <div className="text-xs text-gray-500 font-mono mt-2 pt-2 border-t border-green-200">
            📍 {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSummary;