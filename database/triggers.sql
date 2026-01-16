-- Fichier: erp-facturation-pwa/database/triggers.sql
-- Définition des triggers et fonctions PostgreSQL

-- TODO: Exemple de fonction pour mettre à jour le champ 'updated_at'
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--    NEW.updated_at = now();
--    RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- TODO: Exemple de trigger
-- CREATE TRIGGER update_client_updated_at BEFORE UPDATE
-- ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
