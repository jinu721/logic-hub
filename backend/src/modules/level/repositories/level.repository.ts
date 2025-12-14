import { LevelModel, ILevelRepository } from "@modules/level";
import { BaseRepository } from "@core";
import { LevelDocument } from "@shared/types";

export class LevelRepository extends BaseRepository<LevelDocument> implements ILevelRepository {
    constructor() {
        super(LevelModel);
    }

    async createLevel(data: LevelDocument): Promise<LevelDocument> {
        return await this.model.create(data);
    }

    async getLevelById(id: string): Promise<LevelDocument | null> {
        return await this.model.findById(id);
    }

    async getAllLevels(skip: number, limit: number): Promise<LevelDocument[]> {
        return await this.model.find().skip(skip).limit(limit).sort({ levelNumber: -1 });
    }

    async countAllLevels(): Promise<number> {
        return await this.model.countDocuments();
    }

    async updateLevel(id: string, data: Partial<LevelDocument>): Promise<LevelDocument | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteLevel(id: string): Promise<LevelDocument | null> {
        return await this.model.findByIdAndDelete(id);
    }

    async getLevelByXP(xp: number): Promise<LevelDocument | null> {
        return await this.model.findOne({ requiredXP: { $lte: xp } }).sort({ levelNumber: -1 });
    }

    async getLevelByLevel(level: number): Promise<LevelDocument | null> {
        return await this.model.findOne({ levelNumber: level });
    }

}
