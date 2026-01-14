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
exports.PurchaseCommandService = void 0;
const date_fns_1 = require("date-fns");
const _constants_1 = require("../../../shared/constants");
const purchase_1 = require("../../purchase");
const application_1 = require("../../../shared/utils/application");
const _core_1 = require("../../../shared/core");
class PurchaseCommandService extends _core_1.BaseService {
    constructor(purchaseRepo, membershipRepo, userRepo) {
        super();
        this.purchaseRepo = purchaseRepo;
        this.membershipRepo = membershipRepo;
        this.userRepo = userRepo;
    }
    toDTO(purchase) {
        return (0, purchase_1.toPublicPurchaseDTO)(purchase);
    }
    toDTOs(purchases) {
        return (0, purchase_1.toPublicPurchaseDTOs)(purchases);
    }
    createPlanPurchase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const plan = yield this.membershipRepo.getPlanById(String(data.planId));
            if (!plan) {
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Membership plan not found");
            }
            const expiresAt = plan.type === "silver" ? (0, date_fns_1.addMonths)(now, 1) : (0, date_fns_1.addYears)(now, 1);
            const purchase = yield this.purchaseRepo.createPlanPurchase(Object.assign(Object.assign({}, data), { startedAt: now, expiresAt }));
            if (!data.userId) {
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "User ID is required");
            }
            const userObjectId = (0, application_1.toObjectId)(String(data.userId));
            yield this.userRepo.updateUser(userObjectId, {
                membership: {
                    planId: String(data.planId),
                    startedAt: now,
                    expiresAt,
                    type: plan.type,
                    isActive: true,
                },
            });
            return this.toDTO(purchase);
        });
    }
}
exports.PurchaseCommandService = PurchaseCommandService;
