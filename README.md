# mboahotel-connect

## Mise à jour Supabase : proximité et disponibilité

Avant de publier la recherche par rayon et le stock par dates, exécutez une seule fois le script
[`20261009130000_hotel_coordinates_and_room_availability.sql`](./mboahotel-clean/supabase/migrations/20261009130000_hotel_coordinates_and_room_availability.sql)
dans le SQL Editor du projet Supabase. Il ajoute les coordonnées GPS des établissements et la
fonction de calcul des chambres disponibles à partir des réservations confirmées.

Après la migration, chaque hôtelier peut enregistrer la position de l’établissement dans sa fiche
(coordonnées saisies manuellement ou position du navigateur, à utiliser sur place). La recherche
par proximité ne retient que les établissements ayant une position GPS renseignée ; les autres
restent consultables sans filtrage géographique.

Les demandes de réservation `pending` ne bloquent pas le stock ; seules les réservations
`confirmed` sont déduites. La sélection des chambres publiques reste indicative : la réservation
en ligne n’est pas activée et le client doit confirmer son séjour avec l’établissement.