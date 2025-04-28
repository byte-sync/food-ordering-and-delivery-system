import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  userId: string;
  sessionId: string;
  device: string;
  ipAddress: string;
  jwtToken: string;
  createdAt: Date;
  expiresAt: Date;
}

const sessionSchema = new Schema<ISession>({
  userId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true, unique: true },
  device: { type: String, required: true },
  ipAddress: { type: String, required: true },
  jwtToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: true },
});

// Create compound index for userId and ipAddress for faster lookups
sessionSchema.index({ userId: 1, ipAddress: 1 });

export const SessionModel = mongoose.model<ISession>('Session', sessionSchema);
