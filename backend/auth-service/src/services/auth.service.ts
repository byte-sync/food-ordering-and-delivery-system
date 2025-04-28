import axios from 'axios';
import { hashPassword, comparePassword, generateOtp } from '../utils/auth';
import { UserModel } from '../models/User';
import { createSession } from '../utils/sessionClient';
import { OtpModel } from '../models/Otp';
import { sendEmail } from '../utils/email';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:8085/api/users';

export const registerUser = async (
  email: string,
  password: string,
  userType: string,
  profile: Record<string, any>
) => {
  // Check if user already exists
  const existing = await UserModel.findOne({ email });
  if (existing) throw new Error('Email already exists');

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create local user for auth purposes
  const localUser = new UserModel({
    email,
    password: hashedPassword,
    userType
  });
  
  try {
    await localUser.save();
    console.log('Local auth user created:', localUser._id);
    
    // Create user in the User Service with all profile details
    const fullUserData = {
      ...profile,
      email,
      userType
    };

    // Log what we're sending to the user service
    console.log('Sending user data to User Service:', JSON.stringify(fullUserData, null, 2));

    // Save in User Service
    try {
      const { data: createdUser } = await axios.post(USER_SERVICE_URL, fullUserData);
      console.log('User created in User Service:', createdUser);

      return { 
        userId: createdUser.id || localUser._id.toString()
      };
    } catch (userServiceError: any) {
      // If the user service fails, we need to roll back the local user creation
      await UserModel.deleteOne({ _id: localUser._id });
      
      // Specific error handling for debugging
      if (userServiceError.response) {
        console.error('User service error response:', {
          status: userServiceError.response.status,
          data: userServiceError.response.data
        });
        throw new Error(`User registration failed: ${userServiceError.response.data.error || userServiceError.message}`);
      }
      
      throw new Error(`User registration failed: ${userServiceError.message}`);
    }
  } catch (error: any) {
    // Handle any other errors with local user creation
    console.error('User registration error:', error);
    throw error;
  }
};

export const loginUser = async (
  email: string,
  password: string,
  device: string,
  ipAddress: string
) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('User not found');

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error('Invalid credentials');
  
  // Create a session for the user
  try {
    const sessionResult = await createSession(user._id.toString(), ipAddress, device);
    
    return { 
      userId: user._id.toString(),
      sessionId: sessionResult.sessionId, // Direct access without optional chaining
      sessionToken: sessionResult.token,
      userType: user.userType
    };
  } catch (error: any) {
    console.error('Session creation error:', error);
    throw new Error('Failed to create session');
  }
};

export const forgotPassword = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('User not found');

  // Generate a 6-digit OTP
  const otp = generateOtp();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15); // OTP expires in 15 minutes

  // Save OTP in database
  await OtpModel.findOneAndUpdate(
    { email },
    { 
      email,
      otp,
      expiresAt
    },
    { upsert: true, new: true }
  );

  try {
    // Send OTP via email utility instead of notification service
    await sendEmail(
      email,
      'Password Reset Verification Code',
      `<h1>Password Reset</h1>
      <p>Your verification code is: <strong>${otp}</strong></p>
      <p>This code will expire in 15 minutes.</p>`
    );

    return { success: true };
  } catch (error: any) {
    console.error('Failed to send OTP email:', error.message);
    throw new Error('Failed to send verification code. Please try again.');
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('User not found');

  const otpRecord = await OtpModel.findOne({ email });
  if (!otpRecord) throw new Error('No verification code found. Please request a new code.');

  if (otpRecord.otp !== otp) throw new Error('Invalid verification code');

  if (otpRecord.expiresAt < new Date()) throw new Error('Verification code has expired. Please request a new code.');

  // Mark OTP as verified
  otpRecord.verified = true;
  await otpRecord.save();

  return { success: true };
};

export const resetPassword = async (email: string, newPassword: string, ip: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('User not found');

  // Verify that OTP was verified
  const otpRecord = await OtpModel.findOne({ email, verified: true });
  if (!otpRecord) throw new Error('Please verify your email with the verification code first');

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();

  // Delete the OTP record after successful password reset
  await OtpModel.deleteOne({ email });

  // Return basic success message
  return { success: true };
};
