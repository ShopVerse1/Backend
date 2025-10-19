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
