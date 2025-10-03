import React, { useState } from 'react';
import LocationSearchSimple from './LocationSearchSimple';
import LocationDetailsCard from './LocationDetailsCard';
import LocationSummary from './LocationSummary';
import { LocationDetails } from '../utils/geolocation';

const LocationDemo: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    city: string;
    details?: LocationDetails;
  } | null>(null);

  const handleLocationFound = (latitude: number, longitude: number, city: string, details?: LocationDetails) => {
    setCurrentLocation({ latitude, longitude, city, details });
  };

  const handleLocationCleared = () => {
    setCurrentLocation(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Système de Géolocalisation Amélioré
        </h1>
        <p className="text-gray-600">
          Découvrez les détails précis de votre position : ville, quartier, rue et coordonnées GPS
        </p>
      </div>

      {/* Composant principal de recherche de localisation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🎯 Détection de Position</h2>
        <LocationSearchSimple
          onLocationFound={handleLocationFound}
          onLocationCleared={handleLocationCleared}
          currentLocation={currentLocation}
        />
      </div>

      {/* Affichage des détails si une position est détectée */}
      {currentLocation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Résumé compact */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📋 Résumé Compact</h2>
            <LocationSummary 
              location={currentLocation} 
              showCoordinates={true}
            />
          </div>

          {/* Version très compacte */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🏷️ Version Compacte</h2>
            <LocationSummary 
              location={currentLocation} 
              compact={true}
            />
          </div>
        </div>
      )}

      {/* Informations détaillées sur les fonctionnalités */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">✨ Fonctionnalités Améliorées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🏙️</span>
              <div>
                <h3 className="font-medium text-blue-800">Ville Précise</h3>
                <p className="text-sm text-blue-700">Détection automatique de la ville la plus proche</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🏘️</span>
              <div>
                <h3 className="font-medium text-blue-800">Quartier/District</h3>
                <p className="text-sm text-blue-700">Identification du quartier ou district local</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🛣️</span>
              <div>
                <h3 className="font-medium text-blue-800">Rue et Numéro</h3>
                <p className="text-sm text-blue-700">Adresse complète avec numéro de rue</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📍</span>
              <div>
                <h3 className="font-medium text-blue-800">Coordonnées GPS</h3>
                <p className="text-sm text-blue-700">Latitude et longitude précises</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🇨🇲</span>
              <div>
                <h3 className="font-medium text-blue-800">Pays et Région</h3>
                <p className="text-sm text-blue-700">Informations géographiques complètes</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔄</span>
              <div>
                <h3 className="font-medium text-blue-800">Actualisation</h3>
                <p className="text-sm text-blue-700">Mise à jour en temps réel de la position</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exemple d'utilisation dans une recherche d'hôtels */}
      {currentLocation && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🏨 Intégration Recherche d'Hôtels</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-green-600">✅</span>
              <span className="font-medium text-green-800">Position détectée avec succès</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Recherche automatique :</span>
                <span className="font-medium">{currentLocation.city}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tri par :</span>
                <span className="font-medium text-blue-600">Distance croissante</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Zone de recherche :</span>
                <span className="font-medium">
                  {currentLocation.details?.neighbourhood || currentLocation.details?.district || 'Ville entière'}
                </span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded border border-green-300">
              <p className="text-sm text-gray-700">
                <span className="font-medium">💡 Astuce :</span> Les hôtels sont maintenant triés par distance depuis votre position exacte. 
                Les plus proches apparaissent en premier avec leur distance affichée.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDemo;