-- Fichier: erp-facturation-pwa/database/schema.sql
-- Schéma de la base de données PostgreSQL

-- Table des utilisateurs (gérée par Supabase Auth, mais pour référence)
-- CREATE TABLE public.users (
--     id uuid references auth.users not null primary key,
--     email text,
--     role text -- 'admin', 'commercial', 'livreur'
-- );

-- Table des clients
CREATE TABLE public.clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_entreprise text NOT NULL,
    contact_nom text,
    contact_email text UNIQUE,
    telephone text,
    adresse text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Table des factures
CREATE TABLE public.factures (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    entreprise_id uuid NOT NULL, -- Référence à l'entreprise (multi-tenant)
    client_id uuid REFERENCES public.clients(id) NOT NULL,
    numero_facture text UNIQUE NOT NULL,
    date_emission date NOT NULL,
    date_echeance date,
    taux_tva numeric DEFAULT 20 NOT NULL,
    montant_ht numeric DEFAULT 0 NOT NULL,
    montant_tva numeric DEFAULT 0 NOT NULL,
    montant_ttc numeric DEFAULT 0 NOT NULL,
    statut text NOT NULL DEFAULT 'brouillon', -- 'brouillon', 'validee', 'payee', 'annulee'
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Table des items de facture
CREATE TABLE public.facture_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    facture_id uuid REFERENCES public.factures(id) ON DELETE CASCADE NOT NULL,
    description text NOT NULL,
    quantite numeric DEFAULT 1 NOT NULL,
    prix_unitaire numeric DEFAULT 0 NOT NULL,
    montant_ht numeric DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Index pour la performance
CREATE INDEX idx_factures_entreprise ON public.factures(entreprise_id);
CREATE INDEX idx_factures_client ON public.factures(client_id);
CREATE INDEX idx_facture_items_facture ON public.facture_items(facture_id);
