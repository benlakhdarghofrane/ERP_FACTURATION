import { SupabaseService } from '../database/supabase.service';
export declare class ClientsController {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<{
        success: boolean;
        data: any[];
        count: number;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
        count?: undefined;
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
    create(clientData: any): Promise<{
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
    update(id: string, clientData: any): Promise<{
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
    remove(id: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    createTestClient(): Promise<{
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
}
