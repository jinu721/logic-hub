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
exports.MembershipService = void 0;
const membership_1 = require("../../membership");
const _constants_1 = require("../../../shared/constants");
const application_1 = require("../../../shared/utils/application");
const _core_1 = require("../../../shared/core");
class MembershipService extends _core_1.BaseService {
    constructor(membershipRepo) {
        super();
        this.membershipRepo = membershipRepo;
    }
    toDTO(plan) {
        return (0, membership_1.toPublicMembershipDTO)(plan);
    }
    toDTOs(plans) {
        return (0, membership_1.toPublicMembershipDTOs)(plans);
    }
    createPlan(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Convert DTO to document data
            const planData = {
                name: data.name,
                price: data.price,
                description: data.description,
                type: data.type,
                isActive: data.isActive,
                isFeatured: data.isFeatured,
                features: data.features,
                discount: data.discount
            };
            const plan = yield this.membershipRepo.createPlan(planData);
            return this.mapOne(plan);
        });
    }
    getAllPlans(search, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const plans = yield this.membershipRepo.getAllPlans(search, skip, limit);
            const totalItems = yield this.membershipRepo.countAllPlans(search);
            return { items: this.mapMany(plans), totalItems };
        });
    }
    getTwoActivePlans() {
        return __awaiter(this, void 0, void 0, function* () {
            const plans = yield this.membershipRepo.getTwoActivePlans();
            return this.mapMany(plans);
        });
    }
    getPlanById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield this.membershipRepo.getPlanById(id);
            if (!plan) {
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Membership not found");
            }
            return this.mapOne(plan);
        });
    }
    updatePlan(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.name) {
                const exists = yield this.membershipRepo.findOne({
                    name: data.name,
                    _id: { $ne: id }
                });
                if (exists) {
                    throw new application_1.AppError(_constants_1.HttpStatus.CONFLICT, "Membership already exists");
                }
            }
            // Convert DTO to document data with proper type handling
            const updateData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (data.name && { name: data.name })), (data.price && { price: data.price })), (data.description && { description: data.description })), (data.type && { type: data.type })), (data.isActive !== undefined && { isActive: data.isActive })), (data.isFeatured !== undefined && { isFeatured: data.isFeatured })), (data.features && { features: data.features })), (data.discount !== undefined && { discount: data.discount || undefined }));
            const updated = yield this.membershipRepo.updatePlan(id, updateData);
            if (!updated) {
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Membership not found");
            }
            return this.mapOne(updated);
        });
    }
    deletePlan(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.membershipRepo.deletePlan(id);
            if (!deleted) {
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Membership not found");
            }
            return true;
        });
    }
}
exports.MembershipService = MembershipService;
