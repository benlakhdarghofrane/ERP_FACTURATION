import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabaseClient: SupabaseClient;

  constructor() {
    console.log('🔧 Constructeur SupabaseService appelé');
    
    // Charger les variables IMMÉDIATEMENT
    dotenv.config({ path: '.env' });
    
    console.log('📋 Vérification variables après chargement:');
    console.log('- SUPABASE_URL:', process.env.SUPABASE_URL || 'NON TROUVÉ');
    console.log('- SUPABASE_KEY:', 
      process.env.SUPABASE_KEY ? 'TROUVÉ (' + process.env.SUPABASE_KEY.substring(0, 10) + '...)' : 'NON TROUVÉ');
    console.log('- NODE_ENV:', process.env.NODE_ENV || 'non défini');
  }

  onModuleInit() {
    console.log('🚀 Initialisation client Supabase (onModuleInit)...');
    this.initializeClient();
  }

  private initializeClient() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    console.log('🧪 Initialisation avec:');
    console.log('URL:', supabaseUrl);
    console.log('Clé présente:', !!supabaseKey);

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ ERREUR: Variables manquantes!');
      console.error('Vérifiez que votre .env contient:');
      console.error('SUPABASE_URL et SUPABASE_KEY');
      console.error('Fichier .env dans:', process.cwd());
      return;
    }

    try {
      // CRITIQUE: Vérifiez que la clé est correcte
      console.log('🔑 Clé utilisée (premiers 30 chars):', supabaseKey.substring(0, 30));
      
      this.supabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        db: {
          schema: 'public',
        },
      });
      
      console.log('✅ Client Supabase créé');
      
      // Test IMMÉDIAT
      this.testConnectionImmediately();
      
    } catch (error) {
      console.error('💥 ERREUR création client:', error.message);
      console.error('Détails:', error);
    }
  }

  private async testConnectionImmediately() {
    console.log('🧪 Test de connexion immédiat...');
    
    try {
      // Essaie une requête très simple
      const { data, error } = await this.supabaseClient
        .from('pg_tables') // Table système PostgreSQL
        .select('tablename')
        .eq('schemaname', 'public')
        .limit(1);
      
      if (error) {
        console.error('❌ Test échoué:', error.message);
        console.error('Code:', error.code);
        console.error('Détails:', error.details);
        
        // Essaie une autre méthode
        const { data: data2, error: error2 } = await this.supabaseClient
          .from('clients')
          .select('count');
          
        if (error2) {
          console.error('❌ Second test échoué:', error2.message);
        } else {
          console.log('✅ Connexion réussie (via clients)');
        }
      } else {
        console.log('✅✅✅ CONNEXION SUPABASE RÉUSSIE !');
        console.log('Tables accessibles:', data?.length > 0 ? 'Oui' : 'Non');
      }
    } catch (error) {
      console.error('💥 Exception test:', error);
    }
  }

  getClient(): SupabaseClient {
    if (!this.supabaseClient) {
      console.warn('⚠️ Client non initialisé, réinitialisation...');
      this.initializeClient();
    }
    
    if (!this.supabaseClient) {
      console.error('❌ Client toujours non disponible après réinitialisation');
      // Lance une erreur au lieu de retourner un mock
      throw new Error('Supabase client non disponible. Vérifiez votre configuration .env');
    }
    
    return this.supabaseClient;
  }

  from(table: string) {
    return this.getClient().from(table);
  }
}