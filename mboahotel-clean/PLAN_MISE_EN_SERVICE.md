# Audit fonctionnel et plan de mise en service

## Verdict

**État actuel : prototype de démonstration, pas une plateforme de réservation prête pour des clients.** L’interface React/Vite contient de nombreux écrans, mais les comptes, les réservations, les paiements, les avis et le contact reposent encore sur des données statiques, du stockage temporaire ou des délais simulés. Aucun serveur applicatif ni base de données n’est présent dans ce dépôt.

Le blocage le plus important est métier et technique : l’application peut présenter une réservation comme payée et confirmée sans vérifier de disponibilité, créer de réservation persistante ou effectuer de paiement. Il ne faut donc pas ouvrir le parcours de réservation au public avant le raccordement du serveur et du prestataire de paiement.

## Avancement de la refonte frontend

**Étape 1 — identité visuelle et accueil : réalisée.** Une direction hôtelière premium, épurée, avec une palette forêt/sable et une touche terracotta est appliquée au socle CSS, à l’en-tête, au pied de page, à l’accueil et au formulaire de recherche. La configuration Tailwind/PostCSS nécessaire est en place.

**Étape 2 — harmonisation des pages : réalisée, recette responsive à poursuivre.** Les pages accessibles (recherche, fiche hôtel, favoris, connexion/inscription, panier, parcours de réservation, espace client/hôtelier, témoignages, contact, FAQ, présentation et pages légales) partagent maintenant des couleurs, composants de titre, boutons, cartes et surfaces cohérents. Les routes Favoris et Témoignages sont déclarées, les identifiants du catalogue de recherche sont uniques, les résultats de démonstration ont une fiche accessible et les paramètres de recherche sont synchronisés avec React Router. Les formulaires indiquent leurs limites ; aucun faux paiement ou enregistrement serveur n’est annoncé comme réussi. Les favoris sont conservés localement par compte/appareil et ne sont pas synchronisés.

**Recette exécutée :** le build Vite de production réussit après la refonte. Les pages d’accueil, Contact et Conditions ont été ouvertes dans l’aperçu navigateur desktop ; les vues téléphone/tablette, le clavier, les contrastes et les parcours connectés restent à vérifier. Aucun test applicatif n’est présent. Le lint ne démarre pas faute de configuration ESLint.

**Limites persistantes :** catalogue, prix, disponibilité, avis et témoignages sont des données de démonstration ; les réservations, paiements, comptes, favoris synchronisés et soumissions d’avis ne sont pas des services opérationnels. Les textes légaux signalent désormais qu’ils sont des brouillons, mais nécessitent une validation juridique et un alignement avec les traitements réellement mis en place avant publication.

**Hébergement frontend :** une configuration Netlify est ajoutée à la racine du dépôt avec le sous-dossier `mboahotel-clean`, `npm run build`, la publication de `dist`, les règles SPA et des en-têtes HTTP. Le dépôt doit encore être autorisé et importé dans un compte Netlify pour activer le déploiement continu sur `main`. Cette configuration ne fournit pas d’API ; le proxy vers `api.mboahotel.com` a été retiré car ce domaine n’est ni confirmé ni présent dans le projet.

## Mise à jour — fondation des comptes et des espaces (8 octobre 2026)

Le frontend utilise désormais Supabase Auth et une base PostgreSQL Supabase pour les profils, demandes partenaires, établissements, types de chambres et la lecture des réservations. Les routes `/reservations` et `/dashboard` exigent une session. Les permissions sont appliquées par RLS ; une inscription demandant l’accès hôtelier reste un compte client jusqu’à l’approbation d’un administrateur. Le rôle transmis depuis le navigateur ne confère jamais de privilèges.

### Configuration requise avant utilisation

1. Créer un projet Supabase et exécuter `supabase/migrations/20261008090000_initial_accounts_and_hotelier_workspace.sql` depuis son SQL Editor.
2. Ajouter `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` au fichier local `.env` (modèle : `.env.example`) et aux variables d’environnement Netlify, puis redéployer. Seule la clé publique anon/publishable est autorisée dans le frontend ; ne jamais exposer `service_role`.
3. Créer le premier compte administrateur via l’inscription normale, puis lui attribuer le rôle une seule fois depuis le SQL Editor Supabase avec une requête privilégiée, par exemple :

   ```sql
   update public.profiles
   set role = 'admin', updated_at = now()
   where id = (
     select id from auth.users where email = 'admin@votre-domaine.cm'
   );
   ```

4. Configurer dans Supabase les URL autorisées et l’URL de redirection d’e-mail vers `/login` pour les domaines locaux et Netlify. Activer la confirmation d’adresse e-mail en production.
5. Tester en environnement de développement les inscriptions client et partenaire, confirmation d’e-mail, soumission puis approbation/refus d’une demande, contrôle d’accès à `/dashboard`, création d’un établissement et ajout/activation de chambres.

La migration utilise une fonction `SECURITY DEFINER` bornée pour vérifier le rôle administrateur dans les politiques RLS, afin d’éviter une récursion sur `profiles`. Le rôle n’est pas modifiable via les permissions normales du client.

### Limites toujours bloquantes pour l’ouverture commerciale

- Le parcours de réservation et le paiement ne sont pas branchés à la base ni à un prestataire ; aucun séjour réel ne peut être créé depuis l’interface. L’espace membre ne montre que les réservations déjà persistées, sans création, annulation ni modification.
- Les établissements soumis restent en attente de publication. L’ajout et l’activation des types de chambres sont disponibles dans l’espace hôtelier, mais la disponibilité par date, les photos, le paiement, les e-mails/SMS et l’approbation de fiche ne sont pas encore intégrés.
- Aucun projet Supabase, secret public de configuration ou environnement de test n’est fourni dans le dépôt. Les parcours connectés ne peuvent donc pas être testés de bout en bout avant la configuration ci-dessus.

### Mise à jour — espace hôtelier et abonnements (8 octobre 2026)

La migration `supabase/migrations/20261008180000_hotel_management_and_subscriptions.sql` ajoute l’édition des fiches et des chambres, une galerie d’images Supabase Storage, des formules configurables (tarifs en XAF, limites et options), et des abonnements par établissement. La migration réserve les images publiques et le catalogue public aux hôtels approuvés disposant d’un abonnement valide. Elle crée les formules Essentiel, Visibilité+ et Premium **inactives, sans tarif** : un administrateur doit décider des prix, limites, options et activer chaque formule depuis le tableau de bord.

**Attention avant d’exécuter cette migration :** les hôtels déjà approuvés ne seront plus visibles dans le catalogue tant qu’un abonnement valide ne leur aura pas été attribué. Les renouvellements sont manuels : l’hôtelier envoie le montant depuis MTN Mobile Money ou Orange Money, saisit son numéro et la référence du transfert, puis un administrateur vérifie le crédit reçu dans le portefeuille de collecte avant d’approuver. L’application ne prélève pas d’argent, ne confirme pas le transfert automatiquement et ne met pas en place de renouvellement automatique. Les coordonnées destinataires doivent être configurées dans le tableau de bord admin.

**Ordre et recette de déploiement :**

1. Sauvegarder la base avant migration ; exécuter dans Supabase SQL Editor les migrations dans l’ordre : `20261008090000_initial_accounts_and_hotelier_workspace.sql`, `20261008170000_hotel_publication_review.sql`, puis `20261008180000_hotel_management_and_subscriptions.sql` (ne pas relancer celles déjà appliquées).
2. Déployer la version frontend correspondante. Vérifier que le build Vite réussit.
3. Dans le tableau de bord administrateur, configurer les coordonnées de collecte et les tarifs XAF, limites et options des formules ; n’activer que les formules prêtes à vendre.
4. Pour chaque hôtel existant, informer le propriétaire du tarif et du transfert demandé ; après vérification réelle du transfert, examiner la référence et approuver le paiement depuis l’interface admin. Ne pas activer un abonnement sur la seule base de la référence déclarée.
5. Tester avec des comptes hôtelier et admin : modifier et re-soumettre une fiche, ajouter/modifier/masquer/supprimer des chambres, charger et supprimer des photos, dépasser les limites, déclarer un transfert, refuser puis approuver un paiement, vérifier l’expiration, et confirmer qu’un hôtel non abonné n’est pas public.

Les formules sont configurées **par établissement**, même si un propriétaire possède plusieurs hôtels. Les limites initiales des types de chambres et photos sont des valeurs de départ, non des tarifs validés. Avant commercialisation, convenir des prix, taxes/frais éventuels, conditions d’abonnement, remboursements, délais de traitement et procédures de rapprochement Mobile Money. Aucun transfert réel, paiement ni application de migration n’a été testé depuis ce dépôt.

### Mise à jour — validation des établissements

Une seconde migration, `supabase/migrations/20261008170000_hotel_publication_review.sql`, ajoute l’action d’administration permettant d’approuver ou de refuser la publication d’un établissement. Le tableau de bord admin liste désormais les demandes partenaires et les fiches hôtelières, avec état et coordonnées de contact. Seuls les établissements dont le statut est `approved` sont visibles par les visiteurs anonymes selon les règles RLS existantes ; le tableau de bord hôtelier continue de ne voir que ses propres fiches.

Cette migration doit être exécutée dans Supabase SQL Editor **après** la migration initiale.

### Mise à jour — catalogue public Supabase

Les pages d’accueil, de recherche, de fiche établissement et de favoris lisent maintenant les hôtels `approved` depuis Supabase. Les chambres actives sont chargées uniquement pour ces hôtels ; les pages publiques ne s’appuient pas sur les fiches de démonstration dès que Supabase est configuré. En l’absence de configuration, les données de démonstration restent disponibles et sont signalées comme telles.

Les fiches publiées utilisent une image générique jusqu’à l’ajout d’un stockage photo. La recherche n’invente ni étoiles, ni avis, ni équipements, ni coordonnées ; la fiche détail affiche les chambres, le tarif minimum déclaré et les coordonnées fournies. `total_units` est présenté comme un nombre d’unités déclaré, jamais comme une disponibilité garantie. Les contrôles de panier/réservation et les avis simulés sont masqués pour les fiches partenaires ; la prise de réservation en ligne demeure indisponible.

Après exécution des migrations, la recette à faire avec au moins un établissement approuvé est : vérifier sa présence sur l’accueil et dans la recherche, ouvrir sa fiche, confirmer que seules les chambres actives apparaissent et tester ses coordonnées. Vérifier aussi qu’une fiche en attente/refusée est invisible, que les favoris correspondants s’affichent, puis tester les mêmes pages sur mobile. La disponibilité par dates, les photos réelles, les équipements structurés, les avis vérifiés et la réservation restent des étapes distinctes.

## Périmètre et vérifications

Audit du contenu présent dans `src/` (pages, composants, contextes, hooks, types, utilitaires), de `index.html`, `package.json`, `vite.config.ts`, `public/`, des deux README et de la configuration de redirection Netlify. Les observations ci-dessous sont fondées sur le code du dépôt, pas sur un environnement de production ou un compte de prestataire.

Vérifications exécutées depuis `mboahotel-clean/` après retrait de la dépendance partagée orpheline : `npm ci --no-audit --no-fund` réussit (413 paquets installés) et `npm run build` réussit (Vite 4.5.14 ; 1 327 modules transformés). `npm run lint` échoue avant analyse car aucune configuration ESLint n’est fournie. `npm test -- --run` ne trouve aucun fichier de test. Un `package-lock.json` a été généré pour les installations reproductibles. Le diagnostic de l’éditeur n’a remonté aucune erreur sur les fichiers modifiés, mais ne remplace pas un contrôle TypeScript complet ni une recette navigateur. Le fichier de plan était non suivi avant cette mise à jour.

## Constats vérifiés

### Bloqueurs de mise en service

- **Réservations et paiement simulés.** `src/pages/Checkout.tsx` attend trois secondes, vide le panier et affiche une confirmation sans appel à un fournisseur de paiement ni au serveur. Le moyen de paiement sélectionné n’est pas utilisé. `src/pages/BookingConfirmation.tsx` simule aussi la confirmation et annonce l’envoi d’un e-mail qui n’a pas lieu. Les identifiants sont générés dans le navigateur et ne correspondent pas à une réservation durable.
- **Aucune disponibilité garantie.** Les quantités disponibles et les prix sont codés en dur dans `src/pages/HotelDetails.tsx`. Ils ne sont ni recalculés côté serveur ni bloqués atomiquement au moment de la réservation. Deux clients pourraient réserver la même chambre.
- **Aucun backend livré.** `vite.config.ts` ne fait que proxyfier `/api` vers `localhost:5000` en développement. Aucun service API, schéma de base de données, migration, webhook de paiement ou traitement de tâches e-mail/SMS n’apparaît dans l’application. L’ancienne redirection Netlify vers `api.mboahotel.com`, domaine non confirmé et sans backend dans le dépôt, a été retirée ; les appels API de production restent à configurer quand l’API sera disponible.
- **Comptes non opérationnels et incohérents.** `src/pages/Login.tsx` n’accepte qu’un compte de démonstration et écrit sous la clé `user`. `src/contexts/AuthContext.tsx` appelle `/api/auth/login` et `/api/auth/register` et lit d’autres clés. `src/pages/Register.tsx` ne crée aucun compte (TODO) et affiche une alerte. Le lien hôtelier ajoute `?role=hotelier`, mais le formulaire n’exploite pas ce rôle.
- **Espace client incomplet.** `src/pages/Reservations.tsx` et `src/pages/Dashboard.tsx` sont des écrans « en cours de développement ». Il n’y a pas de suivi, modification ou annulation effective des réservations ni de gestion d’établissement pour les hôteliers.

### Bugs de navigation et de typage à traiter

- **Partiellement corrigé dans le frontend :** Favoris et Témoignages ont une route, la route 404 existe et les favoris sont désormais gérés dans le contexte et stockés localement. `/forgot-password` et `/testimonial-admin` ne sont pas des parcours publics intégrés. Les routes `/dashboard` et `/reservations` n’ont pas de garde d’authentification fiable ; sécuriser impérativement les données côté API avant de les rendre opérationnelles.
- Le build Vite ne vérifie pas les types TypeScript ; aucune configuration TypeScript stricte ou suite de tests n’est encore définie. Effectuer ce contrôle avant lancement.
- Les identifiants de résultats sont uniques et les établissements présents dans le catalogue disposent d’une fiche de démonstration accessible. Cela ne remplace pas un catalogue partagé, réel, vérifié et typé.
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

- Le lockfile et la configuration Netlify/Tailwind/PostCSS sont maintenant présents ; `npm ci` et le build de production ont été validés localement. La dépendance `@mboa-hotel/shared`, déclarée sans paquet correspondant ni import dans le frontend, a été retirée. Il manque encore une configuration TypeScript, un exemple d’environnement, une configuration ESLint, une CI et des tests applicatifs ; valider les routes et les en-têtes après le premier déploiement Netlify.
- Le README annonce notamment PWA, analytics, sécurité renforcée et paiements locaux, mais aucun manifeste/service worker, système analytics, authentification fonctionnelle ou paiement réel n’a été identifié. Corriger ces affirmations ou livrer les capacités correspondantes.
- Le README du frontend demandait auparavant `cd client`, chemin inexistant ; les commandes d’installation ont été corrigées vers `mboahotel-clean/`. Le README à la racine du dépôt ne contient que le titre. Compléter les instructions de test et vérifier le domaine réel.
- Le visuel principal de `src/pages/Home.tsx` référence `../../public/images/baniere/3192.jpg`. Les fichiers placés dans `public/` doivent être servis avec une URL publique telle que `/images/baniere/3192.jpg` ; vérifier cette image dans le navigateur en dev et après build.
- Les listes d’hôtels, tarifs, notes, avis et témoignages sont des données de démonstration, parfois associées à des images distantes génériques. Les remplacer par des établissements réels vérifiés, leurs propres tarifs, politiques, photos autorisées et disponibilités ; sinon les identifier clairement comme démo.
- `src/pages/Privacy.tsx` et `src/pages/Terms.tsx` déclarent des traitements, protections, paiements ou droits qui ne sont pas établis par le code. Faire vérifier ces textes par un conseil compétent pour les marchés visés et les aligner sur les pratiques réelles. Les coordonnées et domaines utilisés entre footer, FAQ, politiques, HTML et README ne sont pas uniformes et doivent être confirmés.
- Netlify est désormais la cible documentée pour le frontend : `netlify.toml` configure le build, la publication, les routes SPA et les en-têtes ; `public/_redirects` ne contient que le fallback React Router. Le proxy `/api` de Vite reste uniquement local : associer une API de production et ses variables d’environnement séparément, lorsque son hébergement et son domaine seront déterminés.
- Plusieurs interactions reposent sur `alert`, `confirm` ou des icônes cliquables sans équivalent clavier/nom accessible. Réaliser des tests clavier, lecteur d’écran, contrastes, erreurs de formulaires et petits écrans. Ajouter une vraie page 404 et des états de chargement/erreur cohérents.

### Revue approfondie de l’interface frontend

**Périmètre de cette revue :** lecture statique des pages, composants et CSS, plus vérification du build dans un navigateur desktop. Les tailles d’écran mobiles/tablettes, les contrastes et les performances restent à valider visuellement en recette.

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
- [ ] Installation reproductible : lockfile généré et `npm ci` validé localement ; confirmer le build sous Node 20 dans Netlify. Ajouter la configuration TypeScript, ESLint et des tests applicatifs ; la configuration PostCSS/Tailwind est désormais présente.
- [ ] Corriger les erreurs de compilation/types, les imports/exports et les routes cassées ; tester la page 404 ajoutée. Toute route privée doit être protégée par authentification **et** autorisation serveur, pas seulement masquée dans l’interface.
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
- Configuration et contenu : `netlify.toml`, `package.json`, `package-lock.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `src/index.css`, `index.html`, `public/_redirects`, `README.md`, `src/pages/Privacy.tsx`, `src/pages/Terms.tsx`.