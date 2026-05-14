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

// Optional: Fallback DNS resolver configuration (removed hard block node:dns)
try {
  const dns = await import("node:dns/promises");
  if (dns.setServers && process.env.NODE_ENV !== "production") {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
  }
} catch (e) {
  console.log("DNS optimization skipped");
}

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

// Database connection logic wrapped globally
mongoose
  .connect(
    `mongodb+srv://softxic_blog:softxicBlog123$$@softxic1.xnstlfr.mongodb.net/blogs`,
  )
  .then(() => console.log(`mongoDb is connected successfully`.white))
  .catch((err) => console.log(err));

// API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/upload", uploadRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.get("/", (req, res) => {
  res.send('Health is ok🖤')
})

// Cron Jobs (Note: Node-cron only stays active while a serverless function is awake)
cron.schedule("0 * * * *", async () => {
  console.log("🔄 Running auto-approval cron job...");
  await autoApproveExpiredRequests();
  console.log("✅ Auto-approval cron job completed");
});

// CRITICAL FIX: Only listen locally. Vercel handles routing dynamically in production.
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Server running on port 3000".bgBlue);
  });
}

// CRITICAL FIX: Export for Vercel Serverless engine
export default app;
