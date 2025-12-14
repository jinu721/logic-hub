import { PublicUserDTO } from "@modules/user/dtos";
import { PublicChallengeDTO } from "@modules/challenge/dtos";

export interface PublicSolutionDTO {
  _id: string;
  user: PublicUserDTO | string; 
  challenge: PublicChallengeDTO | string;
  title: string;
  content: string;
  codeSnippet?: string | null;
  language?: string | null;
  likes: string[];
  likesCount: number;
  comments: {
    _id?: string;
    user: PublicUserDTO | string;
    content: string;
    commentedAt: Date;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
