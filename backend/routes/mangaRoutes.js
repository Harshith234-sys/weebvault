import express from "express";
import axios from "axios";

const router = express.Router();

const MAL_URL = "https://api.myanimelist.net/v2";

// Create instance WITHOUT baking in the client ID at import time
const malClient = axios.create({
    baseURL: MAL_URL,
    timeout: 15000
});

// Attach the header fresh on every request, so it doesn't matter
// whether dotenv finished loading before this file was imported
malClient.interceptors.request.use((config) => {
    config.headers["X-MAL-CLIENT-ID"] = process.env.MAL_CLIENT_ID;
    return config;
});

// ===============================
// TOP MANGA
// GET /api/manga
// ===============================

router.get("/", async (req, res) => {
    console.log("GET /api/manga");

    try {
        console.log("CLIENT ID EXISTS:", !!process.env.MAL_CLIENT_ID);

        const response = await malClient.get("/manga/ranking", {
            params: {
                ranking_type: "all",
                limit: 25,
                fields: "id,title,main_picture,num_chapters,num_volumes,status,mean,rank,popularity,genres"
            }
        });

        console.log("STATUS:", response.status);

        res.json(response.data);

    } catch (error) {
        console.error("TOP MANGA ERROR");
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);

        res.status(error.response?.status || 500).json({
            message: "Failed to fetch top manga",
            error: error.response?.data || error.message
        });
    }
});


// ===============================
// SEARCH MANGA
// GET /api/manga/search?q=one piece
// ===============================

router.get("/search", async (req, res) => {
    console.log("GET /api/manga/search");

    try {
        const { q } = req.query;

        if (!q || !q.trim()) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const response = await malClient.get("/manga", {
            params: {
                q: q.trim(),
                limit: 25,
                fields: "id,title,main_picture,num_chapters,num_volumes,status,mean,rank,popularity,genres"
            }
        });

        console.log("MAL Manga Search Status:", response.status);

        res.json(response.data);

    } catch (error) {
        console.error("MANGA SEARCH ERROR");
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);

        res.status(error.response?.status || 500).json({
            message: "Failed to search manga",
            error: error.response?.data || error.message
        });
    }
});


// ===============================
// MANGA DETAILS
// GET /api/manga/:id
// ===============================

router.get("/:id", async (req, res) => {
    console.log(`GET /api/manga/${req.params.id}`);

    try {
        const response = await malClient.get(`/manga/${req.params.id}`, {
            params: {
                fields: "id,title,alternative_titles,main_picture,num_chapters,num_volumes,status,mean,rank,popularity,genres,synopsis,authors{first_name,last_name}"
            }
        });

        console.log("MAL Manga Details Status:", response.status);

        res.json(response.data);

    } catch (error) {
        console.error("MANGA DETAILS ERROR");
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);

        res.status(error.response?.status || 500).json({
            message: "Failed to fetch manga details",
            error: error.response?.data || error.message
        });
    }
});

export default router;
