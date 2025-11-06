import mongoose, { Schema } from "mongoose";
import { PendingUserIF } from "@shared/types";



const pendingUserSchema:Schema = new Schema<PendingUserIF>({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    otp:{type:Number,required:true},
    createdAt:{type:Date,expires:300,default:Date.now},
}) 

export const  pendingModel = mongoose.model<PendingUserIF>('PendingUser',pendingUserSchema);