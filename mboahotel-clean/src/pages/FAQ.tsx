import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  emoji: string;
}

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "Comment puis-je créer un compte sur MboaHotel Connect ?",
      answer: "Pour créer un compte, cliquez sur 'S'inscrire' en haut de la page. Remplissez le formulaire avec vos informations personnelles et confirmez votre adresse e-mail. Vous pourrez ensuite accéder à toutes les fonctionnalités de la plateforme.",
      category: "compte",
      emoji: "👤"
    },
    {
      id: 2,
      question: "Comment effectuer une réservation ?",
      answer: "Utilisez notre moteur de recherche en saisissant votre destination, vos dates et le nombre de personnes. Parcourez les résultats, sélectionnez l'hôtel qui vous convient, choisissez votre chambre et suivez les étapes de réservation. Vous recevrez une confirmation par e-mail.",
      category: "reservation",
      emoji: "🏨"
    },
    {
      id: 3,
      question: "Puis-je modifier ou annuler ma réservation ?",
      answer: "Oui, vous pouvez modifier ou annuler votre réservation depuis votre espace personnel dans la section 'Mes réservations'. Les conditions d'annulation dépendent de l'hôtel et du tarif choisi. Vérifiez les conditions avant de réserver.",
      category: "reservation",
      emoji: "🔄"
    },
    {
      id: 4,
      question: "Quels sont les moyens de paiement acceptés ?",
      answer: "Nous acceptons les cartes bancaires (Visa, Mastercard), Mobile Money (MTN, Orange), et les virements bancaires. Tous les paiements sont sécurisés et cryptés pour votre protection.",
      category: "paiement",
      emoji: "💳"
    },
    {
      id: 5,
      question: "Comment devenir partenaire hôtelier ?",
      answer: "Pour rejoindre notre réseau de partenaires, cliquez sur 'Inscrire mon établissement' ou contactez-nous directement. Notre équipe vous accompagnera dans le processus d'inscription et la mise en ligne de votre établissement.",
      category: "partenaire",
      emoji: "🤝"
    },
    {
      id: 6,
      question: "Les prix affichés incluent-ils les taxes ?",
      answer: "Oui, tous les prix affichés sur MboaHotel Connect incluent les taxes locales. Le prix final que vous voyez est celui que vous paierez, sans frais cachés.",
      category: "paiement",
      emoji: "💰"
    },
    {
      id: 7,
      question: "Comment contacter le service client ?",
      answer: "Vous pouvez nous contacter par téléphone au +237 XXX XXX XXX (Lun-Ven 8h-18h), par e-mail à contact@mboahotelconnect.com, ou via le formulaire de contact sur notre site.",
      category: "support",
      emoji: "📞"
    },
    {
      id: 8,
      question: "Que faire si j'ai un problème avec mon hôtel ?",
      answer: "En cas de problème, contactez d'abord directement l'hôtel. Si le problème persiste, notre service client est là pour vous aider à trouver une solution. Nous nous engageons à résoudre tous les différends de manière équitable.",
      category: "support",
      emoji: "🆘"
    },
    {
      id: 9,
      question: "Comment laisser un avis sur un hôtel ?",
      answer: "Après votre séjour, vous recevrez un e-mail vous invitant à laisser un avis. Vous pouvez également le faire depuis votre espace personnel dans la section 'Mes réservations'. Vos avis aident les autres voyageurs à faire leur choix.",
      category: "avis",
      emoji: "⭐"
    },
    {
      id: 10,
      question: "MboaHotel Connect est-il disponible sur mobile ?",
      answer: "Notre site web est entièrement optimisé pour les appareils mobiles. Une application mobile native est en cours de développement et sera bientôt disponible sur les stores Android et iOS.",
      category: "technique",
      emoji: "📱"
    }
  ];

  const categories = [
    { value: 'all', label: 'Toutes les catégories', emoji: '📚' },
    { value: 'compte', label: 'Compte utilisateur', emoji: '👤' },
    { value: 'reservation', label: 'Réservations', emoji: '🏨' },
    { value: 'paiement', label: 'Paiements', emoji: '💳' },
    { value: 'partenaire', label: 'Partenaires hôteliers', emoji: '🤝' },
    { value: 'support', label: 'Support', emoji: '📞' },
    { value: 'avis', label: 'Avis et commentaires', emoji: '⭐' },
    { value: 'technique', label: 'Questions techniques', emoji: '🔧' }
  ]; 
 const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>FAQ - Questions Fréquentes - Mboa Hotel</title>
        <meta name="description" content="Trouvez rapidement les réponses à vos questions sur MboaHotel Connect - Support, réservations, paiements" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section moderne */}
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
            <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <span className="text-4xl">❓</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Questions Fréquentes
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
                Trouvez rapidement les réponses à vos questions ! 🔍 Notre équipe a rassemblé les informations les plus utiles.
              </p>
            </div>
            {/* Éléments décoratifs */}
            <div className="absolute top-10 left-10 text-white/20 text-6xl">💡</div>
            <div className="absolute bottom-10 right-10 text-white/20 text-6xl">🎯</div>
            <div className="absolute top-1/2 right-1/4 text-white/10 text-8xl">❓</div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Barre de recherche et filtres modernisée */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 md:p-8 mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-3">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Rechercher dans nos FAQ
              </h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <span className="text-xl mr-2">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Rechercher dans les questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm min-w-[200px]"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.emoji} {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>        
  {/* Liste des FAQ modernisée */}
          <div className="space-y-4">
            {filteredFAQ.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 text-center">
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun résultat trouvé</h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier vos critères de recherche ou contactez notre support.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="mr-2">💬</span>
                  Contactez-nous
                </Link>
              </div>
            ) : (
              filteredFAQ.map((item) => (
                <div key={item.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-5 text-left hover:bg-blue-50/50 focus:outline-none focus:bg-blue-50/50 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-2xl">{item.emoji}</div>
                        <h3 className="text-lg font-bold text-gray-900 pr-4">
                          {item.question}
                        </h3>
                      </div>
                      <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center transition-all duration-300 ${
                        openItems.includes(item.id) ? 'rotate-180 bg-gradient-to-r from-blue-200 to-indigo-200' : ''
                      }`}>
                        <ChevronDown className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openItems.includes(item.id) 
                        ? 'max-h-96 opacity-100' 
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-400">
                        <p className="text-gray-700 leading-relaxed flex items-start">
                          <span className="text-xl mr-3 mt-1">💡</span>
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Section contact modernisée */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-200 p-8 md:p-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Vous ne trouvez pas la réponse à votre question ?
              </h3>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                Notre équipe de support est là pour vous aider ! 🚀 Contactez-nous et nous vous répondrons rapidement.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Mail className="w-5 h-5 mr-3" />
                  <span className="mr-2">📧</span>
                  Nous contacter
                </Link>
                
                <a
                  href="tel:+237XXXXXXX"
                  className="inline-flex items-center justify-center bg-white hover:bg-blue-50 text-blue-600 px-8 py-4 rounded-xl font-bold border-2 border-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Phone className="w-5 h-5 mr-3" />
                  <span className="mr-2">📞</span>
                  Appeler maintenant
                </a>
              </div>
            </div>
          </div>   
       {/* Statistiques modernisées */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">24h</div>
              <div className="text-gray-600 font-medium">Temps de réponse moyen</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
                <span className="text-3xl">😊</span>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">95%</div>
              <div className="text-gray-600 font-medium">Taux de satisfaction</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
                <span className="text-3xl">🕐</span>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">7j/7</div>
              <div className="text-gray-600 font-medium">Support disponible</div>
            </div>
          </div>

          {/* Message de fin sympathique */}
          <div className="text-center mt-12 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-2">Nous sommes là pour vous !</h3>
              <p className="text-blue-100">
                Votre satisfaction est notre priorité. N'hésitez pas à nous poser toutes vos questions ! 
                L'équipe Mboa Hotel est toujours prête à vous aider. ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;