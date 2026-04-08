import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  currentYear: { type: String, required: true },
  cgpa: { type: String, required: true },
  grade10: { type: String, required: true },
  grade12: { type: String, required: true },

  customSkills: [
    {
      name: { type: String, required: true },
      level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Expert"],
        required: true,
      },
    },
  ],

  projects: [
    {
      title: String,
      description: String
    },
  ],

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);
export default Student;
