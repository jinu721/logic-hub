export interface LevelReward {
  type: string;
  name: string;
  rewardId: string;
  rewardDescription: string;
}

export interface LevelIF {
  _id?: string;
  levelNumber: number;
  requiredXP: number;
  rewards: LevelReward[];
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
