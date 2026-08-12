import express from "express";
import Library from "../models/Library.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            mediaId,
            type,
            title,
            status,
            progress,
            rating
        } = req.body;

        if (!mediaId || !type || !title || !status) {
            return res.status(400).json({
                message: "Required fields are missing"
            });
        }

        const existingEntry = await Library.findOne({
            userId: req.userId,
            mediaId,
            type
        });

        if (existingEntry) {
            return res.status(400).json({
                message: "This item is already in your library"
            });
        }

        const libraryEntry = await Library.create({
            userId: req.userId,
            mediaId,
            type,
            title,
            status,
            progress,
            rating
        });

        res.status(201).json({
            message: "Added to library",
            libraryEntry
        });

    } catch (error) {
        console.error("Add to library error:", error.message);

        res.status(500).json({
            message: "Failed to add to library"
        });
    }
});
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, progress, rating } = req.body;

        const libraryEntry = await Library.findOne({
            _id: id,
            userId: req.userId
        });

        if (!libraryEntry) {
            return res.status(404).json({
                message: "Library entry not found"
            });
        }

        if (status !== undefined) {
            libraryEntry.status = status;
        }

        if (progress !== undefined) {
            libraryEntry.progress = progress;
        }

        if (rating !== undefined) {
            libraryEntry.rating = rating;
        }

        await libraryEntry.save();

        res.json({
            message: "Library entry updated",
            libraryEntry
        });

    } catch (error) {
        console.error("Update library error:", error.message);

        res.status(500).json({
            message: "Failed to update library entry"
        });
    }
});
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const libraryEntry = await Library.findOneAndDelete({
            _id: id,
            userId: req.userId
        });

        if (!libraryEntry) {
            return res.status(404).json({
                message: "Library entry not found"
            });
        }

        res.json({
            message: "Removed from library"
        });

    } catch (error) {
        console.error("Delete library error:", error.message);

        res.status(500).json({
            message: "Failed to remove from library"
        });
    }
});

export default router;