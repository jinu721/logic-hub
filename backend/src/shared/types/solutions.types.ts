import { Document, Types } from "mongoose";
import { PopulatedUser } from "./user.types";
import { ChallengeDocument } from "./challenge.types";

export interface CommentBase {
  _id: Types.ObjectId;
  content: string;
  commentedAt: Date;
}

export interface CommentRaw extends CommentBase {
  user: Types.ObjectId;
}

export interface CommentPopulated extends CommentBase {
  user: PopulatedUser;
}

export interface SolutionBase {
  title: string;
  content: string;
  implementations: {
    language: string;
    codeSnippet: string;
  }[];
  likes: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SolutionRaw extends SolutionBase {
  user: Types.ObjectId;
  challenge: Types.ObjectId;
  comments: CommentRaw[];
}

export interface PopulatedSolution extends SolutionBase {
  _id: Types.ObjectId;
  user: PopulatedUser;
  challenge: ChallengeDocument;
  comments: CommentPopulated[];
}

export interface SolutionDocument extends SolutionRaw, Document { }

export interface CreateSolutionInput {
  user: string;
  challenge: string;
  title: string;
  content: string;
  implementations: {
    language: string;
    codeSnippet: string;
  }[];
}

export interface SolutionUpdatePayload {
  title?: string;
  content?: string;
  codeSnippet?: string;
  language?: string;
}

export interface UpdateSolutionInput {
  title?: string;
  content?: string;
  implementations?: {
    language: string;
    codeSnippet: string;
  }[];
}

export interface SolutionQuery {
  challenge: string | Types.ObjectId;
  $or?: {
    title?: { $regex: string; $options: string };
    content?: { $regex: string; $options: string };
  }[];
}

export type SolutionSortOption =
  | { likes: -1 }
  | { createdAt: -1 }
  | { commentsCount: -1 }
  | {}; 
