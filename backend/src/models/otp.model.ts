import mongoose,{Schema} from "mongoose";
import { OtpIF } from "../types/user.types";

const otpSchema:Schema = new Schema<OtpIF>({
    email:{type:String,required:true},
    otp:{type:String,required:true},
    createdAt:{type:Date,expires:300,default:Date.now}
});


export default mongoose.model<OtpIF>('Otp',otpSchema);