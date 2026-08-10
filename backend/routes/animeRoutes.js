import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req,res) =>{
    try{
        const response = await axios.get(
            "https://api.jikan.moe/v4/top/anime"
        );
        res.json(response.data);
    } catch(error){
        console.error("TOP Anime Error:",error.message);
        res.status(500).json({
            message : " Top Anime data Fetch Failed"
            
        });
    }
});
router.get("/airing", async (req,res) => {
    try{
        const response = await axios.get(
            "https://api.jikan.moe/v4/top/anime?filter=airing"
        );
        res.json(response.data);
    }catch(error){
        console.error("Anime Airing Data Error",error.message);
        res.status(500).json({
            message: "Failed to fetch airing anime"
        });
    }
});
router.get("/search", async (req,res) => {
    try{
        const {q} = req.query;
        if(!q){
            return res.status(400).json({
                message: "Seach query is required"
            })
        }
        const response = await axios.get(
            `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}`
        );
        res.json(response.data);
    }catch(error){
        console.error("Search error",error.message);
        res.status(500).json({
            message: "Failed to search anime"
            
        });
    }
});
router.get("/:id", async (req,res) => {
    try{
        const {id} = req.params;
        const response = await axios.get(
            `https://api.jikan.moe/v4/anime/${id}/full`
        );
        res.json(response.data);
    }catch(error){
        console.error("Anime details error",error.message);

        res.status(500).json({
            message: "Failed to fetch anime details"
        });
    }
});
export default router;