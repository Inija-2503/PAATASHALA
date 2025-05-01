const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const authRouter = require("./routes/authRoute");
const PORT = process.env.PORT || 3000;

require("dotenv").config(); // for MongoDB URI

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("frontend")); // serve HTML/CSS/JS from public folder

//Route
app.use("/api/auth", authRouter);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

//Global Error Handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Example route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
