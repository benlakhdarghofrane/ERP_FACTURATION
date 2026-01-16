# Architecture de l'Application ERP Facturation

## Vue d'ensemble

Ce document décrit l'architecture de l'application ERP de facturation et de gestion de livraisons, conçue pour être performante, scalable et fonctionner en mode **Offline-first** (hors ligne).

## Architecture Technique

L'application est basée sur une architecture **Microservices** (logique métier dans NestJS) et **Client-Serveur** avec une couche de synchronisation robuste.

| Composant | Technologie | Rôle Principal |
| :--- | :--- | :--- |
| **Frontend** | Next.js (React) | Interface utilisateur, PWA, gestion du mode hors ligne (IndexedDB). |
| **Backend (API)** | NestJS (Node.js) | Logique métier, validation, sécurité, communication avec la base de données. |
| **Base de Données** | PostgreSQL | Stockage des données relationnelles. |
| **Services Externes** | Supabase | Authentification (Auth) et gestion des politiques de sécurité (RLS). |

## Flux de Données (Offline-first)

1.  **Frontend (Online)** : Les données sont récupérées via l'API NestJS.
2.  **Frontend (Offline)** : Les données sont lues et écrites dans **IndexedDB** via `offline.service.ts`.
3.  **Synchronisation** : Le `sync.service.ts` gère la synchronisation bidirectionnelle des données entre IndexedDB et l'API NestJS, en résolvant les conflits.

## Sécurité

-   **Authentification** : Gérée par Supabase Auth.
-   **Autorisation** : Gérée par l'API NestJS (vérification des rôles/permissions) et par le **Row Level Security (RLS)** de PostgreSQL via Supabase.
-   **Accès BDD** : Le Frontend **n'accède jamais** directement à la base de données. Toutes les requêtes passent par l'API NestJS.
