/**
 * Informations du développeur - MboaHotel Connect
 * 
 * Ce fichier contient les informations du créateur de l'application
 */

export const DEVELOPER_INFO = {
  name: 'Ngnamy Fotie Raumuald',
  profession: 'Webmaster de profession',
  role: 'Développeur Full-Stack',
  email: 'ngnamy.fotie@example.com',
  linkedin: '#', // À remplacer par votre vrai lien LinkedIn
  github: '#', // À remplacer par votre vrai lien GitHub
  portfolio: '#', // À remplacer par votre site web
  
  // Informations sur le projet
  project: {
    name: 'MboaHotel Connect',
    description: 'Première plateforme camerounaise de réservation d\'hôtels en ligne',
    version: '1.0.0',
    year: 2025,
    technologies: [
      'React 18',
      'TypeScript',
      'Tailwind CSS',
      'React Router',
      'React Query',
      'Vite',
      'Node.js',
      'MongoDB'
    ],
    features: [
      'Recherche et filtrage d\'hôtels',
      'Système de réservation complet',
      'Paiement Mobile Money intégré',
      'Interface responsive',
      'Authentification sécurisée',
      'Dashboard hôteliers'
    ]
  },
  
  // Contact et support
  contact: {
    email: 'contact@mboahotelconnect.com',
    phone: '+237 6XX XX XX XX',
    address: 'Yaoundé, Cameroun',
    support: 'ngnamy.fotie@example.com'
  },
  
  // Réseaux sociaux
  social: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#'
  }
} as const;

// Fonction utilitaire pour obtenir les informations du développeur
export const getDeveloperInfo = () => DEVELOPER_INFO;

// Fonction pour générer la signature du développeur
export const getDeveloperSignature = () => {
  return `Créé avec ❤️ par ${DEVELOPER_INFO.name} - ${DEVELOPER_INFO.profession}`;
};

// Fonction pour générer les métadonnées SEO
export const getDeveloperSEO = () => {
  return {
    author: `${DEVELOPER_INFO.name} - ${DEVELOPER_INFO.profession}`,
    creator: DEVELOPER_INFO.name,
    developer: `${DEVELOPER_INFO.name} - ${DEVELOPER_INFO.role}`,
    keywords: [
      'Ngnamy Fotie Raumuald',
      'webmaster',
      'développeur full-stack',
      'Cameroun',
      'hôtel',
      'réservation',
      'React',
      'TypeScript'
    ].join(', ')
  };
};