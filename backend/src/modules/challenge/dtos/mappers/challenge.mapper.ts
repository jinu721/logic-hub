import { PublicChallengeDTO } from "@modules/challenge/dtos";
import { ChallengeDocument } from "@modules/challenge/models";


export const toPublicChallengeDTO = (item: ChallengeDocument): PublicChallengeDTO => {
  return {
    _id: item._id ? item._id.toString() : "",
    title: item.title,
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
    functionName: item.functionName,
    parameters: item.parameters || [],
    returnType: item.returnType,
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

export const toPublicChallengeDTOs = (items: ChallengeDocument[]): PublicChallengeDTO[] => {
  return items.map(toPublicChallengeDTO);
};