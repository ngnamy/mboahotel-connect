# Audit fonctionnel et plan de mise en service

## Verdict

**État actuel : prototype de démonstration, pas une plateforme de réservation prête pour des clients.** L’interface React/Vite contient de nombreux écrans, mais les comptes, les réservations, les paiements, les avis et le contact reposent encore sur des données statiques, du stockage temporaire ou des délais simulés. Aucun serveur applicatif ni base de données n’est présent dans ce dépôt.

Le blocage le plus important est métier et technique : l’application peut présenter une réservation comme payée et confirmée sans vérifier de disponibilité, créer de réservation persistante ou effectuer de paiement. Il ne faut donc pas ouvrir le parcours de réservation au public avant le raccordement du serveur et du prestataire de paiement.

## Avancement de la refonte frontend

**Étape 1 — identité visuelle et accueil : réalisée le 8 octobre 2026.** Une direction hôtelière premium, épurée, avec une palette forêt/sable et une touche terracotta est appliquée au socle CSS, à l’en-tête, au pied de page, à l’accueil et au formulaire de recherche. Les liens de navigation sont plus accessibles sur mobile, le panier a des libellés accessibles, les dates de recherche sont contrôlées et une page 404 est ajoutée. La configuration Tailwind/PostCSS manquante est ajoutée pour que les classes soient générées.

**À valider avant de considérer cette étape terminée :** dépendances non installées dans l’environnement ; build, lint, tests et contrôle visuel navigateur à exécuter dès que l’installation est reproductible. Le catalogue et ses tarifs restent des données d’aperçu, clairement signalées comme à confirmer.

**Étapes suivantes :** harmoniser la recherche et les cartes de résultats avec cette identité, refondre les détails hôtel et les écrans panier/checkout sans afficher de faux succès, puis reprendre connexion/inscription, espace client/hôtelier, avis et pages de contenu. Les problèmes fonctionnels et les critères de lancement restent suivis dans les sections ci-dessous.

## Périmètre et vérifications

Audit du contenu présent dans `src/` (pages, composants, contextes, hooks, types, utilitaires), de `index.html`, `package.json`, `vite.config.ts`, `public/`, des deux README et de la configuration de redirection Netlify. Les observations ci-dessous sont fondées sur le code du dépôt, pas sur un environnement de production ou un compte de prestataire.

Vérifications exécutées depuis `mboahotel-clean/` : `npm run build`, `npm test -- --run` et `npm run lint` n’ont pas pu démarrer, car les exécutables `vite`, `vitest` et `eslint` ne sont pas installés (`node_modules/` absent). Aucun fichier de test applicatif ni fichier de verrouillage n’a été trouvé. Le diagnostic de l’éditeur n’a remonté aucune erreur, mais il ne remplace pas l’installation reproductible des dépendances, le build ni un contrôle TypeScript. `git status` montre le présent plan comme fichier non suivi ; il a été conservé et enrichi.

## Constats vérifiés

### Bloqueurs de mise en service

- **Réservations et paiement simulés.** `src/pages/Checkout.tsx` attend trois secondes, vide le panier et affiche une confirmation sans appel à un fournisseur de paiement ni au serveur. Le moyen de paiement sélectionné n’est pas utilisé. `src/pages/BookingConfirmation.tsx` simule aussi la confirmation et annonce l’envoi d’un e-mail qui n’a pas lieu. Les identifiants sont générés dans le navigateur et ne correspondent pas à une réservation durable.
- **Aucune disponibilité garantie.** Les quantités disponibles et les prix sont codés en dur dans `src/pages/HotelDetails.tsx`. Ils ne sont ni recalculés côté serveur ni bloqués atomiquement au moment de la réservation. Deux clients pourraient réserver la même chambre.
- **Aucun backend livré.** `vite.config.ts` ne fait que proxyfier `/api` vers `localhost:5000` en développement. Aucun service API, schéma de base de données, migration, webhook de paiement ou traitement de tâches e-mail/SMS n’apparaît dans l’application. `public/_redirects` vise en outre `api.mboahotel.com`, domaine à confirmer, et non le proxy local.
- **Comptes non opérationnels et incohérents.** `src/pages/Login.tsx` n’accepte qu’un compte de démonstration et écrit sous la clé `user`. `src/contexts/AuthContext.tsx` appelle `/api/auth/login` et `/api/auth/register` et lit d’autres clés. `src/pages/Register.tsx` ne crée aucun compte (TODO) et affiche une alerte. Le lien hôtelier ajoute `?role=hotelier`, mais le formulaire n’exploite pas ce rôle.
- **Espace client incomplet.** `src/pages/Reservations.tsx` et `src/pages/Dashboard.tsx` sont des écrans « en cours de développement ». Il n’y a pas de suivi, modification ou annulation effective des réservations ni de gestion d’établissement pour les hôteliers.

### Bugs de navigation et de typage à traiter

- `src/App.tsx` ne déclare pas les routes `/favorites`, `/forgot-password`, `/testimonials` et `/testimonial-admin`, alors que l’interface comporte des liens/pages correspondants. Aucune route de secours 404 n’est prévue. Les pages de démonstration ne sont pas non plus raccordées à une navigation produit. Les routes `/dashboard` et `/reservations` sont déclarées sans garde d’authentification dans le routeur ; ajouter des contrôles d’accès côté interface pour l’expérience et impérativement côté API pour la sécurité.
- `src/components/FavoriteButton.tsx` attend `isFavorite`, `addFavorite` et `removeFavorite`, absents de `AuthContextType`. `src/pages/Favorites.tsx` attend `user.favorites`, absent du type `User`, et importe `mockHotels` depuis `Search.tsx`, où cette constante n’est pas exportée. Ajouter un contrôle TypeScript et résoudre ces erreurs avant livraison.
- La recherche propose des identifiants d’hôtel dupliqués (par exemple `4`, `5`, `6`, `7`) ; les détails ne contiennent que les hôtels `1` et `2`. Les cartes des autres résultats ouvrent donc une page « hôtel non trouvé », et les identifiants répétés peuvent aussi provoquer des clés React non uniques.
- Le catalogue de `Home.tsx`, celui de `Search.tsx` et les détails d’hôtel ont des noms, notes et prix différents pour des établissements qui semblent identiques. Une source unique de vérité est nécessaire.
- Dans `src/pages/Search.tsx`, les cases de politiques sont mémorisées et affichées, mais ne filtrent aucun résultat. Dates et nombre de voyageurs ne sont pas appliqués aux disponibilités. Le bouton de recherche modifie l’historique avec `window.history.pushState` au lieu de synchroniser la navigation React Router.
- `src/pages/Home.tsx` construit une réservation de démonstration avec un prix fixe et vérifie la clé `token`, qui n’est pas celle utilisée par `AuthContext`. Son parcours ne doit pas être considéré comme fonctionnel.
- Le panier de `src/contexts/CartContext.tsx` est en mémoire seulement : actualiser ou quitter la page le vide. Des ajouts du même hôtel et de la même chambre à des dates différentes sont fusionnés. La quantité n’est pas plafonnée à l’inventaire. Les calculs de nuits utilisent une différence absolue, ce qui accepte des dates inversées et peut accepter une durée nulle.

### Fonctions d’interface encore en démonstration

- `src/hooks/useBooking.ts` attend une seconde puis renvoie les données reçues, sans requête serveur.
- `src/hooks/useTestimonials.ts`, `src/pages/Testimonials.tsx` et `src/pages/TestimonialAdmin.tsx` manipulent des données locales. Le chargement du hook ne remplit pas la liste. Les avis, likes, approbations et suppressions disparaissent au rechargement. La page d’administration n’a ni route déclarée ni contrôle de rôle.
- `src/pages/Contact.tsx` affiche le succès après un délai et écrit uniquement en console ; aucun message n’est transmis à l’équipe.
- `src/pages/HotelDetails.tsx` ajoute les avis localement et présente un nom d’auteur fictif. Les actions « utile » et « voir tous les avis » ne sont pas reliées à un comportement persistant.
- La géolocalisation est intégrée au navigateur et le géocodage inverse appelle directement Nominatim. Il faut valider les règles d’usage, la limitation de débit, les erreurs réseau et l’information/consentement avant un usage commercial.

### Configuration, contenu et qualité

- Les dépendances ne sont pas installées ici. `package.json` référence `@mboa-hotel/shared`, mais aucun paquet partagé ou workspace correspondant n’est présent dans l’arborescence examinée. Aucun fichier de verrouillage, configuration TypeScript, configuration PostCSS/Tailwind, exemple d’environnement, pipeline CI ou fichier de configuration de déploiement n’a été trouvé. Vérifier la résolution de cette dépendance et la génération effective du CSS Tailwind.
- Le README annonce notamment PWA, analytics, sécurité renforcée et paiements locaux, mais aucun manifeste/service worker, système analytics, authentification fonctionnelle ou paiement réel n’a été identifié. Corriger ces affirmations ou livrer les capacités correspondantes.
- Le README du frontend ne correspond pas à l’arborescence : il demande `cd client` et configure Vercel avec un répertoire racine `client`, alors que ce dossier n’existe pas (`mboahotel-clean/` contient l’application). Le README à la racine du dépôt ne contient que le titre. Refaire les instructions d’installation, tests et déploiement à partir d’un clone neuf, et vérifier le domaine réel.
- Le visuel principal de `src/pages/Home.tsx` référence `../../public/images/baniere/3192.jpg`. Les fichiers placés dans `public/` doivent être servis avec une URL publique telle que `/images/baniere/3192.jpg` ; vérifier cette image dans le navigateur en dev et après build.
- Les listes d’hôtels, tarifs, notes, avis et témoignages sont des données de démonstration, parfois associées à des images distantes génériques. Les remplacer par des établissements réels vérifiés, leurs propres tarifs, politiques, photos autorisées et disponibilités ; sinon les identifier clairement comme démo.
- `src/pages/Privacy.tsx` et `src/pages/Terms.tsx` déclarent des traitements, protections, paiements ou droits qui ne sont pas établis par le code. Faire vérifier ces textes par un conseil compétent pour les marchés visés et les aligner sur les pratiques réelles. Les coordonnées et domaines utilisés entre footer, FAQ, politiques, HTML et README ne sont pas uniformes et doivent être confirmés.
- Les redirections/hôtes ne sont pas cohérents : le README préconise Vercel, `public/_redirects` est un mécanisme Netlify, et le proxy `/api` est uniquement local. Configurer les règles SPA, API, variables et en-têtes de sécurité pour la plateforme réellement choisie ; ne pas supposer que les en-têtes placés dans `_redirects` sont appliqués.
- Plusieurs interactions reposent sur `alert`, `confirm` ou des icônes cliquables sans équivalent clavier/nom accessible. Réaliser des tests clavier, lecteur d’écran, contrastes, erreurs de formulaires et petits écrans. Ajouter une vraie page 404 et des états de chargement/erreur cohérents.

### Revue approfondie de l’interface frontend

**Périmètre de cette revue :** lecture statique des pages, composants et CSS. Le frontend n’a pas pu être lancé dans un navigateur, car ses dépendances ne sont pas installées ; les tailles d’écran, rendus réels, contrastes et performances restent donc à valider visuellement en recette.

- **Promesses visibles non étayées :** l’accueil promet paiement Mobile Money sécurisé, hôtels vérifiés et assistance 24/7, tandis que les pages de connexion, contact et réservation simulent leurs actions. Tant que les services réels ne sont pas opérationnels, remplacer ces affirmations par des informations exactes ou les retirer.
- **Parcours de découverte déconnecté :** les hôtels mis en avant dans `src/pages/Home.tsx` ne sont pas tous disponibles en détail ; les données et identifiants divergent de `src/pages/Search.tsx` et `src/pages/HotelDetails.tsx`. Les notes mélangent des échelles sur 5 et sur 10, et les montants sont formatés tantôt en XAF, tantôt en FCFA. Créer un catalogue partagé, unique, vérifié et typé, avec une convention unique pour note, devise, prix par nuit et taxes.
- **Formulaire de recherche trompeur :** les dates et le nombre de voyageurs sont visibles, mais n’influencent pas les disponibilités ; les filtres de politique sont sélectionnables sans effet sur la liste. Le bouton emploie `window.history.pushState` au lieu du routeur, ce qui désynchronise l’URL et l’état de navigation. Relier filtres, dates et capacité aux données/API, valider les périodes, synchroniser l’URL avec React Router et conserver la recherche au retour arrière.
- **Réservation depuis l’accueil incohérente :** le gestionnaire de clic consulte une clé `token` différente de celle du contexte d’authentification (`mboa-hotel-token`) et fabrique un tarif/dates par défaut ; il ne doit pas contourner le parcours de recherche, disponibilité et prix serveur.
- **Actions visuellement interactives mais incomplètes :** l’inscription affiche une alerte sans créer de compte ; les liens mot de passe oublié, favoris et témoignages ne disposent pas tous d’une route déclarée ; les actions télécharger/partager de la confirmation ne font rien. Chaque contrôle doit avoir une destination/action réelle, sinon être retiré ou présenté clairement comme indisponible.
- **Accessibilité des contrôles :** vérifier les noms accessibles du menu mobile, du panier, des boutons de carrousel et des liens sociaux qui ne contiennent qu’une icône. Les étoiles de `ReviewForm` sont des éléments graphiques cliquables à la souris, sans commande clavier ni état annoncé ; les boutons d’affichage du mot de passe et de suppression d’articles doivent aussi être nommés. Ajouter focus visible, état `aria-expanded`/`aria-live` pertinent, libellés et erreurs reliés aux champs, puis tester clavier et lecteur d’écran.
- **Cohérence visuelle et responsive à formaliser :** l’interface assemble des classes Tailwind propres à chaque écran et des styles réutilisables partiels (`btn-*`, `card`, `input`), avec des variantes de mise en page et de tonalité. Définir des composants/tokens communs (couleurs, typographie, espacements, boutons, formulaires, cartes, messages et modales) ; valider à minima téléphone étroit, téléphone courant, tablette et desktop, y compris menu, filtres, panier, galerie et formulaires.
- **Images et contenu :** l’accueil référence une image locale avec un chemin `../../public/...` au lieu d’une URL publique `/images/...` ; les cartes chargent aussi des photos distantes de démonstration. Vérifier le chargement après build, les droits et l’adéquation des photos aux hôtels ; prévoir ratio/cadrage, alternative textuelle utile, image de repli, optimisation et chargement différé lorsque pertinent. Le CSS applique `image-rendering: crisp-edges` globalement : contrôler et retirer cet effet des photographies s’il en dégrade le rendu.
- **États et retours utilisateur :** standardiser états de chargement, succès, erreur, vide et indisponibilité sur tous les parcours ; remplacer `alert()`/`console.log()` par des messages intégrés accessibles, sans annoncer de réussite avant une réponse serveur réelle. Donner un retour explicite à chaque action et éviter les boutons dont l’état n’est pas perceptible.
- **SEO et identité de marque :** vérifier le domaine et les coordonnées affichés dans `index.html`, le footer, la FAQ et les pages légales ; les balises sociales ont une URL déclarative à confirmer et pas d’image de partage. Ajouter une page 404, des métadonnées cohérentes par page, des liens canoniques adaptés au domaine final et des aperçus sociaux réels ; ne pas indexer des pages de compte, résultats temporaires ou confirmations personnelles.

**Critères de recette frontend :** chaque lien et bouton du parcours client fonctionne ; recherches et filtres reflètent réellement les critères ; aucune donnée fictive ou fausse confirmation n’est présentée comme réelle ; les parcours sont utilisables au clavier et sur petits écrans ; erreurs, chargements et champs sont compréhensibles ; photos, devise, notes et textes sont cohérents ; build et contrôle d’accessibilité sont exécutés avec les dépendances installées.

## Plan priorisé

### P0 - Décisions et socle bloquant

- [ ] Définir le périmètre de lancement : réservation avec paiement en ligne, paiement à l’hôtel, ou les deux ; confirmer les prestataires disponibles au Cameroun, les règles de remboursement, les frais, les devises et les responsabilités contractuelles.
- [ ] Confirmer les rôles et parcours : client, hôtelier, administrateur ; définir qui valide les établissements, tarifs, contenus et remboursements.
- [ ] Choisir l’architecture serveur et l’hébergement de production. Fournir un contrat API versionné et un modèle de données persistant pour comptes, hôtels, chambres, inventaire, tarifs, réservations, transactions, favoris, avis et demandes de contact.
- [ ] Rendre le projet installable de façon reproductible : décider si `@mboa-hotel/shared` doit être un vrai workspace ou une dépendance publiée ; ajouter et versionner le lockfile ; documenter Node/npm ; configurer TypeScript, PostCSS/Tailwind et les scripts `typecheck`, `test` et `build`.
- [ ] Corriger les erreurs de compilation/types, les imports/exports et les routes cassées. Ajouter une page 404. Toute route privée doit être protégée par authentification **et** autorisation serveur, pas seulement masquée dans l’interface.
- [ ] Retirer le faux succès du checkout tant qu’un paiement/rendez-vous serveur n’est pas confirmé. Un état de démonstration ne doit jamais être présenté comme un paiement ou une réservation réelle.

**Critères de sortie P0 :** installation propre depuis un clone neuf ; contrôle TypeScript sans erreur ; lint et build réussis ; chaque lien de navigation aboutit à une page définie ; aucun parcours ne prétend avoir confirmé une réservation sans preuve serveur.

### P1 - Parcours métier minimum viable

- [ ] Remplacer les tableaux fictifs par un catalogue canonique servi par l’API ; obtenir et vérifier les autorisations des établissements, images, descriptions, tarifs, équipements, coordonnées et conditions.
- [ ] Garantir des identifiants uniques et des pages détail pour chaque hôtel. Synchroniser les données de l’accueil, de la recherche, des favoris et des détails.
- [ ] Implémenter recherche serveur par ville, dates, voyageurs, chambres, prix, note, étoiles, équipements et politiques. Valider les dates et le nombre de voyageurs ; préserver filtres et recherche dans l’URL ; afficher zéro résultat, erreurs et indisponibilités.
- [ ] Implémenter l’inscription, la connexion, la déconnexion, la vérification d’adresse, la récupération de mot de passe et les rôles. Utiliser des sessions/tokens adaptés, gérer expiration et révocation, et protéger les API. Ne pas accepter de rôle privilégié fourni librement par le navigateur.
- [ ] Persister panier et réservations. Recalculer le prix et la disponibilité côté serveur ; valider arrivée < départ et capacité ; éviter la fusion de séjours distincts ; plafonner les chambres ; prévenir les doubles réservations par transaction/verrouillage d’inventaire.
- [ ] Construire un seul parcours de réservation cohérent. Créer une réservation en attente côté serveur, intégrer les moyens de paiement retenus, traiter les webhooks de façon signée et idempotente, puis confirmer uniquement après statut serveur vérifié. Gérer échec, annulation, remboursement, expiration et paiement à l’hôtel si retenu.
- [ ] Produire confirmations réelles et consultables après rechargement : référence persistante, état de paiement, récapitulatif et e-mail/SMS délivré. Remplacer les boutons fictifs de téléchargement/partage par une implémentation réelle ou les retirer.
- [ ] Implémenter les espaces client (réservations, détails, annulation, favoris) et hôtelier (onboarding, vérification, profil, chambres, tarifs, disponibilités, réservations). Définir et protéger l’administration.
- [ ] Raccorder formulaires contact et avis à l’API, avec validation serveur, stockage d’images sécurisé, modération, anti-spam, règles de likes et preuves d’expérience si les avis sont présentés comme vérifiés.

**Critères de sortie P1 :** un client peut effectuer un parcours complet en environnement de test ; prix et inventaire sont validés côté serveur ; les réservations et changements d’état survivent aux rechargements ; un paiement échoué ne produit ni confirmation ni débit affiché comme réussi ; les rôles non autorisés reçoivent un refus côté API.

### P2 - Sécurité, conformité et exploitation

- [ ] Revoir les données personnelles collectées, base légale, consentement, durée de conservation, accès/suppression, cookies, sous-traitants et transfert de données. Réviser les politiques et conditions avec un professionnel connaissant les juridictions réellement visées.
- [ ] Ne jamais stocker de données de carte dans l’application. Utiliser les pages/SDK tokenisés du prestataire. Protéger secrets côté serveur, limiter les tentatives, valider toutes les entrées, limiter les uploads et mettre en place journalisation sans données sensibles.
- [ ] Configurer HTTPS, domaines, CORS, CSP et en-têtes de sécurité sur l’hébergeur final ; séparer développement, test et production ; valider les redirections SPA et API sur cette plateforme.
- [ ] Ajouter observabilité (erreurs frontend/API, disponibilité, paiements, notifications), alertes, sauvegardes et procédures de restauration, support client et traitement des incidents.
- [ ] Remplacer les coordonnées, liens sociaux, domaines et coordonnées d’assistance de démonstration par les canaux réellement surveillés. Vérifier disponibilité, horaires et réponses annoncés dans la FAQ.
- [ ] Vérifier accessibilité WCAG pertinente, navigation clavier, libellés des contrôles, messages d’erreur, responsive, performances, images et métadonnées partage/social. Tester les liens profonds et les retours arrière.
- [ ] Mettre en place CI : installation depuis lockfile, `typecheck`, lint, tests unitaires/intégration, build, tests API et tests end-to-end des parcours client/hôtelier/admin. Ajouter des tests spécifiques aux dates, fuseaux horaires, calculs XAF, inventaire concurrent, paiements rejoués et remboursements.
- [ ] Préparer un environnement de recette avec paiements sandbox et données de test distinctes ; faire valider les annonces, tarifs, e-mails, remboursements et flux de support par les responsables métier avant ouverture.

**Critères de sortie P2 :** les tests et procédures de sauvegarde/restauration sont documentés et exécutés ; les textes juridiques et annonces reflètent les opérations réelles ; aucune donnée de test, identifiant de démonstration ou secret n’est présent en production ; une personne peut traiter les réservations et incidents au quotidien.

## Ordre recommandé

1. Valider le modèle commercial, les règles de réservation et les prestataires de paiement.
2. Stabiliser dépendances, configuration Tailwind/TypeScript, routes et build.
3. Concevoir puis livrer API, base de données, authentification et autorisations.
4. Unifier le catalogue et rendre recherche, disponibilité et prix fiables.
5. Livrer réservation, paiement, notifications, annulation et espaces client/hôtelier.
6. Raccorder avis/contact, revoir conformité et accessibilité, automatiser les tests.
7. Effectuer la recette en sandbox, configurer production et suivre les critères de sortie avant ouverture.

## Fichiers principaux concernés

- Navigation et providers : `src/App.tsx`, `src/contexts/AuthContext.tsx`, `src/contexts/CartContext.tsx`, `src/components/Navbar.tsx`.
- Catalogue et réservations : `src/pages/Home.tsx`, `src/pages/Search.tsx`, `src/pages/HotelDetails.tsx`, `src/pages/Cart.tsx`, `src/pages/Checkout.tsx`, `src/pages/BookingConfirmation.tsx`, `src/pages/BookingSuccess.tsx`, `src/hooks/useBooking.ts`.
- Comptes et espaces : `src/pages/Login.tsx`, `src/pages/Register.tsx`, `src/pages/Reservations.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Favorites.tsx`, `src/components/FavoriteButton.tsx`.
- Contact et avis : `src/pages/Contact.tsx`, `src/pages/Testimonials.tsx`, `src/pages/TestimonialAdmin.tsx`, `src/hooks/useTestimonials.ts`.
- Configuration et contenu : `package.json`, `vite.config.ts`, `src/index.css`, `index.html`, `public/_redirects`, `README.md`, `src/pages/Privacy.tsx`, `src/pages/Terms.tsx`.