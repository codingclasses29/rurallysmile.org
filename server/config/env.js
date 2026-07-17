import dotenv from "dotenv";
import dotenvSafe from "dotenv-safe";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");

dotenv.config({ path: path.join(root, ".env") });

try {
  dotenvSafe.config({
    path: path.join(root, ".env"),
    example: path.join(root, ".env.example"),
    allowEmptyValues: true,
  });
} catch (error) {
  console.warn("⚠ Environment validation warning:", error.message);
}

const required = ["MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`❌ Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

export default process.env;
