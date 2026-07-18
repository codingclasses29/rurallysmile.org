import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import path from "path";
import { fileURLToPath } from "url";

import "./config/env.js";
import config from "./config/index.js";

import apiRoutes from "./routes/index.js";
import logger from "./middleware/logger.middleware.js";
import limiter from "./middleware/rateLimit.middleware.js";
import errorHandler from "./middleware/error.middleware.js";
import notFound from "./middleware/notFound.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const defaultOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

const envOrigins = String(config.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

function isTrustedOrigin(origin) {
  try {
    const { hostname, protocol } = new URL(origin);
    if (allowedOrigins.includes(origin)) return true;
    if (protocol === "https:" && hostname.endsWith(".vercel.app")) return true;
    if (protocol === "http:" && hostname === "localhost") return true;
    if (protocol === "http:" && hostname === "127.0.0.1") return true;
    return false;
  } catch {
    return false;
  }
}

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server requests and reflect trusted browser origins.
    if (!origin) return callback(null, true);
    if (isTrustedOrigin(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);
app.use(compression());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(logger);
app.use(limiter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Exam Portal API Running");
});

app.use("/api/v1", apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
