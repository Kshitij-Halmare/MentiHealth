import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./Routes/UserRoutes.js";
import cookieParser from "cookie-parser";
import counsellorRouter from "./Routes/CounsellorRouter.js";
import cron from "node-cron";
import blogRouter from "./Routes/BlogRouter.js";
import ReviewRouter from "./Routes/ReviewRouter.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies
app.use(
  cors({
    origin: "https://mentihealth-1.onrender.com", // Replace with your frontend URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // If using cookies or auth headers
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => new RegExp(o).test(origin))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// Routes
app.use("/blog", blogRouter);
app.use("/api/user", userRouter);
app.use("/api/counsellor", counsellorRouter);
app.use("/review", ReviewRouter);

// MongoDB Connection
const PORT = process.env.PORT || 8080;
const MONGODB_URL = process.env.MONGODB_URL_MAIN;

if (!MONGODB_URL) {
  console.error("Error: MONGODB_URL_MAIN is not defined in .env file.");
  process.exit(1); // Exit if MongoDB URL is missing
}

// Connect to MongoDB
mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit if MongoDB connection fails
  });
