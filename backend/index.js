const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
const authRoutes = require("./src/routes/authRoutes");
const mlRoutes = require("./src/routes/mlRoutes");
const recipeRoutes = require("./src/routes/recipeRoutes");
const translateRoutes = require("./src/routes/translateRoutes");

// Load environment variables
dotenv.config();

// Log environment variables for debugging
console.log("Environment variables loaded:");
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- MONGO_URI:", process.env.MONGO_URI ? "***" : "Not set");
console.log("- JWT_SECRET:", process.env.JWT_SECRET ? "***" : "Not set");
console.log("- PORT:", process.env.PORT);

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
const startServer = async () => {
  try {
    await connectDB();

    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/ml", mlRoutes);
    app.use("/api/recipes", recipeRoutes);
    app.use("/api/translate", translateRoutes);

    // Basic route for testing
    app.get("/", (req, res) => {
      res.send("Smart Pantry Chef API is running...");
    });

    // Handle 404
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: "API endpoint not found",
      });
    });

    // Error handling middleware
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      console.error("Error:", err.stack);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? err.message
            : "Something went wrong!",
      });
    });

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
      );
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("UNHANDLED REJECTION! 💥 Shutting down...");
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    return server;
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥");
  console.error("Error:", err);
  // Close server & exit process
  process.exit(1);
});

// Start the server
const server = startServer();

module.exports = server;
