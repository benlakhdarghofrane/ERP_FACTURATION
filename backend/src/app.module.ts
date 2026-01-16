// Fichier: erp-facturation-pwa/backend/src/app.module.ts
// TODO: Module racine de l'application NestJS

import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FacturesModule } from './factures/factures.module';
import { DatabaseModule } from './database/database.module';
import { ClientsModule } from './clients/clients.module';
import { FacturesController } from './factures/factures.controller';
import { ClientsController } from './clients/clients.controller';


@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    FacturesModule,
    ClientsModule,
  ],
  controllers: [FacturesController, ClientsController],
  providers: [],
})
export class AppModule {}
