"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv = require("dotenv");
let SupabaseService = class SupabaseService {
    constructor() {
        console.log('🔧 Constructeur SupabaseService appelé');
        dotenv.config({ path: '.env' });
        console.log('📋 Vérification variables après chargement:');
        console.log('- SUPABASE_URL:', process.env.SUPABASE_URL || 'NON TROUVÉ');
        console.log('- SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'TROUVÉ (' + process.env.SUPABASE_KEY.substring(0, 10) + '...)' : 'NON TROUVÉ');
        console.log('- NODE_ENV:', process.env.NODE_ENV || 'non défini');
    }
    onModuleInit() {
        console.log('🚀 Initialisation client Supabase (onModuleInit)...');
        this.initializeClient();
    }
    initializeClient() {
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
            console.log('🔑 Clé utilisée (premiers 30 chars):', supabaseKey.substring(0, 30));
            this.supabaseClient = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                },
                db: {
                    schema: 'public',
                },
            });
            console.log('✅ Client Supabase créé');
            this.testConnectionImmediately();
        }
        catch (error) {
            console.error('💥 ERREUR création client:', error.message);
            console.error('Détails:', error);
        }
    }
    async testConnectionImmediately() {
        console.log('🧪 Test de connexion immédiat...');
        try {
            const { data, error } = await this.supabaseClient
                .from('pg_tables')
                .select('tablename')
                .eq('schemaname', 'public')
                .limit(1);
            if (error) {
                console.error('❌ Test échoué:', error.message);
                console.error('Code:', error.code);
                console.error('Détails:', error.details);
                const { data: data2, error: error2 } = await this.supabaseClient
                    .from('clients')
                    .select('count');
                if (error2) {
                    console.error('❌ Second test échoué:', error2.message);
                }
                else {
                    console.log('✅ Connexion réussie (via clients)');
                }
            }
            else {
                console.log('✅✅✅ CONNEXION SUPABASE RÉUSSIE !');
                console.log('Tables accessibles:', data?.length > 0 ? 'Oui' : 'Non');
            }
        }
        catch (error) {
            console.error('💥 Exception test:', error);
        }
    }
    getClient() {
        if (!this.supabaseClient) {
            console.warn('⚠️ Client non initialisé, réinitialisation...');
            this.initializeClient();
        }
        if (!this.supabaseClient) {
            console.error('❌ Client toujours non disponible après réinitialisation');
            throw new Error('Supabase client non disponible. Vérifiez votre configuration .env');
        }
        return this.supabaseClient;
    }
    from(table) {
        return this.getClient().from(table);
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map