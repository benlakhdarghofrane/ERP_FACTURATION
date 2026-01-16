import { OnModuleInit } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService implements OnModuleInit {
    private supabaseClient;
    constructor();
    onModuleInit(): void;
    private initializeClient;
    private testConnectionImmediately;
    getClient(): SupabaseClient;
    from(table: string): import("@supabase/postgrest-js").PostgrestQueryBuilder<any, any, any, string, unknown>;
}
