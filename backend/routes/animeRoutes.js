import express from "express";
const router = express.Router();
router.get("/",(req,res) =>{
    res.json({
        message : "Anime Api is working"
    });
});
export default router;