# Conception de la Base de Données (PostgreSQL)

## Principes de Conception

-   **Normalisation** : Les tables sont normalisées pour éviter la redondance.
-   **Sécurité** : Utilisation intensive du **Row Level Security (RLS)** pour contrôler l'accès aux données.
-   **Audit** : Les tables importantes incluent des champs `created_at` et `updated_at` (via triggers).

## Entités Principales (Squelette)

| Entité | Description | Relations Clés |
| :--- | :--- | :--- |
| **Clients** | Informations sur les clients de l'ERP. | 1:N avec Factures, Livraisons. |
| **Articles** | Catalogue des produits ou services facturables. | N:M avec Factures (via Lignes de Facture). |
| **Factures** | Documents de facturation. | 1:N avec Lignes de Facture. 1:1 avec Proformas. |
| **Proformas** | Devis ou factures proforma. | 1:1 avec Factures (une fois validée). |
| **Bons de Livraison** | Documents pour le suivi des livraisons. | 1:N avec Livraisons. |
| **Livraisons** | Détails des livraisons (date, statut, livreur). | 1:1 avec Bon de Livraison. 1:N avec Livreur (Utilisateur). |
| **Audit Log** | Enregistrement de toutes les actions importantes des utilisateurs. | N:1 avec Utilisateurs. |

## Schéma SQL

Le fichier `database/schema.sql` contient la structure de base (CREATE TABLE, FK).
Les fichiers `roles.sql`, `permissions.sql`, `policies.sql`, et `triggers.sql` contiennent les éléments de sécurité et d'automatisation.
