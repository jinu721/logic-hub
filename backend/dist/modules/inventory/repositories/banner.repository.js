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
exports.BannerRepository = void 0;
const inventory_1 = require("../../inventory");
class BannerRepository {
    constructor() {
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield inventory_1.BannerModel.create(data);
        });
    }
    getAll(query, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield inventory_1.BannerModel.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ _id: -1 })
                .lean();
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield inventory_1.BannerModel.findById(id).lean();
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield inventory_1.BannerModel.findByIdAndUpdate(id, data, { new: true });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield inventory_1.BannerModel.findByIdAndDelete(id);
            return !!result;
        });
    }
}
exports.BannerRepository = BannerRepository;
