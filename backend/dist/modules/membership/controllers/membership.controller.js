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
exports.MembershipController = void 0;
const dtos_1 = require("../../membership/dtos");
const http_status_1 = require("../../../shared/constants/http.status");
const application_1 = require("../../../shared/utils/application");
class MembershipController {
    constructor(_membershipSvc) {
        this._membershipSvc = _membershipSvc;
        this.createMembership = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.CreateMembershipDto.from(req.body);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, ((_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", ")) || "Validation failed");
            }
            const result = yield this._membershipSvc.createPlan(dto);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.CREATED, result, "Membership created successfully");
        }));
        this.getAllMemberships = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.GetAllMembershipsDto.from(req.query);
            const validation = dto.validate();
            if (!validation.valid) {
                const errors = validation.errors || [];
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, errors.join(", ") || "Validation failed");
            }
            const search = dto.search || "";
            const page = dto.page ? Number(dto.page) : 1;
            const limit = dto.limit ? Number(dto.limit) : 10;
            const result = yield this._membershipSvc.getAllPlans(search, page, limit);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result, "Memberships fetched successfully");
        }));
        this.getTwoActiveMemberships = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this._membershipSvc.getTwoActivePlans();
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result, "Active memberships fetched successfully");
        }));
        this.getMembershipById = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.GetMembershipDto.from(req.params);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, ((_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", ")) || "Validation failed");
            }
            const result = yield this._membershipSvc.getPlanById(dto.id);
            if (!result) {
                throw new application_1.AppError(http_status_1.HttpStatus.NOT_FOUND, "Membership not found");
            }
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result, "Membership fetched successfully");
        }));
        this.updateMembership = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.UpdateMembershipDto.from(Object.assign({ id: req.params.id }, req.body));
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, ((_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", ")) || "Validation failed");
            }
            const result = yield this._membershipSvc.updatePlan(dto.id, dto);
            if (!result) {
                throw new application_1.AppError(http_status_1.HttpStatus.NOT_FOUND, "Membership not found");
            }
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result, "Membership updated successfully");
        }));
        this.deleteMembership = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.DeleteMembershipDto.from(req.params);
            const validation = dto.validate();
            if (!validation.valid) {
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, ((_a = validation.errors) === null || _a === void 0 ? void 0 : _a.join(", ")) || "Validation failed");
            }
            const result = yield this._membershipSvc.deletePlan(dto.id);
            if (!result) {
                throw new application_1.AppError(http_status_1.HttpStatus.NOT_FOUND, "Membership not found");
            }
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, null, "Membership deleted successfully");
        }));
    }
}
exports.MembershipController = MembershipController;
