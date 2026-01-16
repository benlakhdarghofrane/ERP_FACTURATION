// Fichier: erp-facturation-pwa/backend/src/database/postgres.config.ts
// TODO: Configuration de la connexion à la base de données PostgreSQL

export const postgresConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'erp_facturation',
  // TODO: Autres options de configuration (SSL, pool, etc.)
};
