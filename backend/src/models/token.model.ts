import mongoose, { Schema} from "mongoose";
import { TokenIF } from "../types/token.types";



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

const TokenModel = mongoose.model<TokenIF>("Token", tokenSchema);
export default TokenModel;
