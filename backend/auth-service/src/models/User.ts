import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Made optional for social logins
  userType: { type: String, required: true },
  googleId: { type: String, sparse: true, unique: true }, // Google User ID
  isGoogleUser: { type: Boolean, default: false }, // Flag to identify Google users
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' }, // Authentication provider
}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);