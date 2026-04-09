import express from "express";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const { HF_TOKEN, AI_BACKEND_URL } = process.env;

/* ============================
   🔍 ENV VALIDATION (CRITICAL)
   ============================ */
if (!HF_TOKEN || !AI_BACKEND_URL) {
  console.error("❌ ENV ERROR:");
  console.error("HF_TOKEN:", HF_TOKEN ? "✅ Present" : "❌ Missing");
  console.error("AI_BACKEND_URL:", AI_BACKEND_URL || "❌ Missing");

  throw new Error("Missing required environment variables");
} else {
  console.log("✅ ENV Loaded:");
  console.log("AI_BACKEND_URL:", AI_BACKEND_URL);
}

/* ============================
   MULTER SETUP
   ============================ */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ============================
   AXIOS CONFIG
   ============================ */
const getAxiosConfig = (formDataHeaders = {}) => ({
  headers: {
    Authorization: `Bearer ${HF_TOKEN}`,
    "x-wait-for-model": "true",
    "x-use-cache": "false",
    ...formDataHeaders,
  },
  timeout: 90000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

/* ============================
   TOOL 1: NOVABOT CHAT
   ============================ */
router.post("/chat", async (req, res) => {
  try {
    console.log("➡️ /chat called");

    const { name, history, profile } = req.body;

    if (!profile) {
      return res.status(400).json({ error: "Profile missing" });
    }

    const systemIdentity = `SYSTEM NOTE: You are NovaBot...
- Degree: ${profile.degree}
- Year: ${profile.currentYear}
- CGPA: ${profile.cgpa}
- Skills: ${profile.skills?.join(", ") || "None listed"}
- Projects: ${profile.projects?.join(", ") || "None started"}`;

    console.log("📡 Calling AI:", `${AI_BACKEND_URL}/novabot-chat`);

    const response = await axios.post(
      `${AI_BACKEND_URL}/novabot-chat`,
      {
        name: name || "Student",
        goals: [`Guidance for ${profile.degree}`, ...(profile.skills || [])],
        history: [
          { role: "user", content: systemIdentity },
          { role: "assistant", content: "Profile synced." },
          ...(history || [])
        ]
      },
      getAxiosConfig()
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ NovaBot Error FULL:", {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status
    });

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

/* ============================
   TOOL 2: SKILL GAP
   ============================ */
router.post("/skill-gap", upload.single("resume"), async (req, res) => {
  try {
    console.log("➡️ /skill-gap called");

    const { job_description, profile_json } = req.body;

    if (!job_description) {
      return res.status(400).json({ error: "Job description missing" });
    }

    const formData = new FormData();
    formData.append("job_description", job_description);
    formData.append("profile_json", profile_json || "{}");

    if (req.file) {
      console.log("📄 Resume received:", req.file.originalname);

      formData.append("resume", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
    }

    console.log("📡 Calling AI:", `${AI_BACKEND_URL}/skill-gap`);

    const response = await axios.post(
      `${AI_BACKEND_URL}/skill-gap`,
      formData,
      getAxiosConfig(formData.getHeaders())
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ SkillGap Error FULL:", {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status
    });

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

/* ============================
   TOOL 3: RESUME ENHANCER
   ============================ */
router.post("/enhance-resume", upload.single("resume"), async (req, res) => {
  try {
    console.log("➡️ /enhance-resume called");

    const { job_description, profile_json } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Resume file required" });
    }

    const formData = new FormData();
    formData.append("resume", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    formData.append("job_description", job_description || "");
    formData.append("profile_json", profile_json || "{}");

    console.log("📡 Calling AI:", `${AI_BACKEND_URL}/enhance-resume`);

    const response = await axios.post(
      `${AI_BACKEND_URL}/enhance-resume`,
      formData,
      getAxiosConfig(formData.getHeaders())
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ ResumeEnhancer Error FULL:", {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status
    });

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

export default router;
