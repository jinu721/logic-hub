"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseQueryService = void 0;
const _constants_1 = require("../../../shared/constants");
const purchase_1 = require("../../purchase");
const application_1 = require("../../../shared/utils/application");
const _core_1 = require("../../../shared/core");
class PurchaseQueryService extends _core_1.BaseService {
    constructor(purchaseRepo) {
        super();
        this.purchaseRepo = purchaseRepo;
    }
    toDTO(purchase) {
        return (0, purchase_1.toPublicPurchaseDTO)(purchase);
    }
    toDTOs(purchases) {
        return (0, purchase_1.toPublicPurchaseDTOs)(purchases);
    }
    getUserPurchases(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchases = yield this.purchaseRepo.getUserPlanPurchases(userId);
            return this.mapMany(purchases);
        });
    }
    getPlanHistoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchase = yield this.purchaseRepo.getPlanHistoryById(id);
            if (!purchase) {
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Purchase not found");
            }
            return this.mapOne(purchase);
        });
    }
    getPlanHistory(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const purchases = yield this.purchaseRepo.getPlanHistory(skip, limit);
            const totalItems = yield this.purchaseRepo.countPlanHistory();
            return {
                items: this.mapMany(purchases),
                totalItems
            };
        });
    }
}
exports.PurchaseQueryService = PurchaseQueryService;
