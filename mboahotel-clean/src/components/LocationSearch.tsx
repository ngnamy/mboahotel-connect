import React, { useState } from 'react';
import { MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { getNearestCity, formatDistance } from '../utils/geolocation';

interface LocationSearchProps {
  onLocationFound: (latitude: number, longitude: number, city: string) => void;
  onLocationCleared: () => void;
  currentLocation?: { latitude: number; longitude: number; city: string } | null;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationFound,
  onLocationCleared,
  currentLocation
}) => {
  const { 
    latitude, 
    longitude, 
    error, 
    loading, 
    getCurrentPosition, 
    clearLocation,
    isLocationAvailable 
  } = useGeolocation();

  const [showPermissionHelp, setShowPermissionHelp] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);

  const handleGetLocation = () => {
    setShowPermissionHelp(false);
    setHasNotified(false); // Réinitialiser pour permettre une nouvelle notification
    getCurrentPosition();
  };

  const handleClearLocation = () => {
    clearLocation();
    setHasNotified(false);
    onLocationCleared();
  };

  // Quand la position est obtenue, notifier le parent - Version simplifiée
  React.useEffect(() => {
    if (isLocationAvailable && latitude && longitude && !hasNotified) {
      try {
        const nearestCity = getNearestCity({ latitude, longitude });
        onLocationFound(latitude, longitude, nearestCity);
        setHasNotified(true);
      } catch (error) {
        console.error('Erreur lors de la détection de la ville la plus proche:', error);
        onLocationFound(latitude, longitude, 'Yaoundé');
        setHasNotified(true);
      }
    }
  }, [isLocationAvailable, latitude, longitude, hasNotified]); // Retirer onLocationFound

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
        
        {currentLocation && (
          <div className="text-right">
            <div className="text-sm font-medium text-green-600 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {currentLocation.city}
            </div>
            <div className="text-xs text-gray-500">Position actuelle</div>
          </div>
        )}
      </div>

      {/* État de chargement */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
          <span className="text-gray-600">Localisation en cours...</span>
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
              {error.includes('refusé') && (
                <button
                  onClick={() => setShowPermissionHelp(!showPermissionHelp)}
                  className="text-red-600 text-sm underline mt-2"
                >
                  Comment activer la géolocalisation ?
                </button>
              )}
            </div>
          </div>
          
          {showPermissionHelp && (
            <div className="mt-4 p-3 bg-red-100 rounded-lg">
              <p className="text-red-800 text-sm font-medium mb-2">Pour activer la géolocalisation :</p>
              <ol className="text-red-700 text-sm space-y-1 list-decimal list-inside">
                <li>Cliquez sur l'icône de localisation dans la barre d'adresse</li>
                <li>Sélectionnez "Autoriser" pour ce site</li>
                <li>Rechargez la page si nécessaire</li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex gap-3">
        {!currentLocation ? (
          <button
            onClick={handleGetLocation}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>📍 Utiliser ma position</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleGetLocation}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
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
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>❌ Effacer</span>
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
    </div>
  );
};

export default LocationSearch;