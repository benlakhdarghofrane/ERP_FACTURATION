import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';

@Controller('factures')
export class FacturesController {  // ⚠️ Changez TestController en FacturesController
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async findAll() {
    try {
      console.log('Fetching factures...');
      
      const { data, error } = await this.supabaseService
        .from('factures')
        .select(`
          *,
          clients:client_id (nom_entreprise, contact_nom)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error:', error.message);
        return { success: false, error: error.message };
      }

      return {
        success: true,
        data: data || [],
        count: data?.length || 0
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch factures'
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const { data, error } = await this.supabaseService
        .from('factures')
        .select(`
          *,
          clients:client_id (*),
          facture_items (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: 'Facture not found'
      };
    }
  }

  @Post()
  async create(@Body() factureData: any) {
    try {
      // Générer un numéro de facture
      const today = new Date();
      const numero = `FACT-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 1000)}`;
      
      const completeData = {
        ...factureData,
        numero_facture: numero,
        statut: 'brouillon',
        created_at: new Date().toISOString()
      };

      const { data, error } = await this.supabaseService
        .from('factures')
        .insert([completeData])
        .select();

      if (error) throw error;

      return {
        success: true,
        data: data[0],
        message: 'Facture créée avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Post('test-data')
  async createTestData() {
    try {
      // 1. Créer un client de test
      const { data: clientData, error: clientError } = await this.supabaseService
        .from('clients')
        .insert([{
          nom_entreprise: 'Client de Test',
          contact_nom: 'Test User',
          contact_email: 'test@example.com',
          telephone: '0123456789',
          adresse: '123 Test Street'
        }])
        .select();

      if (clientError) throw clientError;

      // 2. Créer une facture de test
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const { data: factureData, error: factureError } = await this.supabaseService
        .from('factures')
        .insert([{
          entreprise_id: '00000000-0000-0000-0000-000000000001',
          client_id: clientData[0].id,
          numero_facture: `TEST-${today.getTime()}`,
          date_emission: today.toISOString().split('T')[0],
          date_echeance: nextMonth.toISOString().split('T')[0],
          montant_ht: 1000,
          montant_tva: 200,
          montant_ttc: 1200,
          statut: 'brouillon'
        }])
        .select();

      if (factureError) throw factureError;

      return {
        success: true,
        message: 'Données de test créées',
        client: clientData[0],
        facture: factureData[0]
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}