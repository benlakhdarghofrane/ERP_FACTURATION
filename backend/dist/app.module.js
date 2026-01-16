"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const factures_module_1 = require("./factures/factures.module");
const database_module_1 = require("./database/database.module");
const clients_module_1 = require("./clients/clients.module");
const factures_controller_1 = require("./factures/factures.controller");
const clients_controller_1 = require("./clients/clients.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            factures_module_1.FacturesModule,
            clients_module_1.ClientsModule,
        ],
        controllers: [factures_controller_1.FacturesController, clients_controller_1.ClientsController],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map