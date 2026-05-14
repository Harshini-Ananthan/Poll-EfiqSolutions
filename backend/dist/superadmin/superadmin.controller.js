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
exports.SuperadminController = void 0;
const common_1 = require("@nestjs/common");
const superadmin_service_1 = require("./superadmin.service");
const firebase_auth_guard_1 = require("../auth/guards/firebase-auth.guard");
let SuperadminController = class SuperadminController {
    superadminService;
    constructor(superadminService) {
        this.superadminService = superadminService;
    }
    async getStats(req) {
        return this.superadminService.getDashboardStats(req.user.organizationId);
    }
    async getUsers(req) {
        return this.superadminService.getOrganizationUsers(req.user.organizationId);
    }
};
exports.SuperadminController = SuperadminController;
__decorate([
    (0, common_1.Get)('dashboard-stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuperadminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuperadminController.prototype, "getUsers", null);
exports.SuperadminController = SuperadminController = __decorate([
    (0, common_1.Controller)('superadmin'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __metadata("design:paramtypes", [superadmin_service_1.SuperadminService])
], SuperadminController);
//# sourceMappingURL=superadmin.controller.js.map