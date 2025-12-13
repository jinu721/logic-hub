import { Schema, model, Document } from 'mongoose';
import { MessageDocument } from '@shared/types';


const MessageSchema = new Schema<MessageDocument>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'document', 'voice', 'poll', 'system','sticker'],
      required: true,
      default: 'text',
    },
    mentionedUsers: [
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
    media: {
      url: String,
      type: {
        type: String,
        enum: ['image', 'video', 'audio', 'document', 'voice','sticker'],
      },
    },
    reactions: [
      {
        emoji: String,
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    
  },
  { timestamps: true }
);

export const MessageModel = model<MessageDocument>('Message', MessageSchema);
