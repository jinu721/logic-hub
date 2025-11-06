import { SolutionIF } from "@shared/types";
import { PublicSolutionDTO } from "@modules/challenge/dtos";
import { toPublicUserDTO } from "@modules/user/dtos";


export const toPublicSolutionDTO = (solution: SolutionIF): PublicSolutionDTO => {
  return {
    _id: solution._id ? solution._id.toString() : '',
    user: toPublicUserDTO(solution.user as any),
    challenge: solution.challenge as any,
    title: solution.title,
    content: solution.content,
    codeSnippet: solution.codeSnippet || null,
    language: solution.language || null,
    likesCount: solution.likes?.length || 0,
    likes: solution.likes?.map(like => like.toString()) || [],
    comments: solution.comments?.map(comment => ({
      _id: comment._id?.toString(),
      user: toPublicUserDTO(comment.user as any),
      content: comment.content,
      commentedAt: comment.commentedAt,
    })) || [],
    createdAt: solution.createdAt,
    updatedAt: solution.updatedAt,
  };
};

export const toPublicSolutionDTOs = (solutions: SolutionIF[]): PublicSolutionDTO[] => {
  return solutions.map(toPublicSolutionDTO);
};