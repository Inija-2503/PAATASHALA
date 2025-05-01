const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const createError = require("../utils/appError");

//Register user
exports.signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return next(new createError("User already exist", 400));
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    //Assign JWT(json web token) to user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(201).json({
      status: "success",
      message: "User registered sucessfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

//Login user
exports.signin = async (req, res, next) => {};
