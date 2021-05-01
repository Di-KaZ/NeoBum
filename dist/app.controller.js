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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const dist_1 = require("nest-neo4j/dist");
const index_svlete_1 = require("../pages/index.svlete");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    constructor(appService, neo4jService) {
        this.appService = appService;
        this.neo4jService = neo4jService;
    }
    async getHello() {
        const res = await this.neo4jService.read('MATCH (n) RETURN count(n) AS count');
        return index_svlete_1.default;
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHello", null);
AppController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        dist_1.Neo4jService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map