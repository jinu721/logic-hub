import { LevelDocument } from "@shared/types";

export interface ILevelRepository {
    createLevel(data: Partial<LevelDocument>): Promise<LevelDocument>;
    getLevelById(id: string): Promise<LevelDocument | null>;
    getAllLevels(skip: number, limit: number): Promise<LevelDocument[]>;
    countAllLevels(): Promise<number>;
    updateLevel(id: string, data: Partial<LevelDocument>): Promise<LevelDocument | null>;
    deleteLevel(id: string): Promise<LevelDocument | null>;
    getLevelByXP(xp: number): Promise<LevelDocument | null>;
    getLevelByLevel(level: number): Promise<LevelDocument | null>;
}
