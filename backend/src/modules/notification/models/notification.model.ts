import { model, Schema } from 'mongoose';
import { NotificationIF } from '@shared/types';


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

export const NotificationModel = model<NotificationIF>('Notification', notificationSchema);
