import { SupabaseService } from '../database/supabase.service';
export declare class FacturesService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<any[]>;
}
