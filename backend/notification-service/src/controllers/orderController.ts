import { Request, Response } from 'express';
import { websocketUtils } from '../utils/websocketUtils';
import { sendSMS, sendEmail, sendOrderStatusNotification } from '../services/notificationService';
import { Notification } from '../models/notificationModel'; // Import NotificationModel

// Add a new order
export const addOrder = async (req: Request, res: Response): Promise<void> => {
  const { userId, orderId, phoneNumber, restuarantMail, email } = req.body;

  // Validate required fields
  if (!userId || !orderId || !phoneNumber || !email) {
    res.status(400).json({ error: 'Missing required fields: userId, orderId, phoneNumber, email' });
    return;
  }

  try {
    // Notify the user via WebSocket
    const userSocket = websocketUtils.clients.get(userId);
    if (userSocket) {
      userSocket.send(JSON.stringify({ type: 'orderPlaced', orderId }));
    }

    // Send order confirmation notification (SMS and Email) to the user
    const smsMessage = `📦 Order Placed: Your order (#${orderId}) has been confirmed.`;
    const emailSubject = `✅ Your Order (#${orderId}) Has Been Placed`;
    const emailText = `
      Thank you for placing your order!
      Order ID: ${orderId}
      Status: confirmed

      We are processing your order and will keep you updated on its status.
    `;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #28a745; text-align: center;">✅ Your Order Has Been Placed!</h1>
        <p style="font-size: 18px; text-align: center;">Thank you for placing your order with us.</p>
        <p style="text-align: center; font-size: 16px;"><strong>Order ID:</strong> ${orderId}</p>
        <p style="text-align: center; font-size: 16px;"><strong>Status:</strong> confirmed</p>
        <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">
          We are processing your order and will keep you updated on its status. ❤️
        </p>
      </div>
    `;

    // Send SMS notification
    // await sendSMS(phoneNumber, smsMessage);

    // Send email notification
    await sendEmail(email, emailSubject, emailText, emailHtml);

    // Store SMS notification in the database
    const smsNotification = new Notification({
      title: 'Order Confirmation (SMS)',
      message: `Order confirmed for order ID: ${orderId}`,
      phoneNumber,
      status: 'send',
    });
    await smsNotification.save();

    // Store email notification in the database
    const emailNotification = new Notification({
      title: 'Order Confirmation (Email)',
      message: `Order confirmed for order ID: ${orderId}`,
      email,
      status: 'send',
    });
    await emailNotification.save();

    res.status(201).json({ success: true, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ error: 'Failed to add order' });
  }
};

// Update the status of an existing order
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const { orderId, userId, status, phoneNumber, email, restaurantMail } = req.body;

  // Validate required fields
  if (!orderId || !userId || !status || !phoneNumber || !email) {
    res.status(400).json({
      error: 'Missing required fields: orderId, userId, status, phoneNumber, email',
    });
    return;
  }

  try {
    // Validate the status transition
    const validStatuses = ['confirmed', 'preperation completed', 'out-for-delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    // Notify the user via WebSocket
    const userSocket = websocketUtils.clients.get(userId);
    if (userSocket) {
      userSocket.send(JSON.stringify({ type: 'orderUpdated', orderId, status }));
    }

    // Send order status notification (SMS and Email) to the user
    const smsMessage = `📦 Order Update: Your order (#${orderId}) status is now ${status}.`;
    const emailSubject = `🚚 Order Status Update - Your Order (#${orderId}) is ${status}`;
    const emailText = `Your order (#${orderId}) status has been updated to: ${status}.
We are processing your order and will keep you updated on its status.`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #28a745; text-align: center;">🚚 Order Status Update</h1>
        <p style="font-size: 18px; text-align: center;">Your order (#<strong>${orderId}</strong>) status has been updated to:</p>
        <p style="font-size: 24px; font-weight: bold; text-align: center; color: #007bff;">${status}</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <p style="font-size: 16px;">We are processing your order and will keep you updated on its status.</p>
        </div>
        <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">
          Thank you for choosing us! ❤️
        </p>
      </div>
    `;

    // Send SMS notification
    // await sendSMS(phoneNumber, smsMessage);

    // Send email notification
    await sendEmail(email, emailSubject, emailText, emailHtml);

    // Store SMS notification in the database
    const smsNotification = new Notification({
      title: 'Order Status Update (SMS)',
      message: `Order status updated to ${status} for order ID: ${orderId}`,
      phoneNumber,
      status: 'send',
    });
    await smsNotification.save();

    // Store email notification in the database
    const emailNotification = new Notification({
      title: 'Order Status Update (Email)',
      message: `Order status updated to ${status} for order ID: ${orderId}`,
      email,
      status: 'send',
    });
    await emailNotification.save();

    // Notify the restaurant if the status is "delivered" or "cancelled"
    if (['delivered', 'cancelled'].includes(status)) {
      if (restaurantMail) {
        await notifyRestaurant({ orderId }, status, restaurantMail);
      } else {
        console.warn('Restaurant email is missing. Skipping email notification.');
      }
    }

    res.status(200).json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// Notify the restaurant when the order status is "delivered" or "cancelled"
const notifyRestaurant = async (
  order: { orderId: string },
  status: string,
  restaurantMail: string
): Promise<void> => {
  // Validate the status before proceeding
  if (!['delivered', 'cancelled'].includes(status)) {
    console.warn(`Invalid status (${status}) for notifying the restaurant. Skipping notification.`);
    return;
  }

  // Define SMS and email content based on the status
  const smsMessage =
    status === 'delivered'
      ? `🎉 Order #${order.orderId} has been delivered successfully.`
      : `❌ Order #${order.orderId} has been cancelled.`;

  const emailSubject =
    status === 'delivered'
      ? `🎉 Order #${order.orderId} Delivered`
      : `❌ Order #${order.orderId} Cancelled`;

  const emailText =
    status === 'delivered'
      ? `Order #${order.orderId} has been delivered successfully. Thank you!`
      : `Order #${order.orderId} has been cancelled. We apologize for any inconvenience.`;

  const emailHtml =
    status === 'delivered'
      ? `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #28a745; text-align: center;">🎉 Order Delivered</h1>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Status:</strong> Delivered</p>
          <p>Thank you for your service! ❤️</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc3545; text-align: center;">❌ Order Cancelled</h1>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Status:</strong> Cancelled</p>
          <p>We apologize for any inconvenience caused. ❤️</p>
        </div>
      `;

  try {
    // Send email notification to the restaurant
    await sendEmail(restaurantMail, emailSubject, emailText, emailHtml);

    // Store email notification in the database
    const emailNotification = new Notification({
      title: `Restaurant Notification - Order ${status}`,
      message: `Order #${order.orderId} status updated to ${status}`,
      email: restaurantMail,
      status: 'send',
    });
    await emailNotification.save();

    // Log a success message
    console.log(`Notification sent to restaurant (${restaurantMail}) for order #${order.orderId}: ${status}`);
  } catch (error) {
    // Log any errors during the notification process
    console.error(`Failed to notify restaurant (${restaurantMail}) for order #${order.orderId}:`, error);
  }
};