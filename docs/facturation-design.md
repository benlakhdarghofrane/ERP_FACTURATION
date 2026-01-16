# Conception de la Fonctionnalité Facturation

## Modèle de Données (PostgreSQL)

### Table `factures`
- `id`: uuid (PK)
- `client_id`: uuid (FK -> clients)
- `numero_facture`: text (Unique, ex: FACT-2024-001)
- `date_emission`: date
- `date_echeance`: date
- `statut`: text (brouillon, validee, payee, annulee)
- `taux_tva`: numeric (défaut 20%)
- `montant_ht`: numeric (calculé)
- `montant_tva`: numeric (calculé)
- `montant_ttc`: numeric (calculé)
- `entreprise_id`: uuid (pour RLS)
- `created_at`: timestamp
- `updated_at`: timestamp

### Table `facture_items`
- `id`: uuid (PK)
- `facture_id`: uuid (FK -> factures, ON DELETE CASCADE)
- `description`: text
- `quantite`: numeric
- `prix_unitaire`: numeric
- `montant_ht`: numeric (calculé)

## Backend (NestJS)

### Endpoints API
- `GET /factures` : Liste des factures (filtrée par entreprise_id via JWT)
- `GET /factures/:id` : Détail d'une facture
- `POST /factures` : Création d'une facture (statut brouillon par défaut)
- `PATCH /factures/:id` : Mise à jour (uniquement si brouillon)
- `PATCH /factures/:id/valider` : Passage au statut 'validee' (génère numéro définitif)
- `PATCH /factures/:id/payer` : Passage au statut 'payee'
- `DELETE /factures/:id` : Suppression (uniquement si brouillon)

### Logique Métier
- Calcul automatique des totaux (HT, TVA, TTC) lors de la création/mise à jour.
- Validation des données (DTO).
- Sécurisation par rôles (Admin/Commercial).

## Frontend (Next.js)

### Écrans
- `/factures` : Liste avec filtres (statut, date).
- `/factures/nouveau` : Formulaire de création.
- `/factures/[id]` : Vue détaillée et actions (valider, payer).

### Offline-first
- Utilisation de **Dexie.js** pour IndexedDB.
- Stockage local des factures créées hors ligne.
- File d'attente de synchronisation pour les actions POST/PATCH.
- Indicateur d'état de synchronisation.
