import { PublicLevelDTO, CreateLevelDto, UpdateLevelDto } from "@modules/level/dtos";
import { LevelDocument } from "@shared/types";

export interface ILevelService {
    createLevel(data: CreateLevelDto): Promise<PublicLevelDTO>;
    getLevelById(id: string): Promise<PublicLevelDTO | null>;
    getAllLevels(page: number, limit: number): Promise<{ levels: PublicLevelDTO[], totalItems: number }>;
    updateLevel(id: string, data: UpdateLevelDto): Promise<PublicLevelDTO | null>;
    deleteLevel(id: string): Promise<PublicLevelDTO | null>;
    getLevelByXP(xp: number): Promise<PublicLevelDTO | null>;
    getLevelByLevel(level: number): Promise<PublicLevelDTO | null>;
    updateUserLevel(userId: string, gainedXP: number): Promise<{ levelUpdated: boolean, reward?: string }>
}
