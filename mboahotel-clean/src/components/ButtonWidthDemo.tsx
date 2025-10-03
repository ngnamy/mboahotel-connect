import React, { useState } from 'react';
import { Navigation, Loader2 } from 'lucide-react';

const ButtonWidthDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Correction de la Largeur du Bouton Actualiser
        </h1>
        <p className="text-gray-600">
          Suppression de la classe flex-1 pour une largeur fixe
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Version AVANT - Avec flex-1 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            ❌ AVANT - Bouton en pleine largeur
          </h2>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Recherche à proximité</h3>
                <p className="text-sm text-gray-600">Trouvez des hôtels près de vous</p>
              </div>
            </div>
            
            {/* Boutons AVANT - Avec flex-1 */}
            <div className="flex gap-3">
              <button
                onClick={handleDemo}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                <span>🔄 Actualiser</span>
              </button>
              <button
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>✕ Effacer</span>
              </button>
            </div>
          </div>
          
          <div className="text-sm text-red-600 space-y-1">
            <p><strong>Problème :</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Classe <code>flex-1</code> fait prendre toute la largeur</li>
              <li>Bouton "Actualiser" disproportionné</li>
              <li>Déséquilibre visuel entre les boutons</li>
              <li>Trop d'espace vide dans le bouton</li>
            </ul>
          </div>
        </div>

        {/* Version APRÈS - Sans flex-1 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            ✅ APRÈS - Boutons à largeur fixe
          </h2>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Recherche à proximité</h3>
                <p className="text-sm text-gray-600">Trouvez des hôtels près de vous</p>
              </div>
            </div>
            
            {/* Boutons APRÈS - Sans flex-1 */}
            <div className="flex gap-3">
              <button
                onClick={handleDemo}
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
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>✕ Effacer</span>
              </button>
            </div>
          </div>
          
          <div className="text-sm text-green-600 space-y-1">
            <p><strong>Améliorations :</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Suppression de <code>flex-1</code></li>
              <li>Largeur basée sur le contenu</li>
              <li>Boutons équilibrés visuellement</li>
              <li>Design plus compact et élégant</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comparaison technique */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          🔧 Comparaison Technique
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h3 className="font-medium text-red-700 mb-3">❌ Version Problématique</h3>
            <code className="text-xs bg-red-50 p-2 rounded block break-all">
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 ..."
            </code>
            <p className="text-sm text-red-600 mt-2">
              La classe <code>flex-1</code> force le bouton à prendre tout l'espace disponible.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h3 className="font-medium text-green-700 mb-3">✅ Version Corrigée</h3>
            <code className="text-xs bg-green-50 p-2 rounded block break-all">
              className="bg-gradient-to-r from-green-500 to-emerald-500 ..."
            </code>
            <p className="text-sm text-green-600 mt-2">
              Sans <code>flex-1</code>, le bouton s'adapte à son contenu naturellement.
            </p>
          </div>
        </div>
      </div>

      {/* Exemples de largeurs */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📏 Exemples de Largeurs de Boutons
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Largeur fixe (recommandé)</h3>
            <div className="flex gap-3">
              <button className="bg-green-500 text-white py-2 px-3 rounded-lg flex items-center space-x-2">
                <Navigation className="w-4 h-4" />
                <span>Actualiser</span>
              </button>
              <button className="bg-red-500 text-white py-2 px-3 rounded-lg flex items-center space-x-2">
                <span>✕ Effacer</span>
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Avec flex-1 (problématique)</h3>
            <div className="flex gap-3">
              <button className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2">
                <Navigation className="w-4 h-4" />
                <span>Actualiser</span>
              </button>
              <button className="bg-red-500 text-white py-2 px-3 rounded-lg flex items-center space-x-2">
                <span>✕ Effacer</span>
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Largeur égale (alternative)</h3>
            <div className="flex gap-3">
              <button className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2">
                <Navigation className="w-4 h-4" />
                <span>Actualiser</span>
              </button>
              <button className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2">
                <span>✕ Effacer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonWidthDemo;