import { Schema, model } from "mongoose";
import { SolutionIF } from "../shared/types/solutions.types";

const solutionSchema = new Schema<SolutionIF>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  codeSnippet: { type: String },
  language: { type: String },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  comments: {
    type: [{
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true },
      commentedAt: { type: Date, default: Date.now }
    }],
    default: []
  }
}, { timestamps: true });

export default model<SolutionIF>('Solution', solutionSchema);
