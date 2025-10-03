import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Send,
  MessageCircle,
  HelpCircle,
  Facebook,
  Linkedin,
  Instagram,
  Twitter
} from 'lucide-react';

// --- Définitions des types ---
interface FormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

type SubmitStatus = 'idle' | 'success' | 'error';

// --- Composant principal de la page Contact ---
const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // --- Simulation d'un appel API ---
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Formulaire soumis avec succès:', formData);
      setSubmitStatus('success');
      setFormData({ fullName: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact - Mboa Hotel</title>
        <meta name="description" content="Contactez l'équipe Mboa Hotel - Support client, questions et assistance pour vos réservations" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Section Hero moderne */}
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
            <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <span className="text-4xl">💬</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Contactez-nous
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
                Une question, une suggestion ou besoin d'assistance ? 🤝 Notre équipe est là pour vous aider !
              </p>
            </div>
            {/* Éléments décoratifs */}
            <div className="absolute top-10 left-10 text-white/20 text-6xl">✨</div>
            <div className="absolute bottom-10 right-10 text-white/20 text-6xl">💫</div>
            <div className="absolute top-1/2 left-1/4 text-white/10 text-8xl">🌟</div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Colonne de gauche : Formulaire */}
            <div className="lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 md:p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    Envoyez-nous un message
                  </h2>
                  <p className="text-gray-600">Nous vous répondrons dans les plus brefs délais ! 📧</p>
                </div>

                <ContactForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  submitStatus={submitStatus}
                />
              </div>
            </div>

            {/* Colonne de droite : Informations */}
            <div className="lg:col-span-2 space-y-8">
              <ContactInfo />
              <ContactFAQ />
              <SocialFollow />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// --- Sous-composants modernisés ---

/**
 * Composant pour le formulaire de contact modernisé
 */
const ContactForm: React.FC<{
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  submitStatus: SubmitStatus;
}> = ({ formData, handleInputChange, handleSubmit, isSubmitting, submitStatus }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === 'success' && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-green-800">Message envoyé avec succès ! 🎉</h3>
              <p className="text-green-700">Merci, nous vous répondrons dans les plus brefs délais.</p>
            </div>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">❌</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-red-800">Erreur d'envoi 😔</h3>
              <p className="text-red-700">Une erreur est survenue. Veuillez réessayer plus tard.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <span className="mr-2">👤</span>
            Nom complet *
          </label>
          <input
            type="text" id="fullName" name="fullName"
            value={formData.fullName} onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            placeholder="Votre nom et prénom"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <span className="mr-2">📧</span>
            Adresse e-mail *
          </label>
          <input
            type="email" id="email" name="email"
            value={formData.email} onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            placeholder="votre.email@exemple.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <span className="mr-2">📋</span>
          Sujet *
        </label>
        <select
          id="subject" name="subject"
          value={formData.subject} onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
        >
          <option value="">Sélectionnez un sujet</option>
          <option value="reservation">🏨 Problème avec une réservation</option>
          <option value="partnership">🤝 Demande de partenariat</option>
          <option value="general">💬 Question générale</option>
          <option value="technical">🔧 Problème technique</option>
          <option value="feedback">💡 Suggestion ou commentaire</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <span className="mr-2">✍️</span>
          Votre message *
        </label>
        <textarea
          id="message" name="message"
          value={formData.message} onChange={handleInputChange}
          required rows={5}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
          placeholder="Décrivez votre demande en détail..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
      >
        <div className="flex items-center justify-center space-x-3">
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>Envoi en cours... ⏳</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Envoyer le message 🚀</span>
            </>
          )}
        </div>
      </button>
    </form>
  );
};/**

 * Composant pour les informations de contact modernisé
 */
const ContactInfo: React.FC = () => {
  const contactMethods = [
    {
      icon: '📞',
      title: 'Téléphone',
      content: '+237 655 498 183',
      subtitle: 'Lun-Ven: 8h-18h',
      gradient: 'from-green-50 to-emerald-50',
      border: 'border-green-200'
    },
    {
      icon: '📧',
      title: 'E-mail',
      content: 'contact@mboahotelconnect.com',
      subtitle: 'Réponse sous 24h',
      gradient: 'from-blue-50 to-indigo-50',
      border: 'border-blue-200'
    },
    {
      icon: '📍',
      title: 'Adresse',
      content: 'Rue XYZ, Quartier ABC',
      subtitle: 'Douala, Cameroun',
      gradient: 'from-purple-50 to-pink-50',
      border: 'border-purple-200'
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-3">
          <span className="text-2xl">📱</span>
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Autres moyens de nous joindre
        </h3>
      </div>

      <div className="space-y-4">
        {contactMethods.map((method, index) => (
          <div key={index} className={`bg-gradient-to-r ${method.gradient} border ${method.border} rounded-2xl p-4`}>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{method.icon}</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-lg">{method.title}</h4>
                <p className="text-gray-700 font-medium">{method.content}</p>
                <p className="text-sm text-gray-600 mt-1">{method.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Composant pour la section FAQ modernisée
 */
const ContactFAQ: React.FC = () => {
  const faqItems = [
    {
      question: "Comment puis-je modifier ma réservation ?",
      answer: "Connectez-vous à votre compte et accédez à la section 'Mes réservations'.",
      icon: "🔄"
    },
    {
      question: "Quels sont les moyens de paiement acceptés ?",
      answer: "Nous acceptons les cartes bancaires, Mobile Money et les virements.",
      icon: "💳"
    },
    {
      question: "Comment annuler ma réservation ?",
      answer: "Les conditions d'annulation dépendent du tarif choisi. Consultez votre confirmation.",
      icon: "❌"
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-3">
          <HelpCircle className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Questions fréquentes
        </h3>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">{item.question}</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          to="/faq"
          className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          <span className="mr-2">📚</span>
          Voir toute la FAQ
          <span className="ml-2">→</span>
        </Link>
      </div>
    </div>
  );
};

/**
 * Composant pour les réseaux sociaux modernisé
 */
const SocialFollow: React.FC = () => {
  const socialLinks = [
    {
      icon: <Facebook />,
      name: 'Facebook',
      url: '#',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
      emoji: '👥'
    },
    {
      icon: <Instagram />,
      name: 'Instagram',
      url: '#',
      gradient: 'from-pink-500 to-rose-500',
      hoverGradient: 'hover:from-pink-600 hover:to-rose-600',
      emoji: '📸'
    },
    {
      icon: <Linkedin />,
      name: 'LinkedIn',
      url: '#',
      gradient: 'from-blue-600 to-blue-700',
      hoverGradient: 'hover:from-blue-700 hover:to-blue-800',
      emoji: '💼'
    },
    {
      icon: <Twitter />,
      name: 'Twitter',
      url: '#',
      gradient: 'from-sky-400 to-sky-500',
      hoverGradient: 'hover:from-sky-500 hover:to-sky-600',
      emoji: '🐦'
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-3">
          <span className="text-2xl">🌟</span>
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Suivez-nous
        </h3>
        <p className="text-gray-600 text-sm">Restez connectés pour nos dernières actualités ! 📱</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            className={`bg-gradient-to-r ${social.gradient} ${social.hoverGradient} text-white p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg group`}
            title={social.name}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{social.emoji}</span>
                {React.cloneElement(social.icon, { className: 'w-5 h-5' })}
              </div>
              <span className="text-sm font-medium">{social.name}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Message d'encouragement */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 text-center">
        <p className="text-purple-800 font-medium flex items-center justify-center">
          <span className="mr-2">💬</span>
          Rejoignez notre communauté !
          <span className="ml-2">✨</span>
        </p>
      </div>
    </div>
  );
};

export default Contact;