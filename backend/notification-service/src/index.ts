import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { websocketUtils } from './utils/websocketUtils';
import {broadcastEmailsWithTemplateController  } from './controllers/emailBroadcastController'; // Import the new controller
import { addOrder,updateOrderStatus } from './controllers/orderController';
import { allocateDelivery } from './controllers/driverController';
import { applyToBecomeDriver, updateApplicationStatus } from './controllers/driverApplicationController';
import { processPayment,notifyDriverAboutPaymentDeposit,notifyRestaurantAboutPaymentDeposit } from './controllers/paymentController';
import { applyToBecomeRestaurant, updateRestaurantApplicationStatus } from './controllers/restaurantController';
import { addAdminEmail,getAllAdminEmails } from '../src/controllers/adminController';
// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('MongoDB connection error:', err));

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware to parse JSON
app.use(express.json());

// HTTP server
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  logger.info('New WebSocket connection');

  // Handle incoming messages
  ws.on('message', (message: string) => {
    const data = JSON.parse(message);
    if (data.type === 'register' && data.userId) {
      websocketUtils.clients.set(data.userId, ws);
      logger.info(`User ${data.userId} registered`);
    }
  });

  // Handle connection close
  ws.on('close', () => {
    logger.info('WebSocket connection closed');
    for (const [userId, socket] of websocketUtils.clients.entries()) {
      if (socket === ws) {
        websocketUtils.clients.delete(userId);
        break;
      }
    }
  });
});



app.post('/orders',addOrder)
app.post('/process-payment', processPayment);
app.post('/notify-driver-payment-deposited', notifyDriverAboutPaymentDeposit)
app.post('/orders/status', updateOrderStatus);
app.post('/notify-restaurant-payment-deposited', notifyRestaurantAboutPaymentDeposit);
app.post('/apply-restaurant', applyToBecomeRestaurant);
app.post('/update-restaurant-status', updateRestaurantApplicationStatus);
// Route to broadcast emails
app.post('/broadcast-emails', broadcastEmailsWithTemplateController); // Use the new controller

// Route to allocate delivery to a driver
app.post('/drivers/allocate', allocateDelivery);

// Route to apply to become a delivery driver
app.post('/drivers/apply', applyToBecomeDriver);

// Route to update application status (Admin action)
app.post('/drivers/application/status', updateApplicationStatus);
app.post('/admin-emails', addAdminEmail);
app.get('/admin-emails', getAllAdminEmails);
// Start the server
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});