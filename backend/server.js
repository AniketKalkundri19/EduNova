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
    "http://localhost:5173",
    "https://edunova-eta-flax.vercel.app"// ✅ FIXED: Removed the trailing slash
   
];

app.use(cors({
    origin: function (origin, callback) {
        // 1. Allow internal requests/mobile/Postman
        if (!origin) return callback(null, true);
        
        // 2. Exact match check
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } 
        
        // 3. Pattern match check (Optional: Allows all Vercel subdomains for your project)
        if (origin.endsWith(".vercel.app") && origin.includes("edunova")) {
            return callback(null, true);
        }

        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("CORS policy blocked this origin"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
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
