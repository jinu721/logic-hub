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
exports.MembershipRepository = void 0;
const _core_1 = require("../../../shared/core");
const membership_1 = require("../../membership");
class MembershipRepository extends _core_1.BaseRepository {
    constructor() {
        super(membership_1.MembershipModel);
    }
    createPlan(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create(data);
        });
    }
    getAllPlans(search, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({ name: { $regex: search, $options: "i" } }).skip(skip).limit(limit).sort({ _id: -1 });
        });
    }
    getTwoActivePlans() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({ isActive: true }).limit(2);
        });
    }
    countAllPlans(search) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.countDocuments({ name: { $regex: search, $options: "i" } });
        });
    }
    getPlanById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findById(id);
        });
    }
    updatePlan(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(id, update, { new: true });
        });
    }
    deletePlan(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findByIdAndDelete(id);
            return !!result;
        });
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne(filter);
        });
    }
    findByObjectId(id) {
        const _super = Object.create(null, {
            findById: { get: () => super.findById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.findById.call(this, id);
        });
    }
}
exports.MembershipRepository = MembershipRepository;
