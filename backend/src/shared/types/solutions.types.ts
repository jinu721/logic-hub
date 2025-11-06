import { Document } from "mongoose";
import { Types } from "mongoose";

export interface CommentSolutionIF extends Document {
    user: Types.ObjectId;
    content: string;
    commentedAt: Date;
}

export interface SolutionIF extends Document {
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
