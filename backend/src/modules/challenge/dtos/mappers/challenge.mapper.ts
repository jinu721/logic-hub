import { PublicChallengeDTO } from "@modules/challenge/dtos";
import { ChallengeDomainIF } from "@shared/types";


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