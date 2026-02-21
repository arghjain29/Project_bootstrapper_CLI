import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

/**
 * Connect to MongoDB with retry logic and proper error handling
 * @returns {Promise<void>}
 */
async function connectDB() {
  // Validate MongoDB URI
  if (!MONGO_URI) {
    console.error(
      "FATAL ERROR: MONGO_URI is not defined in environment variables",
    );
    process.exit(1);
  }

  // Mongoose connection options
  const options = {
    maxPoolSize: 10,
    minPoolSize: 5,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
    family: 4, // Use IPv4
  };

  let retries = 0;

  const connect = async () => {
    try {
      await mongoose.connect(MONGO_URI, options);
      console.log("✓ MongoDB connected successfully");
      console.log(`✓ Database: ${mongoose.connection.name}`);
      console.log(`✓ Host: ${mongoose.connection.host}`);
    } catch (err) {
      retries += 1;
      console.error(
        `✗ MongoDB connection error (Attempt ${retries}/${MAX_RETRIES}):`,
        err.message,
      );

      if (retries < MAX_RETRIES) {
        console.log(`⟳ Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return connect();
      } else {
        console.error("✗ Failed to connect to MongoDB after maximum retries");
        process.exit(1);
      }
    }
  };

  await connect();

  // Handle connection events
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connection established");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Attempting to reconnect...");
  });

  // Handle application termination
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to application termination");
    process.exit(0);
  });
}

export default connectDB;
