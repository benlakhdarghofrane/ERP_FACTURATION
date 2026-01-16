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
exports.ClientsController = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../database/supabase.service");
let ClientsController = class ClientsController {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async findAll() {
        try {
            const { data, error } = await this.supabaseService
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            return {
                success: true,
                data: data || [],
                count: data?.length || 0
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async findOne(id) {
        try {
            const { data, error } = await this.supabaseService
                .from('clients')
                .select('*')
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
                error: 'Client not found'
            };
        }
    }
    async create(clientData) {
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
        }
        catch (error) {
            console.error('Create error:', error);
            return {
                success: false,
                error: error.message || 'Erreur lors de la création'
            };
        }
    }
    async update(id, clientData) {
        try {
            const { data, error } = await this.supabaseService
                .from('clients')
                .update(clientData)
                .eq('id', id)
                .select();
            if (error)
                throw error;
            return {
                success: true,
                data: data[0],
                message: 'Client mis à jour avec succès'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async remove(id) {
        try {
            const { error } = await this.supabaseService
                .from('clients')
                .delete()
                .eq('id', id);
            if (error)
                throw error;
            return {
                success: true,
                message: 'Client supprimé avec succès'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
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
            if (error)
                throw error;
            return {
                success: true,
                data: data[0],
                message: 'Client de test créé'
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
exports.ClientsController = ClientsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "createTestClient", null);
exports.ClientsController = ClientsController = __decorate([
    (0, common_1.Controller)('clients'),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ClientsController);
//# sourceMappingURL=clients.controller.js.map