import React, { useState } from 'react';
import LocationDetailsCard from './LocationDetailsCard';
import LocationDetailsCardAlt from './LocationDetailsCardAlt';
import { LocationDetails } from '../utils/geolocation';

const ButtonStyleDemo: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Données d'exemple
  const mockLocation = {
    latitude: 3.8480,
    longitude: 11.5021,
    city: 'Yaoundé',
    details: {
      city: 'Yaoundé',
      region: 'Centre',
      neighbourhood: 'Bastos',
      street: 'Avenue Charles de Gaulle',
      houseNumber: '123',
      country: 'Cameroun',
      fullAddress: '123 Avenue Charles de Gaulle, Bastos, Yaoundé, Centre, Cameroun'
    } as LocationDetails
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const handleClear = () => {
    console.log('Position effacée');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Comparaison des Styles de Boutons
        </h1>
        <p className="text-gray-600">
          Différentes variantes de design pour les boutons d'action
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Version principale avec boutons améliorés */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            🎨 Version Principale (Améliorée)
          </h2>
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <LocationDetailsCard
              location={mockLocation}
              onRefresh={handleRefresh}
              onClear={handleClear}
              isRefreshing={isRefreshing}
            />
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Caractéristiques :</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Boutons avec arrière-plan coloré</li>
              <li>Bordures et ombres subtiles</li>
              <li>Texte masqué sur mobile (responsive)</li>
              <li>Couleurs : vert pour actualiser, rouge pour effacer</li>
              <li>Effets hover et scale</li>
            </ul>
          </div>
        </div>

        {/* Version alternative avec dégradés */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            ✨ Version Alternative (Dégradés)
          </h2>
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <LocationDetailsCardAlt
              location={mockLocation}
              onRefresh={handleRefresh}
              onClear={handleClear}
              isRefreshing={isRefreshing}
            />
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Caractéristiques :</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Boutons avec dégradés colorés</li>
              <li>Icônes Lucide React (RefreshCw, X)</li>
              <li>Style plus moderne et vibrant</li>
              <li>Couleurs : bleu pour actualiser, rouge pour effacer</li>
              <li>Boutons plus compacts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comparaison des tailles et états */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🔍 Comparaison des États
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* État normal */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">État Normal</h3>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1.5 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg border border-green-200 shadow-sm">
                <span className="w-4 h-4">🔄</span>
                <span className="text-xs font-medium">Actualiser</span>
              </button>
              <button className="flex items-center space-x-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 shadow-sm">
                <span className="text-sm">✕</span>
                <span className="text-xs font-medium">Effacer</span>
              </button>
            </div>
          </div>

          {/* État hover */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">État Hover</h3>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1.5 px-3 py-2 bg-green-200 text-green-800 rounded-lg border border-green-300 shadow-sm transform scale-105">
                <span className="w-4 h-4">🔄</span>
                <span className="text-xs font-medium">Actualiser</span>
              </button>
              <button className="flex items-center space-x-1.5 px-3 py-2 bg-red-100 text-red-700 rounded-lg border border-red-300 shadow-sm transform scale-105">
                <span className="text-sm">✕</span>
                <span className="text-xs font-medium">Effacer</span>
              </button>
            </div>
          </div>

          {/* État chargement */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">État Chargement</h3>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1.5 px-3 py-2 bg-green-100 text-green-700 rounded-lg border border-green-200 shadow-sm opacity-50 cursor-not-allowed">
                <span className="w-4 h-4 animate-spin">🔄</span>
                <span className="text-xs font-medium">Actualiser</span>
              </button>
              <button className="flex items-center space-x-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg border border-red-200 shadow-sm">
                <span className="text-sm">✕</span>
                <span className="text-xs font-medium">Effacer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guide d'utilisation */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          📋 Guide d'Utilisation
        </h2>
        
        <div className="space-y-4 text-sm text-blue-800">
          <div>
            <h3 className="font-medium mb-2">🎯 Bouton Actualiser</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Taille augmentée : <code>px-3 py-2</code> au lieu de <code>p-1.5</code></li>
              <li>Icône plus grande : <code>w-4 h-4</code> au lieu de <code>w-4 h-4</code></li>
              <li>Couleur verte pour indiquer une action positive</li>
              <li>Animation de rotation pendant le chargement</li>
              <li>Texte masqué sur mobile avec <code>hidden sm:inline</code></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">🗑️ Bouton Effacer</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Couleur rouge pour indiquer une action destructive</li>
              <li>Bordure visible pour plus de contraste</li>
              <li>Icône ✕ plus lisible que ❌</li>
              <li>Effet hover avec changement de couleur</li>
              <li>Même taille que le bouton actualiser pour cohérence</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonStyleDemo;