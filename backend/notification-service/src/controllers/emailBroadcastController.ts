import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { sendEmailsFromTemplate } from '../services/notificationService';
import { Notification } from '../models/notificationModel'; // Import the Notification model

// Broadcast emails using a predefined template
export const broadcastEmailsWithTemplateController = async (req: Request, res: Response): Promise<void> => {
  const { templateId, emails } = req.body;

  // Validate required fields
  if (!templateId || !Array.isArray(emails) || emails.length === 0) {
    res.status(400).json({ error: 'Missing or invalid required fields: templateId, emails' });
    return;
  }

  try {
    // Path to the JSON file containing email templates
    const filePath = path.join(__dirname, '../data/emailTemplates.json');

    // Read the email templates
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const emailTemplates = JSON.parse(rawData);

    // Check if the requested template exists
    const template = emailTemplates[templateId];
    if (!template) {
      res.status(400).json({ error: `No template found for ID: ${templateId}` });
      return;
    }

    // Send emails and store each email in the database
    for (const email of emails) {
      try {
        // Send the email using the notification service
        await sendEmailsFromTemplate(template, [email]);

        // Store the email notification in the database
        const emailNotification = new Notification({
          title: `Broadcast Email - Template ID: ${templateId}`,
          message: template.text, // Use the plain text version of the email content
          email,
          status: 'send',
        });
        await emailNotification.save();
      } catch (error) {
        console.error(`Failed to send or store email for ${email}:`, error);

        // Optionally, you can log failed notifications in the database with a "could not send" status
        const failedNotification = new Notification({
          title: `Broadcast Email - Template ID: ${templateId}`,
          message: template.text,
          email,
          status: 'could not send',
        });
        await failedNotification.save();
      }
    }

    res.status(200).json({ success: true, message: `Emails sent successfully using template: ${templateId}` });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: 'Failed to send emails' });
  }
};