import mongoose, { Schema, Document, Types } from 'mongoose';
import { ConversationIF } from '../types/conversation.types';



const ConversationSchema = new Schema<ConversationIF>(
  {
    type:{
      type:String,
      enum:["one-to-one","group"]
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      default: null,
    },
    typingUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    seenBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    unreadCounts: {
      type: Map,
      of: Number,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model<ConversationIF>('Conversation', ConversationSchema);
