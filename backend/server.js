const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
require("dotenv").config(); // for MongoDB URI

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("frontend")); // serve HTML/CSS/JS from public folder

const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// User Model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

// Utility for error handling
class createError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

// Sign-Up Controller
const signup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    console.log("Received signup data:", req.body);

    // Check if passwords match
    if (password !== confirmPassword) {
      return next(new createError("Passwords do not match", 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new createError("User already exists", 400));
    }

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
      console.log("Password hashed successfully");
    } catch (hashError) {
      console.error("Error hashing password:", hashError);
      return next(new createError("Error hashing password", 500));
    }

    // Create new user
    let newUser;
    try {
      newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      console.log("User created successfully");
    } catch (createUserError) {
      console.error("Error creating user:", createUserError);
      return next(new createError("Error creating user", 500));
    }

    // Assign JWT token
    let token;
    try {
      token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      console.log("JWT token generated successfully");
    } catch (jwtError) {
      console.error("Error generating JWT:", jwtError);
      return next(new createError("Error generating JWT", 500));
    }

    // Send response
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    next(error);
  }
};

// Sign-In Controller
const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Received signin data:", req.body);

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(new createError("User not found", 404));
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new createError("Invalid email or password", 401));
    }

    // 3. Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // 4. Send response
    res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    console.error("Error during signin:", error);
    next(error);
  }
};

// Routes
app.post("/api/auth/pages/signup", signup);
app.post("/api/auth/pages/signin", signin);

// Global Error Handler
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
