import { Request, Response } from 'express';
import { sendSMS, sendEmail } from '../services/notificationService';
import { Notification } from '../models/notificationModel'; // Import the Notification model
import { AdminEmail } from '../models/adminEmailModel'; // Import the AdminEmail model
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Apply to become a delivery driver
export const applyToBecomeDriver = async (req: Request, res: Response): Promise<void> => {
  const { userId, name, phoneNumber, email } = req.body;

  // Validate required fields
  if (!userId || !name || !phoneNumber || !email) {
    res.status(400).json({ error: 'Missing required fields: userId, name, phoneNumber, email' });
    return;
  }

  try {
    // Fetch all admin emails from the database
    const adminEmails = await AdminEmail.find({}, { email: 1, _id: 0 });

    if (adminEmails.length === 0) {
      console.error('No admin emails found in the database.');
      res.status(500).json({ error: 'Failed to send notification: No admin emails found.' });
      return;
    }

    // Extract the email addresses from the results
    const adminEmailAddresses = adminEmails.map((admin) => admin.email);

    // Notify all admins via email
    const adminEmailSubject = `New Delivery Driver Application Submitted`;
    const adminEmailText = `A new application has been submitted by ${name}.`;
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #28a745; text-align: center;">📝 New Delivery Driver Application</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">
          Please review the application and take appropriate action. ❤️
        </p>
      </div>
    `;

    // Send the email notification to all admin emails
    for (const adminEmail of adminEmailAddresses) {
      await sendEmail(adminEmail, adminEmailSubject, adminEmailText, adminEmailHtml);

      // Store the notification in the database
      const adminNotification = new Notification({
        title: 'New Delivery Driver Application',
        message: adminEmailText,
        phoneNumber: phoneNumber,
        email: adminEmail,
        status: 'send',
      });
      await adminNotification.save();
    }

    res.status(200).json({ success: true, message: 'Your application has been submitted successfully' });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};
// Update application status (Admin action)
export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  const { userId, status, name, phoneNumber, email } = req.body;

  // Validate required fields
  if (!userId) {
    res.status(400).json({ error: 'Missing required field: userId' });
    return;
  }

  if (!status || !['approved', 'rejected'].includes(status)) {
    res.status(400).json({ error: 'Invalid status. Must be "approved" or "rejected"' });
    return;
  }

  if (!name || !phoneNumber || !email) {
    res.status(400).json({ error: 'Missing required fields: name, phoneNumber, email' });
    return;
  }

  try {
    // Simulate retrieving user details (in a real-world scenario, this would come from a database)
    const application = {
      userId,
      name,
      phoneNumber,
      email,
    };

    // Prepare notification messages
    const smsMessage =
      status === 'approved'
        ? `🎉 Congratulations, ${name}! Your application to become a delivery driver has been approved.`
        : `❌ Unfortunately, ${name}, your application to become a delivery driver has been rejected.`;

    const emailSubject =
      status === 'approved'
        ? '🎉 Your Application Has Been Approved!'
        : '❌ Your Application Has Been Rejected';

    const emailText =
      status === 'approved'
        ? `Dear ${name},\n\nCongratulations! Your application to become a delivery driver has been approved. Please proceed with the next steps.\n\nBest regards,\nThe Team`
        : `Dear ${name},\n\nUnfortunately, your application to become a delivery driver has been rejected. Thank you for your interest.\n\nBest regards,\nThe Team`;

    const emailHtml =
      status === 'approved'
        ? `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #28a745; text-align: center;">🎉 Congratulations, ${name}!</h1>
            <p style="font-size: 18px; text-align: center;">Your application to become a delivery driver has been approved.</p>
            <p style="font-size: 16px; text-align: center;">Please proceed with the next steps.</p>
            <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">
              Thank you for your interest! ❤️
            </p>
          </div>
        `
        : `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc3545; text-align: center;">❌ Application Rejected</h1>
            <p style="font-size: 18px; text-align: center;">Unfortunately, ${name}, your application to become a delivery driver has been rejected.</p>
            <p style="font-size: 16px; text-align: center;">Thank you for your interest.</p>
            <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">
              We appreciate your time and effort. ❤️
            </p>
          </div>
        `;

    // Send SMS notification
    // await sendSMS(application.phoneNumber, smsMessage);

    // Send email notification
    await sendEmail(application.email, emailSubject, emailText, emailHtml);

    // Store the SMS notification in the database with a shortened message
    const smsNotification = new Notification({
      title: 'Application Status Update (SMS)',
      message: `Application ${status} for user ${name}`,
      phoneNumber: application.phoneNumber,
      status: 'send',
    });
    await smsNotification.save();

    // Store the email notification in the database with a shortened message
    const emailNotification = new Notification({
      title: 'Application Status Update (Email)',
      message: `Application ${status} for user  ${name}`,
      email: application.email,
      status: 'send',
    });
    await emailNotification.save();

    res.status(200).json({ success: true, message: `Application status updated to ${status}` });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
};