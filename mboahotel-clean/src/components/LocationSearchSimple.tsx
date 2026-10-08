import React, { useState } from 'react';
import { MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { getNearestCity, getLocationDetails, formatLocationDetails, LocationDetails } from '../utils/geolocation';
import LocationDetailsCard from './LocationDetailsCard';

interface LocationSearchSimpleProps {
  onLocationFound: (latitude: number, longitude: number, city: string, details?: any) => void;
  onLocationCleared: () => void;
  currentLocation?: { 
    latitude: number; 
    longitude: number; 
    city: string;
    details?: any;
  } | null;
}

const LocationSearchSimple: React.FC<LocationSearchSimpleProps> = ({
  onLocationFound,
  onLocationCleared,
  currentLocation
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par ce navigateur');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // D'abord obtenir la ville la plus proche rapidement
          const nearestCity = getNearestCity({ latitude, longitude });
          onLocationFound(latitude, longitude, nearestCity);
          
          // Ensuite obtenir les détails complets (peut prendre plus de temps)
          setLoadingDetails(true);
          const locationDetails = await getLocationDetails({ latitude, longitude });
          onLocationFound(latitude, longitude, locationDetails.city, locationDetails);
          setLoadingDetails(false);
          
        } catch (err) {
          console.error('Erreur lors de la détection de la localisation:', err);
          onLocationFound(latitude, longitude, 'Yaoundé');
          setLoadingDetails(false);
        }
        setLoading(false);
      },
      (error) => {
        let errorMessage = 'Erreur de géolocalisation';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'L\'accès à la géolocalisation a été refusé';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Les informations de localisation ne sont pas disponibles';
            break;
          case error.TIMEOUT:
            errorMessage = 'La demande de géolocalisation a expiré';
            break;
        }

        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleClearLocation = () => {
    onLocationCleared();
    setError(null);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Recherche à proximité</h3>
            <p className="text-sm text-gray-600">Trouvez des hôtels près de vous</p>
          </div>
        </div>
        

      </div>

      {/* État de chargement */}
      {(loading || loadingDetails) && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
          <span className="text-gray-600">
            {loading ? 'Localisation en cours...' : 'Récupération des détails...'}
          </span>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Erreur de géolocalisation</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
        {!currentLocation ? (
          <button
            onClick={handleGetLocation}
            disabled={loading}
            className="inline-flex w-fit max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#174c3a] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#103b2d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>Utiliser ma position</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleGetLocation}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
              <span>🔄 Actualiser</span>
            </button>
            <button
              onClick={handleClearLocation}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>✕ Effacer</span>
            </button>
          </>
        )}
      </div>

      {/* Information sur la géolocalisation */}
      {!error && !loading && !currentLocation && (
        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-blue-800 text-sm flex items-start">
            <span className="text-lg mr-2">💡</span>
            Activez la géolocalisation pour découvrir les hôtels les plus proches de votre position actuelle.
          </p>
        </div>
      )}

      {/* Affichage des détails de localisation */}
      {currentLocation && (
        <div className="mt-4">
          <LocationDetailsCard
            location={currentLocation}
            onRefresh={handleGetLocation}
            onClear={handleClearLocation}
            isRefreshing={loading || loadingDetails}
          />
        </div>
      )}
    </div>
  );
};

export default LocationSearchSimple;