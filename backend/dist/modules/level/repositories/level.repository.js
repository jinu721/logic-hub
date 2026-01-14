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
exports.LevelRepository = void 0;
const level_1 = require("../../level");
const _core_1 = require("../../../shared/core");
class LevelRepository extends _core_1.BaseRepository {
    constructor() {
        super(level_1.LevelModel);
    }
    createLevel(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create(data);
        });
    }
    getLevelById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findById(id);
        });
    }
    getAllLevels(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find().skip(skip).limit(limit).sort({ levelNumber: -1 });
        });
    }
    countAllLevels() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.countDocuments();
        });
    }
    updateLevel(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(id, data, { new: true });
        });
    }
    deleteLevel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndDelete(id);
        });
    }
    getLevelByXP(xp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({ requiredXP: { $lte: xp } }).sort({ levelNumber: -1 });
        });
    }
    getLevelByLevel(level) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({ levelNumber: level });
        });
    }
}
exports.LevelRepository = LevelRepository;
