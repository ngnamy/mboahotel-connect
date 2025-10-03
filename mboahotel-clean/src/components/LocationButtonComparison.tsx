import React, { useState } from 'react';
import { Navigation, Loader2 } from 'lucide-react';

const LocationButtonComparison: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Comparaison des Boutons - LocationSearchSimple
        </h1>
        <p className="text-gray-600">
          Avant et après les modifications de taille et couleur
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Version AVANT */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            ❌ Version AVANT (Problématique)
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
            
            {/* Boutons AVANT - Trop grands et couleur terne */}
            <div className="flex gap-3">
              <button
                onClick={handleDemo}
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
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>❌ Effacer</span>
              </button>
            </div>
          </div>
          
          <div className="text-sm text-red-600 space-y-1">
            <p><strong>Problèmes :</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Boutons trop grands (py-3 px-4)</li>
              <li>Bouton effacer en gris terne</li>
              <li>Coins trop arrondis (rounded-xl)</li>
              <li>Manque de contraste visuel</li>
            </ul>
          </div>
        </div>

        {/* Version APRÈS */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            ✅ Version APRÈS (Améliorée)
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
            
            {/* Boutons APRÈS - Taille réduite et couleur améliorée */}
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
          
          <div className="text-sm text-green-600 space-y-1">
            <p><strong>Améliorations :</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Taille réduite (py-2 px-3)</li>
              <li>Bouton effacer en rouge vif</li>
              <li>Coins moins arrondis (rounded-lg)</li>
              <li>Meilleur contraste et lisibilité</li>
              <li>Icône ✕ plus moderne que ❌</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Détails techniques */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          🔧 Détails Techniques des Modifications
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Bouton Actualiser</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex justify-between">
                <span>Padding:</span>
                <span><code>py-3 px-4</code> → <code>py-2 px-3</code></span>
              </div>
              <div className="flex justify-between">
                <span>Bordure:</span>
                <span><code>rounded-xl</code> → <code>rounded-lg</code></span>
              </div>
              <div className="flex justify-between">
                <span>Couleur:</span>
                <span>Vert (inchangé)</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Bouton Effacer</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex justify-between">
                <span>Padding:</span>
                <span><code>py-3 px-4</code> → <code>py-2 px-3</code></span>
              </div>
              <div className="flex justify-between">
                <span>Bordure:</span>
                <span><code>rounded-xl</code> → <code>rounded-lg</code></span>
              </div>
              <div className="flex justify-between">
                <span>Couleur:</span>
                <span><code>gray-500</code> → <code>red-500</code></span>
              </div>
              <div className="flex justify-between">
                <span>Icône:</span>
                <span><code>❌</code> → <code>✕</code></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide d'utilisation */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-green-900 mb-4">
          💡 Justification des Changements
        </h2>
        
        <div className="space-y-4 text-sm text-green-800">
          <div>
            <h3 className="font-medium mb-2">🎯 Taille Réduite</h3>
            <p>Les boutons étaient trop imposants par rapport au contenu. La réduction de <code>py-3 px-4</code> à <code>py-2 px-3</code> les rend plus proportionnés et moins envahissants visuellement.</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">🎨 Couleur Rouge pour Effacer</h3>
            <p>Le gris était trop neutre pour une action destructive. Le rouge communique clairement que c'est une action d'effacement, suivant les conventions UX standards.</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">🔄 Cohérence Visuelle</h3>
            <p>Les deux boutons ont maintenant la même taille et le même style, créant une harmonie visuelle tout en gardant des couleurs distinctes pour leurs fonctions respectives.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationButtonComparison;