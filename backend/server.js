import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import routes from "./routes.js";
import { sendApiResponse } from "./utils.js";

dotenv.config();

const app = express();

/**
 * Middleware
 */
app.use(
  cors({
    origin: process.env.VITE_VERCEL_URL || "http://localhost:5173", // Vite's default port
    credentials: true,
  }),
);

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// API routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

app.use("/api", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  sendApiResponse(res, 500, "Something went wrong!");
});

// Set Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
