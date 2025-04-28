import axios from 'axios';
import { UserModel } from '../models/User';
import { hashPassword } from './auth';
import dotenv from 'dotenv';

dotenv.config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:8085/api/users';

/**
 * Checks if an admin user exists, if not creates one with default credentials
 */
export const initializeAdminUser = async () => {
  try {
    console.log('Checking for existing admin user...');
    
    // Check if an admin user already exists
    const adminExists = await UserModel.findOne({ userType: 'admin' });
    
    if (adminExists) {
      console.log('Admin user already exists. Skipping initialization.');
      return;
    }
    
    console.log('No admin user found. Creating default admin...');
    
    // Default admin credentials - ideally these would be read from environment variables
    const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@nomnom.com';
    const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123';
    
    // Hash password
    const hashedPassword = await hashPassword(defaultAdminPassword);
    
    // Create admin user in local auth DB
    const adminUser = new UserModel({
      email: defaultAdminEmail,
      password: hashedPassword,
      userType: 'admin'
    });
    
    await adminUser.save();
    console.log('Admin user created in auth service:', adminUser._id);
    
    // Create admin user in User Service with additional profile details
    const adminProfile = {
      email: defaultAdminEmail,
      userType: 'admin',
      firstName: 'System',
      lastName: 'Administrator',
      phoneNumber: '0000000000',
      address: 'System Address'
    };
    
    try {
      const { data: createdUser } = await axios.post(USER_SERVICE_URL, adminProfile);
      console.log('Admin user created in User Service:', createdUser);
    } catch (error: any) {
      console.error('Failed to create admin in User Service:', error.message);
      
      // If User Service creation fails, remove the local auth user to maintain consistency
      await UserModel.deleteOne({ _id: adminUser._id });
      throw new Error(`Admin user creation failed: ${error.message}`);
    }
    
    console.log('Default admin user initialized successfully');
  } catch (error: any) {
    console.error('Admin initialization error:', error);
  }
};