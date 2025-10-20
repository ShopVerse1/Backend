import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());

// Simple route to return your API key or base URL
app.get("/api/config", (req, res) => {
  res.json({ baseUrl: process.env.API_BASE_URL });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));
import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

const RAZORPAY_WEBHOOK_SECRET = ""; //

app.post("/api/webhook", (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  if (signature === expectedSignature) {
    console.log("✅ Verified payment webhook:", req.body);
    // Process payment success here (update database, etc.)
    res.status(200).send("Webhook received");
  } else {
    console.log("❌ Invalid signature");
    res.status(400).send("Invalid signature");
  }
});
// 📧 Email route
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

    res.status(200).json({ success: true, message: "Email sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Email failed." });
  }
});

app.listen(5000, () => console.log("5000"));
