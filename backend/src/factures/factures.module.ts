// Fichier: erp-facturation-pwa/backend/src/factures/factures.module.ts
// TODO: Module de gestion des factures NestJS

import { Module } from '@nestjs/common';
import { FacturesController } from './factures.controller';
import { FacturesService } from './factures.service';
import { DatabaseModule } from '../database/database.module'; // Supposé existant pour SupabaseService

@Module({
  imports: [DatabaseModule],
  controllers: [FacturesController],
  providers: [FacturesService],
})
export class FacturesModule {}
