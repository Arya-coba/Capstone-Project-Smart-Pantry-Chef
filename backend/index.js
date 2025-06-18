const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const authRoutes = require("./src/routes/authRoutes");
const mlRoutes = require("./src/routes/mlRoutes");
const recipeRoutes = require("./src/routes/recipeRoutes");
const translateRoutes = require("./src/routes/translateRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Enhanced CORS configuration – allows the deployed frontend and properly replies to pre-flight requests
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://capstone-project-smart-pantry-chef.vercel.app",
];
app.use(
  cors({
    origin: (origin, callback) => {
      // If no origin (e.g. mobile apps, curl), allow it. Otherwise check if it is in the whitelist.
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("CORS: Origin not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
// Explicitly enable pre-flight across-the-board so Express doesn't return 404 for OPTIONS
app.options("*", cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/translate", translateRoutes);

app.get("/", (req, res) => {
  res.send("Smart Pantry Chef API is running...");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Uncaught Exception Handler
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥", err);
  process.exit(1);
});

// Unhandled Promise Rejection Handler
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥", err);
  process.exit(1);
});

// ✅ Start server after DB connected
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  });
