
import { ILevelService } from "../interfaces/level.service.interface";
import { LevelRepository } from "../../repository/implements/level.repository";
import { UserRepository } from "../../repository/implements/user.repository";
import { LevelIF } from "../../types/level.types";
import { UserIF } from "../../types/user.types";
import { PublicLevelDTO, toPublicLevelDTO, toPublicLevelDTOs } from "../../mappers/level.dto";

export class LevelService implements ILevelService {
    private levelRepository: LevelRepository;
    private userRepository: UserRepository;

    constructor(levelRepo:LevelRepository,userRepo:UserRepository) {
        this.levelRepository = levelRepo;
        this.userRepository = userRepo;
    }

    async createLevel(data: LevelIF): Promise<PublicLevelDTO> {
        const isExist = await this.levelRepository.getLevelByLevel(data.levelNumber);
        if(isExist){
            throw new Error("Level already exists with this level number");
        }
        const level = await this.levelRepository.createLevel(data);
        return toPublicLevelDTO(level);
    }

    async getLevelById(id: string): Promise<PublicLevelDTO | null> {
        const level = await this.levelRepository.getLevelById(id);
        return toPublicLevelDTO(level as LevelIF);
    }

    async getAllLevels(page: number, limit: number): Promise<{levels:PublicLevelDTO[],totalItems:number}> {
        const skip = (page - 1) * limit;
        const levels = await this.levelRepository.getAllLevels(skip,limit);
        const totalItems = await this.levelRepository.countAllLevels();
        return {levels:toPublicLevelDTOs(levels),totalItems};
    }

    async updateLevel(id: string, data: Partial<LevelIF>): Promise<PublicLevelDTO | null> {
        if (data.levelNumber !== undefined) {
            const isExist = await this.levelRepository.findOne({
                levelNumber: data.levelNumber,
                _id: { $ne: id }
            });
    
            if (isExist) {
                throw new Error("Level already exists with this level number");
            }
        }
    
        const updated = await this.levelRepository.updateLevel(id, data);
        return toPublicLevelDTO(updated as LevelIF);
    }
    

    async getLevelByLevel (level: number): Promise<PublicLevelDTO | null> {
        const result = await this.levelRepository.getLevelByLevel(level);
        return toPublicLevelDTO(result as LevelIF);
    }

    async deleteLevel(id: string): Promise<PublicLevelDTO | null> {
        const deleted = await this.levelRepository.deleteLevel(id);
        return toPublicLevelDTO(deleted as LevelIF);
    }

    async getLevelByXP(xp: number): Promise<PublicLevelDTO | null> {
        const level = await this.levelRepository.getLevelByXP(xp);
        return toPublicLevelDTO(level as LevelIF);
    }

    async updateUserLevel(userId: string, gainedXP: number): Promise<{ levelUpdated: boolean, reward?: string }> {
        const user: UserIF | null = await this.userRepository.getUserById(userId);
        if (!user) throw new Error("User not found");

        const newXP = user.stats.xpPoints + gainedXP;
        let newLevel = user.stats.level;

        const level = await this.getLevelByXP(newXP) as any;
        if (level) {
            newLevel = level.level;  
        }

        if (newLevel > user.stats.level) {
            await this.userRepository.updateUserLevel(userId, newLevel);
            const reward = `Congratulations! You've leveled up to level ${newLevel}. Enjoy your reward!`;
            return { levelUpdated: true, reward };
        }

        await this.userRepository.updateUserXP(userId, newXP);
        return { levelUpdated: false };
    }
}
