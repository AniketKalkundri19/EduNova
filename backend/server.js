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

// --- LIVE PRODUCTION CONFIGURATION ---
const allowedOrigins = [
    "http://localhost:5173",                             // Local development
    "https://edunova-eta-flax.vercel.app/",          // Your Actual Vercel URL
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        // Check if the requesting site is in our allowed list
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            return callback(new Error("CORS policy blocked this origin"), false);
        }
    },
    credentials: true,
}));
// -------------------------------------

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.send("EduNova API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
