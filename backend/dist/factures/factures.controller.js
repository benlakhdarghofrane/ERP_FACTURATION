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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacturesController = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../database/supabase.service");
let FacturesController = class FacturesController {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
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
        }
        catch (error) {
            return {
                success: false,
                error: 'Failed to fetch factures'
            };
        }
    }
    async findOne(id) {
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
            if (error)
                throw error;
            return {
                success: true,
                data: data
            };
        }
        catch (error) {
            return {
                success: false,
                error: 'Facture not found'
            };
        }
    }
    async create(factureData) {
        try {
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
            if (error)
                throw error;
            return {
                success: true,
                data: data[0],
                message: 'Facture créée avec succès'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async createTestData() {
        try {
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
            if (clientError)
                throw clientError;
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
            if (factureError)
                throw factureError;
            return {
                success: true,
                message: 'Données de test créées',
                client: clientData[0],
                facture: factureData[0]
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};
exports.FacturesController = FacturesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FacturesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FacturesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FacturesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('test-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FacturesController.prototype, "createTestData", null);
exports.FacturesController = FacturesController = __decorate([
    (0, common_1.Controller)('factures'),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], FacturesController);
//# sourceMappingURL=factures.controller.js.map