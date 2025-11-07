export interface PublicLevelDTO {
  _id: string;
  levelNumber: number;
  requiredXP: number;
  description: string;
  rewards: {
    type: string;
    name: string;
    rewardId: string;
    rewardDescription: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}