// Fichier: erp-facturation-pwa/frontend/services/supabase.client.ts
// TODO: Initialisation du client Supabase pour l'authentification
// TODO: Fonctions d'aide pour la connexion, l'inscription, la déconnexion

import { createClient } from '@supabase/supabase-js';

// TODO: Remplacer par les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TODO: Interfaces et fonctions d'authentification (signUp, signIn, signOut)
export interface AuthUser {
  id: string;
  email: string;
  // ...
}
