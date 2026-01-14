"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.PurchasePaymentService = void 0;
const _constants_1 = require("../../../shared/constants");
const crypto = __importStar(require("crypto"));
const application_1 = require("../../../shared/utils/application");
const env_1 = require("../../../config/env");
class PurchasePaymentService {
    constructor(razorpayInstance, secretKey) {
        this.razorpayInstance = razorpayInstance;
        this.secretKey = secretKey;
    }
    createOrder(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                amount: amount * 100,
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
            };
            const order = yield this.razorpayInstance.orders.create(options);
            return {
                orderId: order.id,
                amount: Number(order.amount),
                currency: order.currency,
                key: env_1.env.RAZORPAY_KEY_ID
            };
        });
    }
    verifySignature(orderId, paymentId, signature) {
        const body = `${orderId}|${paymentId}`;
        const expectedSignature = crypto
            .createHmac("sha256", this.secretKey)
            .update(body)
            .digest("hex");
        if (expectedSignature !== signature) {
            throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Invalid payment signature");
        }
        return true;
    }
}
exports.PurchasePaymentService = PurchasePaymentService;
