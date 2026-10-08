import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageIntro from '../components/PageIntro';

const Terms: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Conditions d'utilisation - Mboa Hotel</title>
        <meta name="description" content="Conditions d'utilisation de Mboa Hotel - Règles et conditions d'usage de notre plateforme" />
      </Helmet>
      
      <div className="page-shell">
        <div className="page-container max-w-4xl">
          <PageIntro
            eyebrow="Informations juridiques"
            title="Conditions d’utilisation"
            description="Informations relatives à l’utilisation de MboaHotel Connect."
            centered
          />
          <div className="page-card p-5 sm:p-8 md:p-12">
            <p role="note" className="mb-8 rounded-xl border border-[#e4d0a2] bg-[#f8f3e9] p-4 text-sm leading-6 text-[#5c4324]">
              Brouillon à valider juridiquement avant publication. Cette version de démonstration ne permet ni réservation ni paiement ; les dispositions décrivant ces services ne sont pas actives.
            </p>
            
            <div className="prose max-w-none">
              <div className="bg-blue-50 rounded-2xl p-6 mb-8 border-l-4 border-blue-400">
                <p className="text-blue-800 font-medium flex items-center">
                  <span className="mr-2">📅</span>
                  Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">🤝</span>
                    1. Acceptation des conditions
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    En utilisant la plateforme Mboa Hotel, vous acceptez d'être lié par ces conditions d'utilisation. 
                    Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                  </p>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">🏨</span>
                    2. Description du service
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    MboaHotel Connect est actuellement une démonstration permettant de parcourir un catalogue indicatif. Les réservations, comptes et paiements ne sont pas opérationnels.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-3">
                      <span className="text-xl">🔍</span>
                      <span className="text-gray-700">Rechercher et comparer des hôtels</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-3">
                      <span className="text-xl">💻</span>
                      <span className="text-gray-700">Effectuer des réservations en ligne</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-3">
                      <span className="text-xl">📱</span>
                      <span className="text-gray-700">Gérer leurs réservations</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-3">
                      <span className="text-xl">⭐</span>
                      <span className="text-gray-700">Laisser des avis et commentaires</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-3">
                      <span className="text-xl">🎁</span>
                      <span className="text-gray-700">Accéder à des offres spéciales</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">👤</span>
                    3. Inscription et compte utilisateur
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Pour utiliser certaines fonctionnalités, vous devez créer un compte en fournissant des 
                    informations exactes et à jour. Vous êtes responsable de :
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl mt-1">🔐</span>
                      <span className="text-gray-700">La confidentialité de vos identifiants de connexion</span>
                    </div>
                    <div className="flex items-start space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl mt-1">📊</span>
                      <span className="text-gray-700">Toutes les activités effectuées sous votre compte</span>
                    </div>
                    <div className="flex items-start space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl mt-1">🔄</span>
                      <span className="text-gray-700">La mise à jour de vos informations personnelles</span>
                    </div>
                    <div className="flex items-start space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl mt-1">🚨</span>
                      <span className="text-gray-700">Nous signaler tout usage non autorisé de votre compte</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="mr-3 text-2xl">💳</span>
                    4. Réservations et paiements
                  </h2>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="mr-2 text-lg">📋</span>
                      4.1 Processus de réservation
                    </h3>
                    <div className="bg-white/60 rounded-xl p-4">
                      <p className="text-gray-700 leading-relaxed">
                        Aucune réservation n’est créée ou confirmée par cette démonstration. Les disponibilités et prix affichés sont indicatifs et doivent être vérifiés directement auprès de l’établissement.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="mr-2 text-lg">💰</span>
                      4.2 Paiement
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                        <span className="text-xl">⏰</span>
                        <span className="text-gray-700">Aucun paiement n’est actuellement accepté sur la plateforme</span>
                      </div>
                      <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                        <span className="text-xl">💵</span>
                        <span className="text-gray-700">Les prix affichés sont indicatifs et ne constituent pas une offre</span>
                      </div>
                      <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                        <span className="text-xl">💳</span>
                        <span className="text-gray-700">Aucune donnée bancaire ne doit être saisie</span>
                      </div>
                      <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                        <span className="text-xl">📊</span>
                        <span className="text-gray-700">Frais de service peuvent s'appliquer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">🔄</span>
                    5. Annulations et modifications
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Les conditions d'annulation et de modification dépendent de l'hôtel et du tarif choisi :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">✅</span>
                      <span className="text-gray-700">Annulation gratuite selon les conditions</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">💸</span>
                      <span className="text-gray-700">Annulation avec frais possibles</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">❌</span>
                      <span className="text-gray-700">Tarifs non remboursables</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">📝</span>
                      <span className="text-gray-700">Modifications selon disponibilité</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">⚖️</span>
                    6. Utilisation acceptable
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">Vous vous engagez à ne pas :</p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl mt-1">🚫</span>
                      <span className="text-gray-700">Utiliser le service à des fins illégales ou non autorisées</span>
                    </div>
                    <div className="flex items-start space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl mt-1">💬</span>
                      <span className="text-gray-700">Publier du contenu offensant, diffamatoire ou inapproprié</span>
                    </div>
                    <div className="flex items-start space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl mt-1">🔒</span>
                      <span className="text-gray-700">Tenter d'accéder aux comptes d'autres utilisateurs</span>
                    </div>
                    <div className="flex items-start space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl mt-1">⚡</span>
                      <span className="text-gray-700">Perturber le fonctionnement de la plateforme</span>
                    </div>
                    <div className="flex items-start space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl mt-1">🤖</span>
                      <span className="text-gray-700">Utiliser des robots ou scripts automatisés</span>
                    </div>
                    <div className="flex items-start space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl mt-1">©️</span>
                      <span className="text-gray-700">Violer les droits de propriété intellectuelle</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">⭐</span>
                    7. Avis et commentaires
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    En publiant des avis ou commentaires, vous accordez à Mboa Hotel le droit d'utiliser, 
                    modifier et afficher ce contenu. Vous garantissez que :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">✨</span>
                      <span className="text-gray-700">Avis basés sur une expérience réelle</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">✅</span>
                      <span className="text-gray-700">Contenu véridique et non trompeur</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">🤐</span>
                      <span className="text-gray-700">Respect de la vie privée d'autrui</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">⚖️</span>
                      <span className="text-gray-700">Respect des lois applicables</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">©️</span>
                    8. Propriété intellectuelle
                  </h2>
                  <div className="bg-white/60 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed flex items-start">
                      <span className="text-2xl mr-3 mt-1">🛡️</span>
                      Tous les contenus de la plateforme (textes, images, logos, design) sont protégés par 
                      les droits de propriété intellectuelle. Toute reproduction non autorisée est interdite.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">⚠️</span>
                    9. Limitation de responsabilité
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Mboa Hotel agit en tant qu'intermédiaire entre les clients et les hôtels. Notre responsabilité 
                    est limitée aux services de réservation. Nous ne sommes pas responsables de :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">🏨</span>
                      <span className="text-gray-700">La qualité des services hôteliers</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">💥</span>
                      <span className="text-gray-700">Les dommages indirects ou consécutifs</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">⏸️</span>
                      <span className="text-gray-700">Les interruptions de service temporaires</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/60 rounded-xl p-4">
                      <span className="text-xl">❓</span>
                      <span className="text-gray-700">Les erreurs d'informations des hôtels</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">🤝</span>
                    10. Résolution des litiges
                  </h2>
                  <div className="bg-white/60 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed flex items-start">
                      <span className="text-2xl mr-3 mt-1">⚖️</span>
                      En cas de litige, nous encourageons la résolution amiable. Si nécessaire, les litiges 
                      seront soumis aux tribunaux compétents du Cameroun.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">🚪</span>
                    11. Suspension et résiliation
                  </h2>
                  <div className="bg-white/60 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed flex items-start">
                      <span className="text-2xl mr-3 mt-1">⛔</span>
                      Nous nous réservons le droit de suspendre ou résilier votre compte en cas de violation 
                      de ces conditions d'utilisation, sans préavis et sans remboursement.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">📞</span>
                    12. Contact
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Pour toute question concernant ces conditions d'utilisation :
                  </p>
                  <div className="bg-gradient-to-r from-white to-blue-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-4">🏨</span>
                      <h3 className="text-xl font-bold text-gray-800">Mboa Hotel</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">📧</span>
                        <span className="text-gray-700">support@mboahotel.com</span>
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
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3 text-2xl">🔄</span>
                    13. Modifications des conditions
                  </h2>
                  <div className="bg-white/60 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed flex items-start">
                      <span className="text-2xl mr-3 mt-1">📝</span>
                      Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications 
                      entreront en vigueur dès leur publication sur cette page. Il est de votre responsabilité 
                      de consulter régulièrement ces conditions.
                    </p>
                  </div>
                </div>
              </section>

              {/* Message de fin sympathique */}
              <div className="text-center mt-12 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold mb-2">Merci de votre confiance !</h3>
                  <p className="text-blue-100">
                    Nous sommes ravis de vous accompagner dans vos voyages au Cameroun. 
                    Bon séjour avec Mboa Hotel ! 🏨✨
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

export default Terms;