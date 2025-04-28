import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD;

// Create nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS, // Use app password for Gmail (https://support.google.com/accounts/answer/185833)
  },
});

/**
 * Sends an email using Gmail
 * @param to Recipient email address
 * @param subject Email subject
 * @param content Email content (can be HTML)
 * @returns Promise resolving to the info object from nodemailer
 */
export const sendEmail = async (to: string, subject: string, content: string): Promise<any> => {
  if (!GMAIL_USER || !GMAIL_PASS) {
    throw new Error('Email configuration missing. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.');
  }
  
  const mailOptions = {
    from: `Food Ordering System <${GMAIL_USER}>`,
    to,
    subject,
    html: content,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error: any) {
    console.error('Error sending email:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};