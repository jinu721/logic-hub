import { PublicSolutionDTO } from "@modules/challenge/dtos";
import { ChallengeDocument, SolutionDocument } from "@modules/challenge/models";
import { toPublicUserDTO } from "@modules/user/dtos";
import { UserDocument } from "@modules/user/models";


export const toPublicSolutionDTO = (solution: SolutionDocument): PublicSolutionDTO => {
  return {
    _id: solution._id ? solution._id.toString() : '',
    user: toPublicUserDTO(solution.user as UserDocument),
    challenge: solution.challenge as ChallengeDocument,
    title: solution.title,
    content: solution.content,
    codeSnippet: solution.codeSnippet || null,
    language: solution.language || null,
    likesCount: solution.likes?.length || 0,
    likes: solution.likes?.map(like => like.toString()) || [],
    comments: solution.comments?.map(comment => ({
      _id: comment._id?.toString(),
      user: toPublicUserDTO(comment.user as UserDocument),
      content: comment.content,
      commentedAt: comment.commentedAt,
    })) || [],
    createdAt: solution.createdAt,
    updatedAt: solution.updatedAt,
  };
};

export const toPublicSolutionDTOs = (solutions: SolutionDocument[]): PublicSolutionDTO[] => {
  return solutions.map(toPublicSolutionDTO);
};