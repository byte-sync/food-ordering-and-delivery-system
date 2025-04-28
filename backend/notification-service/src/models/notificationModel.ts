import mongoose, { Document, Schema } from "mongoose";

// Define the INotification interface
export interface INotification extends Document {
    title: string;
    message: string; 
    createdAt: Date;
    email?: string;
    phoneNumber?: string;
    status: "send" | "could not send";
}

// Define the notification schema
const notificationSchema = new Schema<INotification>({
    title: {type: String,required: true},
    message: {type: String,required: true},
    createdAt: {type: Date,default: Date.now},
    email: {type: String,required: false},
    phoneNumber: {type: String,required: false},
    status: {
        type: String,
        enum: ["send", "could not send"],
        default: "could not send", // Default status if not specified
    },
});

// Create and export the Notification model
export const Notification = mongoose.model<INotification>("Notification", notificationSchema);