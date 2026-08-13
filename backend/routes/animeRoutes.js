import express from "express";
import axios from "axios";

const router = express.Router();

const MAL_URL = "https://api.myanimelist.net/v2";


// ================================
// TOP ANIME
// GET /api/anime
// ================================

router.get("/", async (req, res) => {
    try {

        const response = await axios.get(
            `${MAL_URL}/anime/ranking`,
            {
                params: {
                    ranking_type: "all",
                    limit: 25
                },
                headers: {
                    "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID
                }
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(
            "Top Anime Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Failed to fetch top anime"
        });
    }
});


// ================================
// AIRING ANIME
// GET /api/anime/airing
// ================================

router.get("/airing", async (req, res) => {
    try {

        const now = new Date();

        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        let season;

        if (month <= 3) {
            season = "winter";
        } else if (month <= 6) {
            season = "spring";
        } else if (month <= 9) {
            season = "summer";
        } else {
            season = "fall";
        }

        const response = await axios.get(
            `${MAL_URL}/anime/season/${year}/${season}`,
            {
                params: {
                    limit: 25
                },
                headers: {
                    "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID
                }
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(
            "Airing Anime Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Failed to fetch airing anime"
        });
    }
});


// ================================
// SEARCH ANIME
// GET /api/anime/search?q=naruto
// ================================

router.get("/search", async (req, res) => {
    try {

        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const response = await axios.get(
            `${MAL_URL}/anime`,
            {
                params: {
                    q: q,
                    limit: 25
                },
                headers: {
                    "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID
                }
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(
            "Anime Search Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Failed to search anime"
        });
    }
});


// ================================
// ANIME DETAILS
// GET /api/anime/:id
// ================================

router.get("/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const response = await axios.get(
            `${MAL_URL}/anime/${id}`,
            {
                params: {
                    fields: "id,title,main_picture,num_episodes"
                },
                headers: {
                    "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID
                }
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(
            "Anime Details Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Failed to fetch anime details"
        });
    }
});


export default router;
