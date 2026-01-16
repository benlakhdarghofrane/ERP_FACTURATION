# Stratégie Offline-First et Synchronisation

## Objectif

Assurer une **expérience utilisateur sans lag** et une **continuité de service** même en cas de perte de connexion (Offline-first).

## Composants Clés

1.  **IndexedDB (`offline.service.ts`)** : Base de données locale utilisée pour stocker toutes les données nécessaires au fonctionnement hors ligne.
2.  **Service Worker (`service-worker.ts`)** : Gère la mise en cache des assets de l'application (HTML, CSS, JS, images) pour un chargement instantané.
3.  **Service de Synchronisation (`sync.service.ts`)** :
    -   **Envoi** : Met en file d'attente les modifications locales (créations, mises à jour, suppressions) et les envoie à l'API NestJS dès que la connexion est rétablie.
    -   **Réception** : Récupère les dernières données du serveur et met à jour IndexedDB.
    -   **Résolution de Conflits** : Logique à implémenter pour gérer les cas où la même donnée a été modifiée à la fois localement et sur le serveur (ex: stratégie "Last-Write-Wins" ou notification utilisateur).

## Flux de Travail

1.  **Démarrage** : L'application tente de se connecter à l'API. Si elle échoue, elle charge les données depuis IndexedDB.
2.  **Modification** : Toute modification utilisateur est d'abord enregistrée dans IndexedDB et marquée comme "en attente de synchronisation".
3.  **Connexion Rétablie** : Le `sync.service.ts` est déclenché pour envoyer les modifications en attente au backend.
