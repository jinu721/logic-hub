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
exports.AvatarRepository = void 0;
const avatar_model_1 = require("../../inventory/models/avatar.model");
class AvatarRepository {
    constructor() {
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield avatar_model_1.AvatarModel.create(data);
        });
    }
    getAll(query, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield avatar_model_1.AvatarModel.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ _id: -1 })
                .lean();
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield avatar_model_1.AvatarModel.findById(id).lean();
        });
    }
    update(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield avatar_model_1.AvatarModel.findByIdAndUpdate(id, update, { new: true });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield avatar_model_1.AvatarModel.findByIdAndDelete(id);
            return !!result;
        });
    }
}
exports.AvatarRepository = AvatarRepository;
