import { ChallengeDomainIF } from "../shared/types/challenge.types";

export interface PublicChallengeDTO {
  _id: string;
  title: string;
  description: string;
  instructions: string;
  type: "code" | "cipher";
  level: "novice" | "adept" | "master";
  testCases: {
    input: any[];
    output: any;
    isHidden?: boolean;
  }[];
  timeLimit: number;
  tags: string[];
  hints: string[];
  requiredSkills: string[];
  isPremium: boolean;
  isKeyRequired: boolean;
  functionSignature?: string;
  initialCode?: string | { [language: string]: string };
  solutionCode?: string | { [language: string]: string };
  status: "active" | "inactive" | "draft" | "archived";
  isActive: boolean;
  startTime?: Date;
  endTime?: Date;
  xpRewards: number;
  createdAt?: Date;
}



export const toPublicChallengeDTO = (item: ChallengeDomainIF): PublicChallengeDTO => {
  return {
    _id: item._id ? item._id.toString() : "",
    title: item.title,
    description: item.description,
    instructions: item.instructions,
    type: item.type,
    level: item.level,
    testCases: item.testCases,
    timeLimit: item.timeLimit,
    tags: item.tags,
    hints: item.hints,
    requiredSkills: item.requiredSkills,
    isPremium: item.isPremium,
    isKeyRequired: item.isKeyRequired,
    functionSignature: item.functionSignature,
    initialCode: item.initialCode,
    solutionCode: item.solutionCode,
    status: item.status,
    isActive: item.isActive,
    startTime: item.startTime,
    endTime: item.endTime,
    xpRewards: item.xpRewards,
    createdAt: item.createdAt,
  };
};

export const toPublicChallengeDTOs = (items: ChallengeDomainIF[]): PublicChallengeDTO[] => {
  return items.map(toPublicChallengeDTO);
};