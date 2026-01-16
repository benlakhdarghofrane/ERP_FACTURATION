GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admin;
GRANT SELECT, INSERT, UPDATE ON factures, clients, articles TO commercial;
GRANT SELECT, UPDATE ON livraisons, taches TO livreur;
