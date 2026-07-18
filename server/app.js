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


// ===============================
// CORS CONFIGURATION
// ===============================

const allowedOrigins = [
  "http://localhost:5173",
  "https://rurallysmile-org.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without origin (Postman, server-to-server, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept"
  ],

  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


// ===============================
// REQUEST LOGGING
// ===============================

app.use((req, _res, next) => {
  console.log("Method:", req.method);
  console.log("Origin:", req.headers.origin);
  console.log("Path:", req.originalUrl);
  next();
});


// ===============================
// SECURITY MIDDLEWARE
// ===============================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    },
    crossOriginOpenerPolicy: {
      policy: "same-origin-allow-popups"
    },
  })
);

app.use(compression());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(logger);
app.use(limiter);


// ===============================
// STATIC FILES
// ===============================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use(
  "/public",
  express.static(path.join(__dirname, "public"))
);


// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
  res.send("Exam Portal API Running");
});


// ===============================
// API ROUTES
// ===============================

app.use("/api/v1", apiRoutes);


// ===============================
// ERROR HANDLING
// ===============================

app.use(notFound);
app.use(errorHandler);

export default app;