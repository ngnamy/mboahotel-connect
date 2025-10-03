import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, Users, Shield, Smartphone, MapPin, Star } from 'lucide-react';

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>À propos - Mboa Hotel</title>
        <meta name="description" content="Découvrez l'histoire et la mission de Mboa Hotel - La plateforme qui révolutionne l'hôtellerie camerounaise" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section moderne */}
        <section className="relative overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <span className="text-4xl">🏨</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                À propos de MboaHotel Connect
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
                La plateforme qui révolutionne l'hôtellerie camerounaise ! 🚀 Découvrez notre histoire et notre mission.
              </p>
            </div>
            {/* Éléments décoratifs */}
            <div className="absolute top-10 left-10 text-white/20 text-6xl">🌟</div>
            <div className="absolute bottom-10 right-10 text-white/20 text-6xl">💫</div>
            <div className="absolute top-1/2 right-1/4 text-white/10 text-8xl">🏨</div>
          </div>
        </section>

        {/* Notre Histoire modernisée */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
                  <span className="text-3xl">📖</span>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  Notre Histoire
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-blue-400">
                  <p className="text-gray-700 leading-relaxed flex items-start">
                    <span className="text-2xl mr-3 mt-1">🔍</span>
                    En observant le marché hôtelier camerounais, nous avons constaté un paradoxe frappant : 
                    d'un côté, des voyageurs qui peinent à trouver des informations fiables sur les hôtels locaux, 
                    de l'autre, des hôteliers passionnés qui luttent pour gagner en visibilité face aux plateformes 
                    internationales. Cette situation nous a interpellés et nous a poussés à agir.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-l-4 border-green-400">
                  <p className="text-gray-700 leading-relaxed flex items-start">
                    <span className="text-2xl mr-3 mt-1">💡</span>
                    C'est ainsi qu'est née l'idée de MboaHotel Connect : créer une solution simple, efficace et 
                    parfaitement adaptée au contexte camerounais. Nous avons décidé de mettre la technologie au 
                    service de problèmes concrets, en construisant un pont entre les voyageurs et les établissements 
                    locaux, tout en donnant aux hôteliers les outils dont ils ont besoin pour prospérer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>    
    {/* Mission et Valeurs modernisées */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Notre Mission et Nos Valeurs
              </h2>
            </div>

            {/* Mission */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-full mb-6">
                  <span className="text-4xl">❤️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Notre Mission</h3>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  Mettre en relation les voyageurs avec les meilleurs hôtels locaux et équiper les hôteliers 
                  d'outils simples et efficaces pour développer leur activité. 🤝
                </p>
              </div>
            </div>

            {/* Valeurs */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Nos Valeurs
                </h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 text-center border border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl mb-2">🛡️</div>
                  <h4 className="text-lg font-bold mb-3 text-blue-800">Transparence</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Nous croyons en la clarté et l'honnêteté dans toutes nos interactions.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl mb-2">🚀</div>
                  <h4 className="text-lg font-bold mb-3 text-green-800">Innovation locale</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Nous développons des solutions conçues spécifiquement pour le contexte camerounais.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 text-center border border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl mb-2">🤝</div>
                  <h4 className="text-lg font-bold mb-3 text-purple-800">Soutien à la communauté</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Nous nous engageons à promouvoir l'économie locale en mettant en avant les établissements camerounais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>       
 {/* Ce qui nous rend uniques modernisé */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Ce qui nous rend uniques
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl mb-2">🇨🇲</div>
                  <h3 className="text-xl font-bold text-blue-800">Expertise locale</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Nous connaissons le Cameroun. Notre plateforme met en avant la richesse de la culture, 
                  des destinations et des établissements locaux.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-4">
                    <Star className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="text-xl font-bold text-green-800">Simplicité et efficacité</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Nous avons conçu notre application pour qu'elle soit facile à utiliser, que vous soyez 
                  un voyageur ou un hôtelier, sans complexités inutiles.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
                    <Smartphone className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-3xl mb-2">💳</div>
                  <h3 className="text-xl font-bold text-purple-800">Paiement adapté</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Notre intégration des moyens de paiement locaux (Mobile Money, Orange Money) rend 
                  la réservation accessible à tous.
                </p>
              </div>
            </div>
          </div>
        </section> 
       {/* L'équipe modernisée */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                L'équipe derrière MboaHotel Connect
              </h2>
              <p className="text-gray-600 mt-4">Une équipe passionnée et dédiée à votre succès ! 👥</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
                    <span className="text-4xl">👨‍💼</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-lg">🚀</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">[Nom du Fondateur]</h3>
                <p className="text-blue-600 font-medium mb-3">CEO & Fondateur</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Passionné par l'innovation technologique et le développement du tourisme camerounais.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
                    <span className="text-4xl">👨‍💻</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                    <span className="text-lg">⚡</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">[Nom du CTO]</h3>
                <p className="text-green-600 font-medium mb-3">Directeur Technique</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Expert en développement web et mobile, spécialisé dans les solutions scalables.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
                    <span className="text-4xl">👩‍💼</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                    <span className="text-lg">🤝</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">[Nom du Responsable Partenariats]</h3>
                <p className="text-purple-600 font-medium mb-3">Responsable Partenariats</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Spécialiste des relations hôtelières et du développement commercial au Cameroun.
                </p>
              </div>
            </div>
          </div>
        </section>        
{/* Rejoignez-nous modernisé */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Rejoignez-nous dans cette aventure
              </h2>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed max-w-2xl mx-auto">
                Que vous soyez voyageur ou hôtelier, nous avons une place pour vous dans l'écosystème MboaHotel Connect ! ✨
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/search"
                  className="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <span className="mr-2">🔍</span>
                  Trouver mon hôtel
                </Link>
                <Link
                  to="/register?role=hotelier"
                  className="inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 border-2 border-blue-400 shadow-lg"
                >
                  <span className="mr-2">🏨</span>
                  Inscrire mon établissement
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Message de fin sympathique */}
        <div className="text-center py-12">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Ensemble, révolutionnons l'hôtellerie camerounaise !
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Merci de faire partie de cette belle aventure. Votre confiance nous motive chaque jour à améliorer nos services. 
                Bienvenue chez MboaHotel Connect ! 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;