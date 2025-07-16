import { UserIF } from "./user.types";



export interface SolutionIF {
    _id?: string;
  title: string;
  user:UserIF
  content: string;
  codeSnippet?: string;
  likes: any[];
  comments: any[];
  language?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  challenge?: string;
  createdAt?: Date;
}
