import { Document } from "mongoose";
import { Types } from "mongoose";

export interface CommentSolutionIF extends Document {
    user: Types.ObjectId;
    content: string;
    commentedAt: Date;
}

export interface SolutionAttrs {
  user: Types.ObjectId;
  challenge: Types.ObjectId;
  title: string;
  content: string;
  codeSnippet?: string;
  language?: string;
  likes?: Types.ObjectId[];
  comments?: CommentSolutionIF[];
  createdAt?: Date;
  updatedAt?: Date;
}


export interface SolutionDocument extends SolutionAttrs, Document {}


export interface CreateSolutionInput {
  user: string;
  challenge: string;
  title: string;
  content: string;
  codeSnippet?: string;
  language?: string;
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

  


  export interface UserPopulated {
  _id: Types.ObjectId;
  username: string;
  avatar?: string;
}

export interface CommentPopulated {
  _id: Types.ObjectId;
  content: string;
  user: UserPopulated;
  commentedAt: Date;
}

export interface SolutionWithUser extends Document {
  _id: Types.ObjectId;
  user: UserPopulated;
  challenge: Types.ObjectId;
  title: string;
  content: string;
  codeSnippet?: string;
  language?: string;
  likes: Types.ObjectId[];
  comments: {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    content: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SolutionWithFullComments extends Omit<SolutionWithUser, "comments"> {
  comments: CommentPopulated[];
}

export interface ChallengePopulated {
  _id: Types.ObjectId;
  title: string;
  level?: string;
}


export interface SolutionWithChallenge
  extends Omit<SolutionWithUser, "challenge"> {
  challenge: ChallengePopulated;
}