import mongoose from 'mongoose'; // <-- You need this import

const UserRestaurantPaymentSchema = new mongoose.Schema({
  customerId: String,
  orderId: String,
  restaurantId: String,
  orderTotal: Number,
  sessionUrl: String, // 🆕 Save Stripe session URL
}, { timestamps: true });

export default mongoose.model('UserRestaurantPayment', UserRestaurantPaymentSchema);
