import express = require('express');
import * as dotenv from 'dotenv';
import connectDB from './config/db.config';
import notificationRouter from './routes/notification.route'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

connectDB();

app.use('/notification', notificationRouter);

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});