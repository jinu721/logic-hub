import { LevelModel, ILevelRepository } from "@modules/level";
import { BaseRepository } from "@core";
import { LevelIF } from "@shared/types";
;

export class LevelRepository extends BaseRepository<LevelIF> implements ILevelRepository {
    constructor() {
        super(LevelModel);
    }

    async createLevel(data: LevelIF): Promise<LevelIF> {
        return await this.model.create(data);
    }

    async getLevelById(id: string): Promise<LevelIF | null> {
        return await this.model.findById(id);
    }

    async getAllLevels(skip: number, limit:number): Promise<LevelIF[]> {
        return await this.model.find().skip(skip).limit(limit).sort({levelNumber:-1});
    }

    async countAllLevels(): Promise<number> {
        return await this.model.countDocuments();
    }

    async updateLevel(id: string, data: Partial<LevelIF>): Promise<LevelIF | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteLevel(id: string): Promise<LevelIF | null> {
        return await this.model.findByIdAndDelete(id);
    }

    async getLevelByXP(xp: number): Promise<LevelIF | null> {
        return await this.model.findOne({ requiredXP: { $lte: xp } }).sort({ levelNumber: -1 });
    }

    async getLevelByLevel(level: number): Promise<LevelIF | null> {
        return await this.model.findOne({ levelNumber: level });
    }
    
}
