# 🏨 MboaHotel Connect

> **La première plateforme camerounaise de réservation d'hôtels en ligne**

[![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

## 🌟 **À Propos**

MboaHotel Connect est une application web moderne de réservation d'hôtels spécialement conçue pour le marché camerounais. Elle offre une expérience utilisateur exceptionnelle avec des fonctionnalités avancées de géolocalisation, un système de témoignages clients, et une interface entièrement responsive.

**Créé par :** [Ngnamy Fotie Raumuald](https://github.com/ngnamy-fotie) - Webmaster & Développeur Full-Stack

## ✨ **Fonctionnalités Principales**

### 🎯 **Pour les Utilisateurs**
- 🔍 **Recherche Avancée** - Filtres par ville, prix, équipements, note
- 📍 **Géolocalisation Intelligente** - Trouvez les hôtels les plus proches
- ⭐ **Système de Notation** - Notes et avis clients authentiques
- 💬 **Témoignages Clients** - Partagez votre expérience avec photos
- 📱 **Design Responsive** - Parfait sur mobile, tablette et desktop
- 🌍 **Interface Multilingue** - Français (avec support pour d'autres langues)

### 🏨 **Catalogue d'Hôtels**
- 🏢 **Hôtels Premium** - Sélection des meilleurs établissements
- 📸 **Galeries Photos** - Images haute qualité des chambres et services
- 🛎️ **Équipements Détaillés** - Wi-Fi, piscine, restaurant, parking, etc.
- 💰 **Prix Transparents** - Aucun frais caché
- 📍 **Localisation Précise** - Cartes interactives et directions

### 🔧 **Technologies Avancées**
- ⚡ **Performance Optimisée** - Chargement ultra-rapide
- 🔒 **Sécurité Renforcée** - Protection des données utilisateurs
- 🎨 **Design Moderne** - Interface élégante avec effets glassmorphism
- 📊 **Analytics Intégrés** - Suivi des performances et comportements

## 🚀 **Démo en Ligne**

Le site sera accessible via le domaine Netlify choisi après le premier déploiement.

## 🛠️ **Technologies Utilisées**

### Frontend
- **React 18.2** - Bibliothèque UI moderne
- **TypeScript** - Typage statique pour plus de robustesse
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **React Router** - Navigation côté client
- **Lucide React** - Icônes modernes et élégantes

### Fonctionnalités Avancées
- **Géolocalisation API** - Localisation précise des utilisateurs
- **Responsive Design** - Adaptatif à tous les écrans
- **PWA Ready** - Installable comme application mobile
- **SEO Optimisé** - Référencement naturel optimisé

## 📦 **Installation Locale**

```bash
# Cloner le repository
git clone https://github.com/ngnamy/mboahotel-connect.git

# Aller dans le dossier de l’application
cd mboahotel-clean

# Installer les dépendances verrouillées
npm ci

# Lancer en mode développement
npm run dev

# Builder pour la production
npm run build
```

## 🌍 **Déploiement sur Netlify**

La configuration `netlify.toml` à la racine du dépôt définit le dossier de l’application (`mboahotel-clean`), la commande de build et le dossier publié. Le fichier `public/_redirects` prend en charge les routes React Router. Aucun serveur API n’est déployé par cette configuration.

### Associer le dépôt GitHub
1. Connectez-vous à [Netlify](https://app.netlify.com/) et choisissez **Add new site** → **Import an existing project**.
2. Connectez GitHub, autorisez l’accès au dépôt `ngnamy/mboahotel-connect`, puis sélectionnez ce dépôt et la branche `main`.
3. Vérifiez les paramètres détectés depuis `netlify.toml` : base `mboahotel-clean`, commande `npm run build`, publication `dist`.
4. Lancez le déploiement. Les prochains commits poussés sur `main` déclencheront automatiquement un nouveau build.
5. Après le premier déploiement, choisissez un domaine Netlify ou associez votre propre domaine dans **Domain management** et activez HTTPS.

### Déploiement local
```bash
cd mboahotel-clean
npm ci
npm run build
```
Publiez le contenu de `mboahotel-clean/dist` ou utilisez la liaison Netlify à GitHub pour le déploiement continu.

## 📱 **Captures d'Écran**

### 🏠 Page d'Accueil
- Interface moderne avec hero section
- Barre de recherche intelligente
- Témoignages clients en carrousel

### 🔍 Recherche et Filtres
- Filtres avancés par critères multiples
- Géolocalisation avec tri par distance
- Résultats en temps réel

### 🏨 Détails d'Hôtel
- Galerie photos immersive
- Informations complètes et équipements
- Système de réservation intégré

### 💬 Témoignages
- Interface de création avec upload photo
- Modération et gestion des avis
- Affichage élégant avec notes

## 🎯 **Villes Couvertes**

- 🏙️ **Yaoundé** - Capitale politique
- 🌊 **Douala** - Capitale économique  
- 🏔️ **Bafoussam** - Région de l'Ouest
- 🌿 **Bamenda** - Nord-Ouest
- 🦁 **Garoua** - Nord
- 🏜️ **Maroua** - Extrême-Nord
- 🚂 **Ngaoundéré** - Adamaoua
- 🏖️ **Kribi** - Littoral Sud

## 👨‍💻 **Créateur**

**Ngnamy Fotie Raumuald**
- 🌐 Webmaster de profession
- 💻 Développeur Full-Stack
- 🎨 Designer UI/UX
- 📍 Basé au Cameroun

### Compétences Techniques
- **Frontend :** React, TypeScript, Tailwind CSS, Next.js
- **Backend :** Node.js, Express, MongoDB, PostgreSQL
- **Mobile :** React Native, Flutter
- **Cloud :** Vercel, Netlify, AWS, Firebase
- **Design :** Figma, Adobe Creative Suite

## 🤝 **Contribuer**

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 **Licence**

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 **Contact**

**Ngnamy Fotie Raumuald**
- 📧 Email : [ngnamy.fotie@email.com](mailto:ngnamy.fotie@email.com)
- 💼 LinkedIn : [linkedin.com/in/ngnamy-fotie](https://linkedin.com/in/ngnamy-fotie)
- 🐙 GitHub : [github.com/ngnamy-fotie](https://github.com/ngnamy-fotie)

## 🙏 **Remerciements**

- Merci à tous les hôteliers camerounais qui font confiance à cette plateforme
- Merci à la communauté open-source pour les outils fantastiques
- Merci aux utilisateurs pour leurs retours constructifs

---

<div align="center">

**⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile ! ⭐**

*Fait avec ❤️ au Cameroun 🇨🇲*

</div>