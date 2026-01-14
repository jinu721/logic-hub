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
exports.PurchaseRepository = void 0;
const purchase_1 = require("../../purchase");
const _core_1 = require("../../../shared/core");
class PurchaseRepository extends _core_1.BaseRepository {
    constructor() {
        super(purchase_1.PurchaseModel);
    }
    createPlanPurchase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create(data);
        });
    }
    getUserPlanPurchases(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({ userId }).populate("planId").populate("userId");
        });
    }
    getPlanHistoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findById(id).populate("planId").populate("userId");
        });
    }
    getPlanHistory(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.find().skip(skip).limit(limit).sort({ createdAt: -1 }).populate("planId").populate("userId");
        });
    }
    countPlanHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.countDocuments();
        });
    }
}
exports.PurchaseRepository = PurchaseRepository;
