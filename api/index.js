import express from "express";
import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import uploadRoutes from "./routes/upload.route.js";
import cron from "node-cron";
import { autoApproveExpiredRequests } from "./controller/post.controller.js";

dotenv.config();
const app = express();

// CORS Middleware - Important for separate frontend
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://labs.softxic.com",
    "https://softxic-lab-git-main-muhammad-hassans-projects-3c820582.vercel.app",
    "http://localhost:5173",
  ].filter(Boolean);

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true"); // 🔥 CRITICAL
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Cookie"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json());
app.use(cookieParser());

// Database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(`✅ MongoDB connected`.white))
  .catch((err) => console.log("❌ MongoDB error:", err));

// API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/upload", uploadRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/db-check", (req, res) => {
  // Mongoose connection state: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbState = mongoose.connection.readyState;

  const states = {
    0: "Disconnected ❌",
    1: "Connected Successfully ✅",
    2: "Connecting... ⏳",
    3: "Disconnecting... ⚠️",
  };

  if (dbState === 1) {
    return res.status(200).json({
      success: true,
      database_status: states[dbState],
      connection_code: dbState,
      message: "Hosting server is perfectly connected to MongoDB Atlas! 🎉",
      host: mongoose.connection.host,
      database_name: mongoose.connection.name,
    });
  } else {
    return res.status(500).json({
      success: false,
      database_status: states[dbState],
      connection_code: dbState,
      message:
        "Database connection failed or pending! Check environment variables and IP Whitelist.",
    });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "MERN Blog API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth",
      users: "/api/v1/user",
      posts: "/api/v1/post",
      comments: "/api/v1/comment",
      upload: "/api/v1/upload",
    },
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Cron Jobs (Note: Vercel Serverless doesn't keep cron alive)
// For production, use Vercel Cron Jobs feature
if (process.env.NODE_ENV !== "production") {
  cron.schedule("0 * * * *", async () => {
    console.log("🔄 Running auto-approval cron job...");
    await autoApproveExpiredRequests();
    console.log("✅ Auto-approval cron job completed");
  });
}

// Vercel Serverless export
export default app;

// Local development server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`.bgBlue);
  });
}
