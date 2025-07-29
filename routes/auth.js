const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/User");

const router = express.Router();

//  POST http://localhost:5000/auth/sign-up
router.post(
  "/sign-up",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email")
      .custom(async (value) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          throw new Error("Email already in use");
        }
        return true; // Proceed if no existing user found
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isAlphanumeric()
      .withMessage("Password must contain only letters and numbers")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters"),

    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
  ],
  authController.signUp
);

//  POST http://localhost:5000/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  authController.login
);

module.exports = router;
