import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "./config/env.js";
import config from "./config/index.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

connectDB();

const PORT = config.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server Running ${PORT}`);
  logger.info(`API Base: http://localhost:${PORT}/api/v1`);
});
