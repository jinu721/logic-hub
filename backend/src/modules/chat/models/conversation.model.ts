import { Schema, model } from 'mongoose';
import { ConversationIF } from '@shared/types';



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

export const ConversationModel = model<ConversationIF>('Conversation', ConversationSchema);
