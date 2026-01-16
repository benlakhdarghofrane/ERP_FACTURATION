import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';

@Injectable()
export class FacturesService {
  constructor(private readonly supabaseService: SupabaseService) {
    console.log('FacturesService: Constructor called');
  }

  async findAll() {
    console.log('FacturesService: Fetching all factures');
    
    try {
      // Utilisez la méthode 'from' du service
      const { data, error } = await this.supabaseService
        .from('factures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching factures:', error.message);
        return [];
      }

      console.log(`Found ${data?.length || 0} factures`);
      return data || [];
      
    } catch (error) {
      console.error('Exception in findAll:', error);
      return [];
    }
  }
}