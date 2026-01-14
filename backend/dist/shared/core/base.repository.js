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
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findById(id);
        });
    }
    findByIdLean(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findById(id).lean();
        });
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne(filter);
        });
    }
    findOneLean(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne(filter).lean();
        });
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            return this.model.find(filter);
        });
    }
    findAllLean() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            return this.model.find(filter).lean();
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new this.model(data).save();
        });
    }
    insertMany(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.model.insertMany(data));
        });
    }
    findByIdAndUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(id, data, { new: true });
        });
    }
    updateOne(filter, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOneAndUpdate(filter, update, { new: true });
        });
    }
    updateMany(filter, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.updateMany(filter, update);
            return result.modifiedCount;
        });
    }
    findByIdAndDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndDelete(id);
        });
    }
    deleteOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.deleteOne(filter);
            return result.deletedCount > 0;
        });
    }
    deleteMany(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.deleteMany(filter);
            return result.deletedCount;
        });
    }
    countDocuments() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            return this.model.countDocuments(filter);
        });
    }
    paginate() {
        return __awaiter(this, arguments, void 0, function* (filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) {
            const skip = (page - 1) * limit;
            const [data, total] = yield Promise.all([
                this.model.find(filter).sort(sort).skip(skip).limit(limit).lean(),
                this.countDocuments(filter),
            ]);
            return { data, total };
        });
    }
}
exports.BaseRepository = BaseRepository;
