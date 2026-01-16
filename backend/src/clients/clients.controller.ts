import { Controller, Get, Post, Body, Put, Delete, Param } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async findAll() {
    try {
      const { data, error } = await this.supabaseService
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return {
        success: true,
        data: data || [],
        count: data?.length || 0
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const { data, error } = await this.supabaseService
        .from('clients')
        .select('*')
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
        error: 'Client not found'
      };
    }
  }

  @Post()
  async create(@Body() clientData: any) {
    try {
      console.log('Creating client:', clientData);
      
      const { data, error } = await this.supabaseService
        .from('clients')
        .insert([{
          ...clientData,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Client created:', data[0]);
      
      return {
        success: true,
        data: data[0],
        message: 'Client créé avec succès'
      };
    } catch (error) {
      console.error('Create error:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la création'
      };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() clientData: any) {
    try {
      const { data, error } = await this.supabaseService
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      return {
        success: true,
        data: data[0],
        message: 'Client mis à jour avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const { error } = await this.supabaseService
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      return {
        success: true,
        message: 'Client supprimé avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Post('test')
  async createTestClient() {
    try {
      const testClient = {
        nom_entreprise: 'Client Test ' + Date.now(),
        contact_nom: 'Test User',
        contact_email: `test${Date.now()}@example.com`,
        telephone: '0123456789',
        adresse: '123 Test Street, Paris'
      };
      
      const { data, error } = await this.supabaseService
        .from('clients')
        .insert([testClient])
        .select();

      if (error) throw error;
      
      return {
        success: true,
        data: data[0],
        message: 'Client de test créé'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}