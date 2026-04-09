import express from "express";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const { HF_TOKEN, AI_BACKEND_URL } = process.env;

/* ============================
    🔍 ENV VALIDATION
   ============================ */
if (!HF_TOKEN || !AI_BACKEND_URL) {
    console.error("❌ ENV ERROR: Missing HF_TOKEN or AI_BACKEND_URL");
}

/* ============================
    MULTER SETUP
   ============================ */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ============================
    AXIOS CONFIG HELPER
   ============================ */
// ✅ FIXED: Name matched to "getAxiosConfig" as used in routes below
const getAxiosConfig = (formDataHeaders = {}) => ({
    headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "x-wait-for-model": "true", // 🚀 Wake up HF Space
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
        const { name, history, profile } = req.body;
        if (!profile) return res.status(400).json({ error: "Profile missing" });

        const systemIdentity = `You are NovaBot... Degree: ${profile.degree}, CGPA: ${profile.cgpa}`;

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
            getAxiosConfig() // ✅ Now correctly calls the function
        );

        res.json(response.data);
    } catch (error) {
        console.error("❌ NovaBot Error:", error.message);
        res.status(500).json({ success: false, error: "NovaBot is resting." });
    }
});

/* ============================
    TOOL 2: SKILL GAP
   ============================ */
router.post("/skill-gap", upload.single("resume"), async (req, res) => {
    try {
        const { job_description, profile_json } = req.body;
        const formData = new FormData();
        formData.append("job_description", job_description);
        formData.append("profile_json", profile_json || "{}");

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
        console.error("❌ SkillGap Error:", error.message);
        res.status(500).json({ success: false, error: "Analysis failed." });
    }
});

/* ============================
    TOOL 3: RESUME ENHANCER
   ============================ */
router.post("/enhance-resume", upload.single("resume"), async (req, res) => {
    try {
        const { job_description, profile_json } = req.body;
        if (!req.file) return res.status(400).json({ error: "Resume file required" });

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
        console.error("❌ ResumeEnhancer Error:", error.message);
        res.status(500).json({ success: false, error: "Enhancement failed." });
    }
});

export default router;
