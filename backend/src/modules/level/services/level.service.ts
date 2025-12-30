import { ILevelService, PublicLevelDTO, toPublicLevelDTO, toPublicLevelDTOs, CreateLevelDto, UpdateLevelDto } from "@modules/level";
import { ILevelRepository } from "@modules/level";
import { IUserRepository } from "@modules/user";
import { LevelDocument, PopulatedUser, UserDocument, LevelReward } from "@shared/types";

export class LevelService implements ILevelService {
  constructor(
    private _levelRepo: ILevelRepository,
    private _userRepo: IUserRepository
  ) { }

  async createLevel(data: CreateLevelDto): Promise<PublicLevelDTO> {
    const isExist = await this._levelRepo.getLevelByLevel(data.levelNumber);
    if (isExist) {
      throw new Error("Level already exists with this level number");
    }
    
    // Convert DTO to document data
    const levelData = {
      levelNumber: data.levelNumber,
      requiredXP: data.requiredXP,
      description: data.description,
      rewards: data.rewards || []
    } as Partial<LevelDocument>;
    
    const level = await this._levelRepo.createLevel(levelData);
    return toPublicLevelDTO(level);
  }

  async getLevelById(id: string): Promise<PublicLevelDTO | null> {
    const level = await this._levelRepo.getLevelById(id);
    if (!level) return null;
    return toPublicLevelDTO(level);
  }

  async getAllLevels(
    page: number,
    limit: number
  ): Promise<{ levels: PublicLevelDTO[]; totalItems: number }> {
    const skip = (page - 1) * limit;
    const levels = await this._levelRepo.getAllLevels(skip, limit);
    const totalItems = await this._levelRepo.countAllLevels();
    return { levels: toPublicLevelDTOs(levels), totalItems };
  }

  async updateLevel(
    id: string,
    data: UpdateLevelDto
  ): Promise<PublicLevelDTO | null> {
    if (data.levelNumber !== undefined) {
      const isExist = await this._levelRepo.getLevelByLevel(data.levelNumber);
      if (isExist && String(isExist._id) !== id) {
        throw new Error("Level already exists with this level number");
      }
    }

    // Convert DTO to document data
    const updateData: Partial<LevelDocument> = {
      ...(data.levelNumber !== undefined && { levelNumber: data.levelNumber }),
      ...(data.requiredXP !== undefined && { requiredXP: data.requiredXP }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.rewards !== undefined && { rewards: data.rewards as LevelReward[] })
    };

    const updated = await this._levelRepo.updateLevel(id, updateData);
    if (!updated) return null;
    return toPublicLevelDTO(updated);
  }

  async getLevelByLevel(level: number): Promise<PublicLevelDTO | null> {
    const result = await this._levelRepo.getLevelByLevel(level);
    if (!result) return null;
    return toPublicLevelDTO(result);
  }

  async deleteLevel(id: string): Promise<PublicLevelDTO | null> {
    const deleted = await this._levelRepo.deleteLevel(id);
    if (!deleted) return null;
    return toPublicLevelDTO(deleted);
  }

  async getLevelByXP(xp: number): Promise<PublicLevelDTO | null> {
    const level = await this._levelRepo.getLevelByXP(xp);
    if (!level) return null;
    return toPublicLevelDTO(level);
  }

  async updateUserLevel(
    userId: string,
    gainedXP: number
  ): Promise<{ levelUpdated: boolean; reward?: string }> {
    const user: PopulatedUser | null = await this._userRepo.getUserById(userId);
    if (!user) throw new Error("User not found");

    const newXP = user.stats.xpPoints + gainedXP;
    let newLevel = user.stats.level;

    const level = await this.getLevelByXP(newXP);
    if (level) {
      newLevel = level.levelNumber;
    }

    if (newLevel > user.stats.level) {
      await this._userRepo.updateUserLevel(userId, newLevel);
      const reward = `Congratulations! You've leveled up to level ${newLevel}. Enjoy your reward!`;
      return { levelUpdated: true, reward };
    }

    await this._userRepo.updateUserXP(userId, newXP);
    return { levelUpdated: false };
  }
}
