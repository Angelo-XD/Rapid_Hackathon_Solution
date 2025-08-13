const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const trainRoutes = require("./routes/train");
const cookieParser = require("cookie-parser");

app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Opener-Policy");
  res.removeHeader("Cross-Origin-Embedder-Policy");
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.options("*", cors());

dotenv.config();

// MongoDB connection
mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://221201010:angieangelo@rapidtrainscluster.txzdz7f.mongodb.net/?retryWrites=true&w=majority&appName=rapidtrainscluster",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/trains", trainRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("🚂 Train Search API is running...");
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
