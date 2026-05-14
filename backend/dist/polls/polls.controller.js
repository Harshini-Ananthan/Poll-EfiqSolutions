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
exports.PollsController = void 0;
const common_1 = require("@nestjs/common");
const polls_service_1 = require("./polls.service");
const create_poll_dto_1 = require("./dto/create-poll.dto");
const firebase_auth_guard_1 = require("../auth/guards/firebase-auth.guard");
let PollsController = class PollsController {
    pollsService;
    constructor(pollsService) {
        this.pollsService = pollsService;
    }
    create(createPollDto, req) {
        return this.pollsService.create(createPollDto, req.user.id, req.user.organizationId);
    }
    findAll(req) {
        return this.pollsService.findAll(req.user.organizationId);
    }
    findOne(id) {
        return this.pollsService.findOne(id);
    }
    remove(id) {
        return this.pollsService.remove(id);
    }
};
exports.PollsController = PollsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_poll_dto_1.CreatePollDto, Object]),
    __metadata("design:returntype", void 0)
], PollsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PollsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PollsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PollsController.prototype, "remove", null);
exports.PollsController = PollsController = __decorate([
    (0, common_1.Controller)('polls'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __metadata("design:paramtypes", [polls_service_1.PollsService])
], PollsController);
//# sourceMappingURL=polls.controller.js.map