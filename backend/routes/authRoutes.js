import { Router } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken"; // 🔑 1. Import JWT

const router = Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    // 🔑 2. Generate a 2-hour token for the newly signed-up user
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, // Make sure you have a JWT_SECRET in your .env file
      { expiresIn: "2h" }
    );

    res.status(201).json({
      message: "Signup successful 🎉",
      token: token, // 🔑 3. Send the token back to the frontend
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isNewUser: true   // used by frontend
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔑 4. Generate the 2-hour token for the logged-in user
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET, 
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login successful ✅",
      token: token, // 🔑 5. Send the token back to the frontend
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isNewUser: false
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;