
import { LevelIF } from "@shared/types";

export interface ILevelRepository {
    createLevel(data: LevelIF): Promise<LevelIF>;
    getLevelById(id: string): Promise<LevelIF | null>;
    getAllLevels(skip: number, limit:number): Promise<LevelIF[]>;
    countAllLevels(): Promise<number>;
    updateLevel(id: string, data: Partial<LevelIF>): Promise<LevelIF | null>;
    deleteLevel(id: string): Promise<LevelIF | null>;
    getLevelByXP(xp: number): Promise<LevelIF | null>;
    getLevelByLevel(level: number): Promise<LevelIF | null>;
}
