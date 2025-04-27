import mongoose from 'mongoose';

const DriverPaymentSchema = new mongoose.Schema({
  driverId: { type: String, required: true },
  deliveryFee: { type: Number, required: true },
  paymentType: { type: String, enum: ['cash', 'card'], required: true },
}, { timestamps: true });

export default mongoose.model('DriverPayment', DriverPaymentSchema);
