import express from "express";
import mongoose from "mongoose";
import Student from "../models/Student.js";

const router = express.Router();

// ✅ Save Student Details
router.post("/add", async (req, res) => {
  try {
    const {
      degree,
      currentYear,
      cgpa,
      grade10,
      grade12,
      customSkills,
      projects,
      userId,
    } = req.body;

    // 🔐 Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // 🧠 Prevent duplicate student profile
    const existingStudent = await Student.findOne({ userId });
    if (existingStudent) {
      return res
        .status(409)
        .json({ message: "Student profile already exists" });
    }

    const student = new Student({
      degree,
      currentYear,
      cgpa,
      grade10,
      grade12,
      customSkills,
      projects,
      userId: new mongoose.Types.ObjectId(userId),
    });

    await student.save();

    res.status(201).json({
      message: "Student data saved successfully",
      student,
    });
  } catch (error) {
    console.error("❌ Error saving student:", error);
    res.status(500).json({
      message: "Failed to save student data",
      error: error.message,
    });
  }
});

// ✅ Fetch Student Details by userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const student = await Student.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("❌ Error fetching student:", error);
    res.status(500).json({
      message: "Error fetching student",
      error: error.message,
    });
  }
});

// Update Student Profile
router.put("/:userId", async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update profile", error });
  }
});

export default router;
