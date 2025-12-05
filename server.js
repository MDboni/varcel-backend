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

// Security Middlewares
app.use(cors());
app.use(helmet());
app.use(hpp());

// Body Parser
app.use(express.json());

// Rate Limit
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 });
app.use(limiter);

// MongoDB
connectDB();

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
app.use("/api/v1", router);

// Serve frontend (Vite build)
app.use(express.static(path.join(__dirname, "client", "dist")));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

// 404 Route 
app.use((req, res) => {
  res.status(404).json({ status: "fail", data: "Not Found" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
