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
exports.ChallengeRepository = void 0;
const challenge_1 = require("../../challenge");
const _core_1 = require("../../../shared/core");
class ChallengeRepository extends _core_1.BaseRepository {
    constructor() {
        super(challenge_1.ChallengeModel);
    }
    createChallenge(challengeData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create(challengeData);
        });
    }
    getChallengeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findById(id);
        });
    }
    getChallenges(query, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find(query).skip(skip).limit(limit).sort({ _id: -1 });
        });
    }
    updateChallenge(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(id, updateData, { new: true });
        });
    }
    deleteChallenge(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findByIdAndDelete(id);
            return result !== null;
        });
    }
    getAllChallenges(search, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({ title: { $regex: search, $options: "i" } }).skip(skip).limit(limit).sort({ _id: -1 });
        });
    }
    countAllChallenges(search) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.countDocuments({ title: { $regex: search, $options: "i" } });
        });
    }
}
exports.ChallengeRepository = ChallengeRepository;
