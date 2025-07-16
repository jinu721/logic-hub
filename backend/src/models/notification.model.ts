import mongoose, { Document, Schema } from 'mongoose';
import { NotificationIF } from '../types/notification.type';


const notificationSchema = new Schema<NotificationIF>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  itemData: { type: Schema.Types.Mixed },
  type: {
    type: String,
    enum: ['domain', 'market', 'gift', 'system'],
    required: true
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const NotificationModel = mongoose.model<NotificationIF>('Notification', notificationSchema);
