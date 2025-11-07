import { ILevelService, PublicLevelDTO, toPublicLevelDTO, toPublicLevelDTOs } from "@modules/level";
import { ILevelRepository } from "@modules/level";
import { IUserRepository } from "@modules/user";
import { LevelIF, UserIF } from "@shared/types";

export class LevelService implements ILevelService {
  constructor(
    private _levelRepo: ILevelRepository,
    private _userRepo: IUserRepository
  ) {}

  async createLevel(data: LevelIF): Promise<PublicLevelDTO> {
    const isExist = await this._levelRepo.getLevelByLevel(data.levelNumber);
    if (isExist) {
      throw new Error("Level already exists with this level number");
    }
    const level = await this._levelRepo.createLevel(data);
    return toPublicLevelDTO(level);
  }

  async getLevelById(id: string): Promise<PublicLevelDTO | null> {
    const level = await this._levelRepo.getLevelById(id);
    return toPublicLevelDTO(level as LevelIF);
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
    data: Partial<LevelIF>
  ): Promise<PublicLevelDTO | null> {
    if (data.levelNumber !== undefined) {
      const isExist = await this._levelRepo.findOne({
        levelNumber: data.levelNumber,
        _id: { $ne: id },
      });

      if (isExist) {
        throw new Error("Level already exists with this level number");
      }
    }

    const updated = await this._levelRepo.updateLevel(id, data);
    return toPublicLevelDTO(updated as LevelIF);
  }

  async getLevelByLevel(level: number): Promise<PublicLevelDTO | null> {
    const result = await this._levelRepo.getLevelByLevel(level);
    return toPublicLevelDTO(result as LevelIF);
  }

  async deleteLevel(id: string): Promise<PublicLevelDTO | null> {
    const deleted = await this._levelRepo.deleteLevel(id);
    return toPublicLevelDTO(deleted as LevelIF);
  }

  async getLevelByXP(xp: number): Promise<PublicLevelDTO | null> {
    const level = await this._levelRepo.getLevelByXP(xp);
    return toPublicLevelDTO(level as LevelIF);
  }

  async updateUserLevel(
    userId: string,
    gainedXP: number
  ): Promise<{ levelUpdated: boolean; reward?: string }> {
    const user: UserIF | null = await this._userRepo.getUserById(userId);
    if (!user) throw new Error("User not found");

    const newXP = user.stats.xpPoints + gainedXP;
    let newLevel = user.stats.level;

    const level = (await this.getLevelByXP(newXP)) as any;
    if (level) {
      newLevel = level.level;
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
