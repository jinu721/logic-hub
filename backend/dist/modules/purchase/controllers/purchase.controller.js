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
exports.PurchaseController = void 0;
const http_status_1 = require("../../../shared/constants/http.status");
const dtos_1 = require("../../purchase/dtos");
const application_1 = require("../../../shared/utils/application");
class PurchaseController {
    constructor(paymentSvc, commandSvc, querySvc) {
        this.paymentSvc = paymentSvc;
        this.commandSvc = commandSvc;
        this.querySvc = querySvc;
        this.createOrder = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.CreateOrderDto.from(req.body);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const order = yield this.paymentSvc.createOrder(dto.amount);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, order, "Order created successfully");
        }));
        this.createMembershipPurchase = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const dto = dtos_1.CreateMembershipPurchaseDto.from(req.body);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                throw new application_1.AppError(http_status_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            }
            this.paymentSvc.verifySignature(dto.razorpayOrderId, dto.razorpayPaymentId, dto.razorpaySignature);
            const purchase = yield this.commandSvc.createPlanPurchase({
                userId: (0, application_1.toObjectId)(userId),
                planId: (0, application_1.toObjectId)(dto.planId),
                amount: dto.amount,
                razorpayOrderId: dto.razorpayOrderId,
                razorpayPaymentId: dto.razorpayPaymentId,
                razorpaySignature: dto.razorpaySignature,
                status: "Success",
            });
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.CREATED, purchase, "Membership purchase created successfully");
        }));
        this.getUserMembershipHistory = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.GetUserMembershipHistoryDto.from(req.params);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const purchases = yield this.querySvc.getUserPurchases(dto.userId);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, purchases, "Membership history fetched successfully");
        }));
        this.getPlanHistoryById = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.GetPlanHistoryByIdDto.from(req.params);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const purchase = yield this.querySvc.getPlanHistoryById(dto.id);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, purchase, "Membership history fetched successfully");
        }));
        this.getPlanHistory = (0, application_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = dtos_1.GetPlanHistoryDto.from(req.query);
            const valid = dto.validate();
            if (!valid.valid)
                throw new application_1.AppError(http_status_1.HttpStatus.BAD_REQUEST, valid.errors.join(","));
            const page = dto.page ? Number(dto.page) : 1;
            const limit = dto.limit ? Number(dto.limit) : 10;
            const result = yield this.querySvc.getPlanHistory(page, limit);
            (0, application_1.sendSuccess)(res, http_status_1.HttpStatus.OK, result, "Membership history fetched successfully");
        }));
    }
}
exports.PurchaseController = PurchaseController;
