import { z } from 'zod';

export const SignUpSchema = z.object({
  // Common fields
  email: z.string().email(),
  password: z.string().min(6),
  userType: z.string(),
  profile: z.object({
    firstName: z.string(),
    lastName: z.string(),
    contactNumber: z.string(),
    profilePictureUrl: z.string().optional(),

    // Customer, Restaurant, Driver specific fields
    location: z.object({
      lat: z.number().optional(),
      lng: z.number().optional()
    }).optional(),

    // Restaurant and Driver specific fields
    isActive: z.boolean().optional(),

    // Restaurant specific fields
    restaurantName: z.string().optional(),
    restaurantLicenseNumber: z.string().optional(),
    restaurantTypeId: z.string().optional(),
    cuisineTypeIds: z.array(z.string()).optional(),
    restaurantDocuments: z.array(z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      url: z.string().optional()
    }).optional()).optional(),
    restaurantAddress: z.string().optional(),
    openingTime:z.array( z.object({
      day: z.string().optional(),
      openingTime: z.string().optional(),
      closingTime: z.string().optional(),
      isOpen: z.boolean().optional()
    })).optional(),
    restaurantStatus: z.string().optional(),

    // Driver specific fields
    vehicleTypeId: z.string().optional(),
    vehicleNumber: z.string().optional(),
    vehicleDocuments: z.array(z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      url: z.string().optional()
    })).optional(),
    driverStatus: z.string().optional(),

  // Admin specific fields
  adminType: z.string().optional(),

  })
}).superRefine((data, ctx) => {
  const userType = data.userType;
  const profile = data.profile;

  if (userType === 'RESTAURANT') {
    if (!profile.restaurantName) {
      ctx.addIssue({ 
        code: 'custom', 
        message: 'Restaurant name is required',
        path: ['profile', 'restaurantName']
      });
    }
    if (!profile.restaurantAddress) {
      ctx.addIssue({ 
        code: 'custom', 
        message: 'Restaurant address is required',
        path: ['profile', 'restaurantAddress']
      });
    }
    if (!profile.restaurantLicenseNumber) {
      ctx.addIssue({ 
        code: 'custom', 
        message: 'Restaurant license number is required',
        path: ['profile', 'restaurantLicenseNumber'] 
      });
    }
    if (!Array.isArray(profile.cuisineTypeIds) || profile.cuisineTypeIds.length === 0) {
      ctx.addIssue({ 
        code: 'custom', 
        message: 'Cuisine types are required',
        path: ['profile', 'cuisineTypeIds']
      });
    }
    if (!profile.restaurantTypeId) {
      ctx.addIssue({ 
        code: 'custom', 
        message: 'Restaurant type is required',
        path: ['profile', 'restaurantTypeId']
      });
    }
    if (!Array.isArray(profile.openingTime) || profile.openingTime.length === 0) {
      ctx.addIssue({ 
        code: 'custom', 
        message: 'Opening hours are required',
        path: ['profile', 'openingTime']
      });
    }
  }

  if (userType === 'DRIVER') {
    if (!profile.vehicleNumber) {
      ctx.addIssue({ 
        code: 'custom', 
        message: 'Vehicle number is required',
        path: ['profile', 'vehicleNumber']
      });
    }
    if (!profile.vehicleTypeId) {
      ctx.addIssue({ 
        code: 'custom', 
        message: 'Vehicle type is required',
        path: ['profile', 'vehicleTypeId']
      });
    }
    if (!Array.isArray(profile.vehicleDocuments) || profile.vehicleDocuments.length === 0) {
      ctx.addIssue({ 
        code: 'custom', 
        message: 'Vehicle documents are required',
        path: ['profile', 'vehicleDocuments']
      });
    }
  }

  if (userType === 'ADMIN') {
    if (!profile.adminType) {
      ctx.addIssue({ 
        code: 'custom', 
        message: 'Admin type is required',
        path: ['profile', 'adminType']
      });
    }
  }
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  device: z.string(),
  ipAddress: z.string()
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email()
});

export const ResetPasswordSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(6),
  ipAddress: z.string()
});
