import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Razorpay from "razorpay";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// 🧩 Route 1 — Get API Base URL
app.get("/api/config", (req, res) => {
  res.json({ baseUrl: process.env.API_BASE_URL });
});

// 🧩 Route 2 — Create Razorpay Order
app.post("/api/create-order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100, // amount in paise
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("❌ Razorpay order creation failed:", error);
    res.status(500).send("Error creating Razorpay order");
  }
});

// 🧩 Route 3 — Send Email Notification
app.post("/api/send-email", async (req, res) => {
  const { userEmail, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: userEmail,
      subject: subject,
      text: message,
    });

    console.log("📧 Email sent successfully to:", userEmail);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email failed:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

// 🧱 Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
