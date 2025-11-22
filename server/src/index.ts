import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
