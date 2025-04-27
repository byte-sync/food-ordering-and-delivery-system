import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export class UserService {
  // ...existing methods...
  
  /**
   * Find a user by their Google ID
   */
  async findByGoogleId(googleId: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        googleId: googleId,
      },
    });
  }
  
  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        email: email,
      },
    });
  }
  
  /**
   * Create a new user with Google auth data
   */
  async createGoogleUser(data: {
    email: string;
    googleId: string;
    firstName: string;
    lastName: string;
    profileImage?: string | null;
  }): Promise<User> {
    // Generate a random password for Google users (not used for login)
    const randomPassword = randomUUID();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    
    return prisma.user.create({
      data: {
        id: randomUUID(), // Generate a new UUID
        email: data.email,
        googleId: data.googleId,
        firstName: data.firstName,
        lastName: data.lastName,
        profileImage: data.profileImage || null,
        userType: 'PENDING', // User needs to select account type
        password: hashedPassword, // Store a hashed random password
        isProfileComplete: false,
        dateCreated: new Date(),
        dateUpdated: new Date(),
      },
    });
  }
  
  /**
   * Update user data
   */
  async updateUser(userId: string, data: any): Promise<User> {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
        dateUpdated: new Date(),
      },
    });
  }
}