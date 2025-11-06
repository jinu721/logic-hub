import mongoose, { Schema} from "mongoose";
import { TokenIF } from "@shared/types";



const tokenSchema = new Schema<TokenIF>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: false,
    },
    device: {
      type: String,
      required: false,
    },
    ip: {
      type: String,
      required: false,
    },
  },
  { timestamps: true } 
);

export const TokenModel = mongoose.model<TokenIF>("Token", tokenSchema);
