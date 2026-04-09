import express from "express";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const { HF_TOKEN, AI_BACKEND_URL } = process.env;

const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🚀 Helper: Centralized Axios Config to handle Hugging Face "Cold Starts"
const getAxiosConfig = (formDataHeaders = {}) => ({
  headers: {
    Authorization: `Bearer ${HF_TOKEN}`,
    "x-wait-for-model": "true", // ✅ Forces HF to wake up the space instead of 500 error
    "x-use-cache": "false",
    ...formDataHeaders,
  },
  timeout: 90000, // ⏳ AI processing takes time; increased to 90 seconds
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

/* ============================
    TOOL 1: NOVABOT CHAT
   ============================ */
router.post("/chat", async (req, res) => {
  try {
    const { name, history, profile } = req.body;

    const systemIdentity = `SYSTEM NOTE: You are NovaBot, a professional academic mentor. 
You have access to ${name}'s verified database.
DB RECORD:
- Degree: ${profile.degree}
- Year: ${profile.currentYear}
- CGPA: ${profile.cgpa}
- Skills: ${profile.skills?.join(", ") || "None listed"}
- Projects: ${profile.projects?.join(", ") || "None started"}

FORMATTING RULES:
1. Use **bolding** for key terms.
2. Use ### for section headers.
3. Use bullet points for lists.`;

    const response = await axios.post(
      `${AI_BACKEND_URL}/novabot-chat`,
      {
        name: name || "Student",
        goals: [`Guidance for ${profile.degree}`, ...(profile.skills || [])],
        history: [
          { role: "user", content: systemIdentity },
          { role: "assistant", content: "Profile synced. I am ready to assist." },
          ...(history || [])
        ]
      },
      getAxiosConfig()
    );

    res.json(response.data);
  } catch (error) {
    console.error("NovaBot Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: "NovaBot is temporarily resting." });
  }
});

/* ============================
    TOOL 2: SKILL GAP ANALYZER
   ============================ */
router.post("/skill-gap", upload.single("resume"), async (req, res) => {
  try {
    const { job_description, profile_json } = req.body;

    const formData = new FormData();
    formData.append("job_description", job_description);
    formData.append("profile_json", profile_json);

    if (req.file) {
      formData.append("resume", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
    }

    const response = await axios.post(
      `${AI_BACKEND_URL}/skill-gap`,
      formData,
      getAxiosConfig(formData.getHeaders())
    );

    res.json(response.data);
  } catch (error) {
    console.error("SkillGap Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: "Analysis failed." });
  }
});

/* ============================
    TOOL 3: RESUME ENHANCER
   ============================ */
router.post("/enhance-resume", upload.single("resume"), async (req, res) => {
  try {
    const { job_description, profile_json } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, error: "Resume file is required." });
    }

    const formData = new FormData();
    formData.append("resume", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    formData.append("job_description", job_description || "");
    formData.append("profile_json", profile_json || "{}");

    const response = await axios.post(
      `${AI_BACKEND_URL}/enhance-resume`,
      formData,
      getAxiosConfig(formData.getHeaders())
    );

    res.json(response.data);
  } catch (error) {
    console.error("ResumeEnhancer Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: "Resume enhancement failed." });
  }
});

export default router;
