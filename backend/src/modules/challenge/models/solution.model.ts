import { Schema, model } from "mongoose";
import { SolutionDocument } from "@shared/types";

const solutionSchema = new Schema<SolutionDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  challenge: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  implementations: {
    type: [{
      language: { type: String, required: true },
      codeSnippet: { type: String, required: true }
    }],
    default: []
  },
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

export const SolutionModel = model<SolutionDocument>('Solution', solutionSchema);
