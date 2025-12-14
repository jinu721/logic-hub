import { PublicSolutionDTO, toPublicChallengeDTO } from "@modules/challenge/dtos";
import { toPublicUserDTO } from "@modules/user/dtos";
import { PopulatedSolution } from "@shared/types";


export const toPublicSolutionDTO = (solution: PopulatedSolution): PublicSolutionDTO => {
  return {
    _id: solution._id.toString(),
    user: toPublicUserDTO(solution.user),
    challenge: toPublicChallengeDTO(solution.challenge),
    title: solution.title,
    content: solution.content,
    codeSnippet: solution.codeSnippet || null,
    language: solution.language || null,
    likesCount: solution.likes?.length || 0,
    likes: solution.likes?.map(like => like.toString()) || [],
    comments: solution.comments?.map(comment => ({
      _id: comment._id.toString(),
      user: toPublicUserDTO(comment.user),
      content: comment.content,
      commentedAt: comment.commentedAt,
    })) || [],
    createdAt: solution.createdAt,
    updatedAt: solution.updatedAt,
  };
};

export const toPublicSolutionDTOs = (solutions: PopulatedSolution[]): PublicSolutionDTO[] => {
  return solutions.map(toPublicSolutionDTO);
};