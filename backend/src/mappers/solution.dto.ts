import { SolutionIF } from "../shared/types/solutions.types";
import { PublicChallengeDTO } from "./challenge.dto";
import { PublicUserDTO, toPublicUserDTO } from "./user.dto";

export interface PublicSolutionDTO {
  _id: string;
  user: PublicUserDTO; 
  challenge: PublicChallengeDTO;
  title: string;
  content: string;
  codeSnippet?: string | null;
  language?: string | null;
  likes: string[];
  likesCount: number;
  comments: {
    _id?: string;
    user: PublicUserDTO;
    content: string;
    commentedAt: Date;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}



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