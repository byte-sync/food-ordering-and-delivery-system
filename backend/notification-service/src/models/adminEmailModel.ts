import mongoose, { Schema, Document } from 'mongoose';

// Define the AdminEmail interface
export interface IAdminEmail extends Document {
  email: string;
  createdAt: Date;
}

// Define the AdminEmail schema
const AdminEmailSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the AdminEmail model
export const AdminEmail = mongoose.model<IAdminEmail>('AdminEmail', AdminEmailSchema);