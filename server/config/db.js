import mongoose from "mongoose";
import config from "./index.js";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    logger.info("MongoDB Connected");
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
