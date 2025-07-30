const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ overide: true });

// Initialize Express app
const app = express();

// Import routes
const authRoutes = require("./routes/auth");
const clientRoutes = require("./routes/client");
const projectRoutes = require("./routes/project");
const errorHandler = require("./middleware/errorHandler");

// Allowed origins for CORS
const allowedOrigins = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/clients", clientRoutes);
app.use("/projects", projectRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
// if (process.env.NODE_ENV !== "test") {
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// }

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app; // Export the app for testing purposes
