import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import animeRoutes from "./routes/animeRoutes.js";
import mangaRoutes from "./routes/mangaRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js"

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get("/",(req,res) =>{
    res.json({
        mesaage : "Backend is running"
    });
});

app.use("/api/anime",animeRoutes);
app.use("/api/manga",mangaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/library", libraryRoutes);

const PORT = process.env.PORT || 5000;
connectDB();
app.post("/test", (req, res) => {
    res.json({
        message: "POST is working"
    });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
