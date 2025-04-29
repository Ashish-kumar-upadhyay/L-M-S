import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import booksRouter from "./routes/bookRoutes.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json()); // to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/library");
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit process if DB fails
  }
};
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// Routes
app.use("/api/books", booksRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Library Management API!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
