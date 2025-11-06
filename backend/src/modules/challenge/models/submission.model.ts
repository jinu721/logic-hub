import { Schema, model } from 'mongoose';
import { SubmissionIF } from "@shared/types";


const SubmissionSchema = new Schema<SubmissionIF>({
    userId: { type: Schema.Types.ObjectId, required: true,ref:"User" },
    challengeId: { type: Schema.Types.ObjectId, required: true , ref:"Challenges" },
    passed: { type: Boolean, required: true },
    xpGained: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
    level: { type: String, enum: ["novice", "adept", "master"], required: true },
    type: { type: String, required: true },
    tags: { type: [String], required: true },
    submittedAt: { type: Date, default: Date.now, required: true },
    status: { type: String, enum: ["completed", "failed-timeout", "failed-output", "pending"], required: true },
    execution: {
      language: { type: String },            
      codeSubmitted: { type: String },       
      resultOutput: { type: Schema.Types.Mixed },  
      testCasesPassed: { type: Number },    
      totalTestCases: { type: Number } 
    }
  });
  

export const SubmissionModel = model<SubmissionIF>('Submission', SubmissionSchema);

