import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import aiRoutes from "./routes/aiRoutes-temp.js";

dotenv.config();
connectDB();

const app = express();

// --- MODIFIED CORS SECTION ---
const allowedOrigins = [
    "http://localhost:5173",                     // Local development
    "https://your-edunova-frontend.vercel.app",  // Add your Vercel/Netlify URL here
    "https://your-custom-domain.com"             // If you have a custom domain
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error("CORS policy blocked this origin"), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
// -----------------------------

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/ai", aiRoutes);

// Root route for health check (useful for Render/Railway)
app.get("/", (req, res) => {
    res.send("EduNova API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
