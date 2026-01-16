import { SupabaseService } from '../database/supabase.service';
export declare class FacturesController {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
        count?: undefined;
    } | {
        success: boolean;
        data: any[];
        count: number;
        error?: undefined;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: any;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    create(factureData: any): Promise<{
        success: boolean;
        data: any;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
        message?: undefined;
    }>;
    createTestData(): Promise<{
        success: boolean;
        message: string;
        client: any;
        facture: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
        client?: undefined;
        facture?: undefined;
    }>;
}
