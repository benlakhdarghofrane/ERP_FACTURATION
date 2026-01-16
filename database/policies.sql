-- Fichier: erp-facturation-pwa/database/policies.sql
-- Activation des politiques de sécurité au niveau des lignes (RLS)

-- Activer RLS sur les tables
ALTER TABLE public.factures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facture_items ENABLE ROW LEVEL SECURITY;

-- Politique pour les factures : accès basé sur entreprise_id stocké dans le JWT
CREATE POLICY "Les utilisateurs peuvent voir les factures de leur entreprise"
ON public.factures FOR SELECT
USING (auth.jwt() ->> 'entreprise_id' = entreprise_id::text);

CREATE POLICY "Les utilisateurs peuvent créer des factures pour leur entreprise"
ON public.factures FOR INSERT
WITH CHECK (auth.jwt() ->> 'entreprise_id' = entreprise_id::text);

CREATE POLICY "Les utilisateurs peuvent modifier les factures de leur entreprise"
ON public.factures FOR UPDATE
USING (auth.jwt() ->> 'entreprise_id' = entreprise_id::text);

-- Politique pour les items de facture : accès via la facture parente
CREATE POLICY "Les utilisateurs peuvent voir les items des factures de leur entreprise"
ON public.facture_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.factures
    WHERE factures.id = facture_items.facture_id
    AND auth.jwt() ->> 'entreprise_id' = factures.entreprise_id::text
  )
);

CREATE POLICY "Les utilisateurs peuvent insérer des items dans les factures de leur entreprise"
ON public.facture_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.factures
    WHERE factures.id = facture_items.facture_id
    AND auth.jwt() ->> 'entreprise_id' = factures.entreprise_id::text
  )
);
