import mongoose, { Document, Schema, Model } from 'mongoose';
import { sendSMS, sendEmail } from './../utils/senders.util';

interface INotification extends Document {
  notificationId: string;
  message: string;
  phoneNumber: string;
  email: string;
  userId: string;
  orderId?: string;
  deliveryId?: string;
  isSms: boolean;
  isEmail: boolean;
  isSent: boolean;
}

const NotificationSchema = new Schema<INotification>({
  notificationId: { type: String, required: true, unique: true },
  message: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  userId: { type: String, required: true },
  orderId: { type: String },
  deliveryId: { type: String },
  isSms: { type: Boolean, default: false },
  isEmail: { type: Boolean, default: false },
  isSent: { type: Boolean, default: false },
});

// Only send notification once: when document is created
NotificationSchema.post<INotification>('save', async function (doc) {


  try {
    console.log('New notification created. Sending messages...');

    const updateFields: Partial<INotification> = {};
    let needsUpdate = false;

    if (doc.isSms) {
      console.log('Sending SMS...');
      await sendSMS(doc.phoneNumber, doc.message);
      updateFields.isSent = true;
      needsUpdate = true;
    }

    if (doc.isEmail) {
      console.log('Sending Email...');
      await sendEmail(doc.email, doc.message);
      updateFields.isSent = true;
      needsUpdate = true;
    }

    if (needsUpdate) {
      const NotificationModel = doc.constructor as Model<INotification>;
      await NotificationModel.updateOne(
        { _id: doc._id },
        { $set: updateFields }
      );
      console.log('Notification updated with sent status');
    }
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
});

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;