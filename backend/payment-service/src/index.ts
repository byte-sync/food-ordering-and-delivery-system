import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PayHere credentials
const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID;
const PAYHERE_SECRET = process.env.PAYHERE_SECRET;
const PAYHERE_URL = "https://sandbox.payhere.lk/pay/checkout"; // Sandbox API URL

// Payment Route
app.post("/createPayment", async (req: Request, res: Response) => {
  try {
    const { order_id, amount, items, first_name, last_name, email, phone, address } = req.body;

    const paymentData = {
      merchant_id: PAYHERE_MERCHANT_ID,
      return_url: "http://localhost:3000/return",
      cancel_url: "http://localhost:3000/cancel",
      notify_url: "http://localhost:3000/notify",
      order_id,
      items,
      amount,
      currency: "LKR",
      first_name,
      last_name,
      email,
      phone,
      address
    };

    // Send the request to PayHere
    const response = await axios.post(PAYHERE_URL, paymentData);

    res.json({
      success: true,
      paymentUrl: response.data
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
