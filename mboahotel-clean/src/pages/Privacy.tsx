import React from 'react';
import { Helmet } from 'react-helmet-async';

const Privacy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Politique de confidentialité - Mboa Hotel</title>
        <meta name="description" content="Politique de confidentialité de Mboa Hotel - Protection de vos données personnelles" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 md:p-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full mb-6">
                <span className="text-3xl">🔒</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Politique de confidentialité
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Votre vie privée est notre priorité ! 🛡️ Découvrez comment nous protégeons et utilisons vos données personnelles.
              </p>
            </div>
            
            <div className="prose max-w-none">
              <div className="bg-emerald-50 rounded-2xl p-6 mb-8 border-l-4 border-emerald-400">
                <p className="text-emerald-800 font-medium flex items-center">
                  <span className="mr-2">📅</span>
                  Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">🌟</span>
                    1. Introduction
                  </h2>
                  <div className="bg-white/60 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed flex items-start">
                      <span className="text-2xl mr-3 mt-1">🛡️</span>
                      Mboa Hotel s'engage à protéger la confidentialité de vos données personnelles. Cette politique 
                      de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos 
                      informations personnelles lorsque vous utilisez notre plateforme de réservation d'hôtels.
                    </p>
                  </div>
                </div>
              </section>     
         <section className="mb-10">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">📊</span>
                    2. Données collectées
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">Nous collectons les types de données suivants :</p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl mt-1">👤</span>
                      <span className="text-gray-700">Informations d'identification : nom, prénom, adresse e-mail, numéro de téléphone</span>
                    </div>
                    <div className="flex items-start space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl mt-1">📅</span>
                      <span className="text-gray-700">Informations de réservation : dates de séjour, préférences, demandes spéciales</span>
                    </div>
                    <div className="flex items-start space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl mt-1">💳</span>
                      <span className="text-gray-700">Informations de paiement : données de carte bancaire (traitées de manière sécurisée)</span>
                    </div>
                    <div className="flex items-start space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl mt-1">🌐</span>
                      <span className="text-gray-700">Données de navigation : adresse IP, cookies, historique de navigation</span>
                    </div>
                    <div className="flex items-start space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl mt-1">⭐</span>
                      <span className="text-gray-700">Avis et commentaires que vous laissez sur notre plateforme</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">🎯</span>
                    3. Utilisation des données
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">Vos données sont utilisées pour :</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">📋</span>
                      <span className="text-gray-700">Traiter vos réservations et gérer votre compte</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">📞</span>
                      <span className="text-gray-700">Vous contacter concernant vos réservations</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">✨</span>
                      <span className="text-gray-700">Améliorer nos services et personnaliser</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">🎁</span>
                      <span className="text-gray-700">Envoyer des offres (avec consentement)</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">⚖️</span>
                      <span className="text-gray-700">Respecter nos obligations légales</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">🤝</span>
                    4. Partage des données
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations avec :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">🏨</span>
                      <span className="text-gray-700">Les hôtels partenaires pour vos réservations</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">💳</span>
                      <span className="text-gray-700">Les prestataires de paiement sécurisés</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">🔧</span>
                      <span className="text-gray-700">Nos prestataires techniques</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">🏛️</span>
                      <span className="text-gray-700">Les autorités légales si requis</span>
                    </div>
                  </div>
                </div>
              </section>    
          <section className="mb-10">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">🔐</span>
                    5. Sécurité des données
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Nous mettons en place des mesures techniques et organisationnelles appropriées pour protéger 
                    vos données contre l'accès non autorisé, la perte, la destruction ou la divulgation accidentelle :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">🔒</span>
                      <span className="text-gray-700">Chiffrement des données sensibles</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">🚪</span>
                      <span className="text-gray-700">Accès restreint aux données personnelles</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">👁️</span>
                      <span className="text-gray-700">Surveillance continue de nos systèmes</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">🎓</span>
                      <span className="text-gray-700">Formation régulière de notre personnel</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">⚖️</span>
                    6. Vos droits
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">👀</span>
                      <span className="text-gray-700">Droit d'accès à vos données personnelles</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">✏️</span>
                      <span className="text-gray-700">Droit de rectification des données inexactes</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">🗑️</span>
                      <span className="text-gray-700">Droit à l'effacement de vos données</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">⏸️</span>
                      <span className="text-gray-700">Droit à la limitation du traitement</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">📦</span>
                      <span className="text-gray-700">Droit à la portabilité des données</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">🚫</span>
                      <span className="text-gray-700">Droit d'opposition au traitement</span>
                    </div>
                  </div>
                  <div className="bg-indigo-100 rounded-xl p-4">
                    <p className="text-indigo-800 font-medium flex items-center">
                      <span className="text-xl mr-2">📧</span>
                      Pour exercer ces droits, contactez-nous à : privacy@mboahotel.com
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">🍪</span>
                    7. Cookies
                  </h2>
                  <div className="bg-white/60 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed flex items-start">
                      <span className="text-2xl mr-3 mt-1">🌐</span>
                      Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez 
                      gérer vos préférences de cookies dans les paramètres de votre navigateur.
                    </p>
                  </div>
                </div>
              </section>          
    <section className="mb-10">
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">⏰</span>
                    8. Conservation des données
                  </h2>
                  <div className="bg-white/60 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed flex items-start">
                      <span className="text-2xl mr-3 mt-1">📚</span>
                      Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux finalités 
                      pour lesquelles elles ont été collectées, ou selon les exigences légales applicables.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">📞</span>
                    9. Contact
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Pour toute question concernant cette politique de confidentialité, contactez-nous :
                  </p>
                  <div className="bg-gradient-to-r from-white to-cyan-50 rounded-2xl p-6 border border-cyan-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-4">🔒</span>
                      <h3 className="text-xl font-bold text-gray-800">Mboa Hotel - Protection des données</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">📧</span>
                        <span className="text-gray-700">privacy@mboahotel.com</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">📱</span>
                        <span className="text-gray-700">+237 123 456 789</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">📍</span>
                        <span className="text-gray-700">Yaoundé, Cameroun</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">🔄</span>
                    10. Modifications
                  </h2>
                  <div className="bg-white/60 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed flex items-start">
                      <span className="text-2xl mr-3 mt-1">📝</span>
                      Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                      Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour.
                    </p>
                  </div>
                </div>
              </section>

              {/* Message de fin sympathique */}
              <div className="text-center mt-12 mb-8">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-3xl p-8 text-white">
                  <div className="text-4xl mb-4">🛡️</div>
                  <h3 className="text-2xl font-bold mb-2">Vos données en sécurité !</h3>
                  <p className="text-emerald-100">
                    Nous nous engageons à protéger votre vie privée avec le plus grand soin. 
                    Voyagez l'esprit tranquille avec Mboa Hotel ! 🌟✨
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;