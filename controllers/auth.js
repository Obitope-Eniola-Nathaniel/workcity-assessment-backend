const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    // Extract user details from request body
    const { name, email, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email already exists.");
      error.statusCode = 409;
      throw error;
    }
    if (password !== confirmPassword) {
      const error = new Error("Passwords do not match.");
      error.statusCode = 400;
      throw error;
    }

    // Hash password before saving into the database
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate Input
    if (!email || !password) {
      const error = new Error("Email and password are required.");
      error.statusCode = 400;
      throw error;
    }

    // Find user By Email
    const user = await User.findOne({ email });

    // Validate user and password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "Login Successfully",
      token,
      user: {
        id: user._id,
        user: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};
