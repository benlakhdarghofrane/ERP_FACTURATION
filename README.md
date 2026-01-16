# ERP Facturation & Gestion de Livraisons (PWA)

Ce projet est la structure complète d'une application web professionnelle de type **ERP / SaaS** (Enterprise Resource Planning / Software as a Service) dédiée à la facturation et à la gestion des livraisons. Il est conçu pour être installé comme une **Progressive Web App (PWA)**, offrant une expérience utilisateur rapide, fluide et fonctionnant en mode **Offline-first**.

---

## 1. Architecture Générale

L'application est divisée en deux composants principaux : un **Frontend** (client) et un **Backend** (API), communiquant via une API REST/GraphQL optimisée.

| Composant | Technologie Principale | Rôle |
| :--- | :--- | :--- |
| **Frontend** | Next.js (React) + Tailwind CSS | Interface utilisateur, gestion de l'état local, PWA, synchronisation hors ligne. |
| **Backend** | NestJS (Node.js) | Logique métier centralisée, sécurité, gestion des transactions de base de données. |
| **Base de Données** | PostgreSQL | Stockage des données relationnelles, utilisation du Row Level Security (RLS). |
| **Services Externes** | Supabase | Fournit l'authentification utilisateur et l'accès sécurisé à la base de données PostgreSQL. |

## 2. Rôle du Frontend (Next.js)

Le frontend est responsable de l'expérience utilisateur. Il est construit avec Next.js pour bénéficier du rendu côté serveur (SSR) ou statique (SSG) et garantir des **chargements rapides** et un **zéro lag** côté utilisateur.

-   **PWA** : Le dossier `frontend/pwa` contient le `manifest.json` et le `service-worker.ts` pour permettre l'installation de l'application sur bureau et mobile, et la mise en cache des assets.
-   **Offline-first** : Le `offline.service.ts` utilise **IndexedDB** pour stocker les données localement. Le `sync.service.ts` gère la synchronisation bidirectionnelle avec le backend.

## 3. Rôle du Backend (NestJS)

Le backend est le cœur de la logique métier. Il est construit avec NestJS pour sa structure modulaire et sa capacité à créer des applications hautement **scalables** et maintenables.

-   **API Unique** : Il expose une API claire et performante pour le frontend.
-   **Sécurité** : Il applique la logique d'autorisation et de validation des données.
-   **Logique Métier** : **Toute la logique métier** (calculs de factures, gestion des stocks, etc.) doit résider ici. Le frontend ne fait que présenter les données et envoyer les commandes.

## 4. Base de Données PostgreSQL et Supabase

PostgreSQL est utilisé pour sa robustesse et ses fonctionnalités avancées (triggers, fonctions, RLS).

-   **Supabase** est utilisé **uniquement** comme fournisseur d'infrastructure pour :
    1.  **Authentification** : Gestion des utilisateurs et des sessions.
    2.  **Base de Données** : Hébergement de la base de données PostgreSQL.
    3.  **Sécurité (RLS)** : Application des politiques de sécurité au niveau des lignes pour un contrôle d'accès fin.

> **🚫 Règle de Sécurité Absolue** : Le Frontend n'a **aucun accès direct** à la base de données. Toutes les interactions passent par l'API NestJS, sauf pour l'authentification initiale gérée par le client Supabase.

## 5. Gestion des Rôles

L'application est structurée pour gérer trois rôles principaux, permettant une utilisation intensive de type ERP réel :

-   **Admin / Gérant**
-   **Commercial**
-   **Livreur**

La gestion des permissions est prévue à la fois dans le backend (modules `roles` et `permissions`) et dans la base de données via RLS.

## 6. Objectifs de Performance

La structure est optimisée pour :
-   **Zéro Lag** : Grâce à Next.js, Tailwind CSS et l'architecture Offline-first.
-   **Scalabilité** : La séparation claire entre Frontend et Backend (NestJS) permet d'ajouter de nouvelles fonctionnalités sans impacter l'ensemble du système.
-   **Offline-first** : Assure qu'aucune perte de données ne se produit et que l'application reste utilisable même sans connexion.

## 7. Ordre Recommandé de Développement

Pour un développement structuré et efficace, il est recommandé de suivre cet ordre :

1.  **Configuration de l'Environnement** : Installer les dépendances (via `package.json`) et configurer les variables d'environnement (`.env.example`).
2.  **Base de Données** : Exécuter les scripts SQL (`database/*.sql`) pour créer le schéma, les rôles et les politiques RLS.
3.  **Backend (Auth)** : Implémenter l'authentification dans NestJS en utilisant Supabase.
4.  **Backend (Entités)** : Développer les modules de base (Clients, Articles) avec leurs contrôleurs et services.
5.  **Frontend (Layout)** : Créer le layout de base (`Sidebar.tsx`, `Header.tsx`) et la navigation.
6.  **Frontend (Offline/Sync)** : Implémenter le `offline.service.ts` et le `sync.service.ts` pour les données de base.
7.  **Développement des Fonctionnalités** : Développer les fonctionnalités métier (Factures, Livraisons) en s'assurant que le flux de données passe par l'API NestJS.

## 8. Prochaines Étapes

-   Implémenter la logique métier complète dans les services NestJS.
-   Développer les interfaces utilisateur (CRUD) pour chaque entité dans le frontend.
-   Finaliser la logique de synchronisation et de résolution des conflits.
-   Ajouter les tests unitaires et d'intégration.
