import { Request, Response } from 'express';
import Notification from '../models/Notification.model';
import { v4 as uuidv4 } from 'uuid';

export async function createNotification(req: Request, res: Response): Promise<void> {

  try {
    const {
      message,
      phoneNumber,
      email,
      userId,
      orderId,
      deliveryId,
      isSms,
      isEmail,
    } = req.body;

    const notification = new Notification({
      notificationId: uuidv4(),
      message,
      phoneNumber,
      email,
      userId,
      orderId,
      deliveryId,
      isSms,
      isEmail,
    });

    await notification.save();

    const updatedNotification = await Notification.findById(notification._id);

    res.status(201).json({
      success: true,
      data: updatedNotification,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}