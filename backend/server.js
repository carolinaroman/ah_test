import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import routes from "./routes.js";
import { sendApiResponse } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env") });

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
app.use((req, res, next) => {
  routes(req, res, next);
});

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
