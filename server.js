import express from "express";
import router from "./src/routes/api.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import hpp from "hpp";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/config.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

// ===== Security Middlewares =====
app.use(cors());
app.use(helmet());
app.use(hpp());

// ===== Body Parser =====
app.use(express.json());

// ===== Rate Limiting =====
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 });
app.use(limiter);

// ===== MongoDB Connection =====
connectDB();

// ===== __dirname fix for ES Modules =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== API Routes =====
app.use("/api/v1", router);

// ===== Optional Test Route =====
app.get("/api/v1/test", (req, res) => {
  res.status(200).json({ status: "success", message: "API Router Working!" });
});

// ===== API 404 Route =====
app.use("/api/v1", (req, res) => {
  res.status(404).json({ status: "fail", message: "API route not found" });
});

// ===== Serve Frontend (Vite Build) =====
app.use(express.static(path.join(__dirname, "client", "dist")));

// ===== Frontend Catch-All Route (React Router) =====
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

// ===== Start Server =====
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
