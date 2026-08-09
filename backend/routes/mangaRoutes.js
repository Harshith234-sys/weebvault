import express from "express";
const router = express.Router();
router.get("/", (req,res) =>{
    res.json({
        message : "Manga API Working"
    });
});
export default router;