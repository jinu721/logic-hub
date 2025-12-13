import { Schema, model } from 'mongoose';
import { ConversationDocument } from '@shared/types';



const ConversationSchema = new Schema<ConversationDocument>(
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

export const ConversationModel = model<ConversationDocument>('Conversation', ConversationSchema);
