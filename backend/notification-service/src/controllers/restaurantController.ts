import { Request, Response } from 'express';
import { sendSMS, sendEmail } from '../services/notificationService';
import { Notification } from '../models/notificationModel'; // Import NotificationModel
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Apply to become a restaurant partner
export const applyToBecomeRestaurant = async (req: Request, res: Response): Promise<void> => {
  const { ownerName, restaurentName, phoneNumber, email } = req.body;

  // Validate required fields
  if (!ownerName || !restaurentName || !phoneNumber || !email) {
    res.status(400).json({ error: 'Missing required fields: ownerName, restaurentName, phoneNumber, email' });
    return;
  }

  try {
    // Notify the admin via email
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.error('Admin email is not configured in the .env file.');
    } else {
      const adminEmailSubject = `New Restaurant Partner Application Submitted`;
      const adminEmailText = `
        A new application has been submitted by ${ownerName} (${email}).
        Restaurant Name: ${restaurentName}
        Phone Number: ${phoneNumber}
      `;
      const adminEmailHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #28a745; text-align: center;">📝 New Restaurant Partner Application</h1>
          <p><strong>Owner Name:</strong> ${ownerName}</p>
          <p><strong>Restaurant Name:</strong> ${restaurentName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone Number:</strong> ${phoneNumber}</p>
          <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">
            Please review the application and take appropriate action. ❤️
          </p>
        </div>
      `;

      await sendEmail(adminEmail, adminEmailSubject, adminEmailText, adminEmailHtml);

      // Store admin notification in the database
      const adminNotification = new Notification({
        title: 'New Restaurant Application ',
        message: `New application submitted by ${ownerName} for ${restaurentName}`,
        email: adminEmail,
        status: 'send',
      });
      await adminNotification.save();
    }

    res.status(201).json({ success: true, message: 'Your application has been submitted successfully' });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

export const updateRestaurantApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  const { email, phoneNumber, ownerName, restaurantName, status } = req.body;

  // Validate required fields
  if (!email || !phoneNumber || !ownerName || !restaurantName || !status) {
    res.status(400).json({
      error: 'Missing required fields: email, phoneNumber, ownerName, restaurantName, status',
    });
    return;
  }

  if (!['approved', 'rejected'].includes(status)) {
    res.status(400).json({ error: 'Invalid status. Must be "approved" or "rejected"' });
    return;
  }

  try {
    // Customize the notification content
    const smsMessage =
      status === 'approved'
        ? `🎉 Congratulations ${ownerName}! Your application to become a restaurant partner has been approved.`
        : `❌ Unfortunately ${ownerName}, your application to become a restaurant partner has been rejected.`;

    const emailSubject =
      status === 'approved'
        ? `🎉 Your Application for ${restaurantName} Has Been Approved!`
        : `❌ Your Application for ${restaurantName} Has Been Rejected`;

    const emailText =
      status === 'approved'
        ? `Dear ${ownerName},
Congratulations! Your application to become a restaurant partner for ${restaurantName} has been approved. Please proceed with the next steps.`
        : `Dear ${ownerName},
Unfortunately, your application to become a restaurant partner for ${restaurantName} has been rejected. Thank you for your interest.`;

    const emailHtml =
      status === 'approved'
        ? `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #28a745; text-align: center;">🎉 Congratulations, ${ownerName}!</h1>
            <p style="font-size: 18px; text-align: center;">Your application to become a restaurant partner for <strong>${restaurantName}</strong> has been approved.</p>
            <p style="font-size: 16px; text-align: center;">Please proceed with the next steps.</p>
            <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">
              Thank you for your interest! ❤️
            </p>
          </div>
        `
        : `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc3545; text-align: center;">❌ Application Rejected</h1>
            <p style="font-size: 18px; text-align: center;">Unfortunately, your application to become a restaurant partner for <strong>${restaurantName}</strong> has been rejected.</p>
            <p style="font-size: 16px; text-align: center;">Thank you for your interest.</p>
            <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">
              We appreciate your time and effort. ❤️
            </p>
          </div>
        `;

    // Send SMS notification
    // await sendSMS(phoneNumber, smsMessage);

    // Send email notification
    await sendEmail(email, emailSubject, emailText, emailHtml);

    // Store applicant notification in the database
    const applicantNotification = new Notification({
      title: status === 'approved' ? 'Application Approved (Applicant)' : 'Application Rejected (Applicant)',
      message: `Application status updated to ${status} for ${email}`,
      email,
      phoneNumber,
      status: 'send',
    });
    await applicantNotification.save();

    res.status(200).json({ success: true, message: `Application status updated to ${status}` });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
};