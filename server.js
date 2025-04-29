const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;

require("dotenv").config(); // for MongoDB URI

// Middleware
app.use(express.json());
app.use(express.static("pages")); // serve HTML/CSS/JS from public folder

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Example route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
