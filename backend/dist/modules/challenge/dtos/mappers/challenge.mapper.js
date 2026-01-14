"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicChallengeDTOs = exports.toPublicChallengeDTO = void 0;
const toPublicChallengeDTO = (item) => {
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
exports.toPublicChallengeDTO = toPublicChallengeDTO;
const toPublicChallengeDTOs = (items) => {
    return items.map(exports.toPublicChallengeDTO);
};
exports.toPublicChallengeDTOs = toPublicChallengeDTOs;
