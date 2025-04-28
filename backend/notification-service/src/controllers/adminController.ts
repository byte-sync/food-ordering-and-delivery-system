import { Request, Response } from 'express';
import { AdminEmail } from '../models/adminEmailModel';

// Add a new admin email to the database
export const addAdminEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  // Validate required fields
  if (!email) {
    res.status(400).json({ error: 'Missing required field: email' });
    return;
  }

  try {
    // Check if the email already exists
    const existingEmail = await AdminEmail.findOne({ email });

    if (existingEmail) {
      res.status(400).json({ error: 'Admin email already exists' });
      return;
    }

    // Create a new admin email record
    const newAdminEmail = new AdminEmail({ email });
    await newAdminEmail.save();

    res.status(201).json({ success: true, message: 'Admin email added successfully' });
  } catch (error) {
    console.error('Error adding admin email:', error);
    res.status(500).json({ error: 'Failed to add admin email' });
  }
};

// Get all admin emails from the database
export const getAllAdminEmails = async (req: Request, res: Response): Promise<void> => {
    try {
      // Fetch all admin emails
      const adminEmails = await AdminEmail.find({}, { _id: 0, email: 1, createdAt: 1 });
  
      res.status(200).json({ success: true, adminEmails });
    } catch (error) {
      console.error('Error fetching admin emails:', error);
      res.status(500).json({ error: 'Failed to fetch admin emails' });
    }
  };

//   // Get all admin emails from the database
// export const getAllAdminEmails = async (req: Request, res: Response): Promise<void> => {
//     try {
//       // Fetch all admin emails
//       const adminEmails = await AdminEmail.find({}, { _id: 0, email: 1, createdAt: 1 });
  
//       res.status(200).json({ success: true, adminEmails });
//     } catch (error) {
//       console.error('Error fetching admin emails:', error);
//       res.status(500).json({ error: 'Failed to fetch admin emails' });
//     }
//   };