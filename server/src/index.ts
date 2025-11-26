import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/mongoose";
import { connectRedis } from "./config/redis";

import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    message: "Playable Shop backend is running",
    timestamp: new Date().toISOString(),
    port: PORT,
    host: HOST,
    env: process.env.NODE_ENV,
  });
});

app.get("/", (_req, res) => {
  res.json({
    message: "Playable Factory Case Study API",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

const PORT = parseInt(process.env.PORT || "3001", 10);
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

const start = async () => {
  try {
    console.log("Starting server...");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Port:", PORT);
    console.log("Host:", HOST);

    await connectDB();
    console.log("Database connected successfully");

    await connectRedis();
    console.log("Redis connected successfully");

    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
      console.log("Server is ready to accept connections");
    });
  } catch (error) {
    console.error("Error during startup:", error);
    throw error;
  }
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
