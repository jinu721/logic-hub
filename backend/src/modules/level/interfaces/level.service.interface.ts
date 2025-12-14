import { PublicLevelDTO } from "@modules/level/dtos";
import { LevelDocument } from "@shared/types";

export interface ILevelService {
    createLevel(data: LevelDocument): Promise<PublicLevelDTO>;
    getLevelById(id: string): Promise<PublicLevelDTO | null>;
    getAllLevels(page: number, limit: number): Promise<{ levels: PublicLevelDTO[], totalItems: number }>;
    updateLevel(id: string, data: Partial<LevelDocument>): Promise<PublicLevelDTO | null>;
    deleteLevel(id: string): Promise<PublicLevelDTO | null>;
    getLevelByXP(xp: number): Promise<PublicLevelDTO | null>;
    getLevelByLevel(level: number): Promise<PublicLevelDTO | null>;
    updateUserLevel(userId: string, gainedXP: number): Promise<{ levelUpdated: boolean, reward?: string }>
}
