import express from "express";
import axios from "axios";
const router = express.Router();
router.get("/", async (req,res) =>{
   try{
    const response = await axios.get(
        "https://api.jikan.moe/v4/top/manga"
    );
    res.json(response.data);
   }catch(error){
    console.error("Top Manga error",error.message);
    res.status(500).json({
        message: "Failed to fetcj top manga"
    });
   }
});
router.get("/search",async (req,res) => {
    try{
        const {q} = req.query;
        if(!q){
            return res.status(400).json({
                message: "Failed to search manga"
            })
        }
        const response = await axios.get(
            `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(q)}`
        );
        res.json(response.data);
    }catch(error){
        console.error("Manga search error",error.message)
        res.status(500).json({
            message: "Failed to search manga"
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.get(
            `https://api.jikan.moe/v4/manga/${id}/full`
        );

        res.json(response.data);
    } catch (error) {
        console.error("Manga Details Error:", error.message);

        res.status(500).json({
            message: "Failed to fetch manga details"
        });
    }
});

export default router;