# Gestion des Rôles et Permissions

Ce document décrit les rôles utilisateurs prévus et leurs permissions associées.

## Rôles Utilisateurs

| Rôle | Description | Permissions Clés |
| :--- | :--- | :--- |
| **Admin / Gérant** | Accès complet à toutes les fonctionnalités. Peut gérer les utilisateurs, les paramètres et auditer les logs. | CRUD sur toutes les entités (Factures, Clients, Livraisons, Utilisateurs). |
| **Commercial** | Accès aux fonctionnalités de vente et de gestion client. | CRUD sur Clients, Factures, Proformas. Lecture seule sur Livraisons. |
| **Livreur** | Accès limité aux fonctionnalités de livraison. | Lecture/Mise à jour du statut des Bons de Livraison/Livraisons. Lecture seule sur Clients. |

## Implémentation

-   **Frontend** : Les composants (boutons, liens) sont affichés ou masqués en fonction du rôle de l'utilisateur.
-   **Backend (NestJS)** : Utilisation de **Guards** pour vérifier les permissions avant d'exécuter la logique métier.
-   **Base de Données (RLS)** : Les politiques de sécurité au niveau des lignes (RLS) dans PostgreSQL/Supabase garantissent que même si une requête malveillante atteint la BDD, l'utilisateur ne peut accéder qu'aux données autorisées par son rôle.
