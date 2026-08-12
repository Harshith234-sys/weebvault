import mongoose from "mongoose";

const librarySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        mediaId: {
            type: Number,
            required: true
        },

        type: {
            type: String,
            enum: ["anime", "manga"],
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "watching",
                "reading",
                "completed",
                "plan_to_watch",
                "plan_to_read",
                "dropped"
            ],
            required: true
        },

        currentEpisode: {
            type: Number,
            default: 0,
            min: 0
        },

        watchTimestamp: {
            type: Number,
            default: 0,
            min: 0
        },

        currentChapter: {
            type: Number,
            default: 0,
            min: 0
        },

        currentPage: {
            type: Number,
            default: 0,
            min: 0
        },

        rating: {
            type: Number,
            min: 0,
            max: 10,
            default: null
        },

        favorite: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Library = mongoose.model("Library", librarySchema);

export default Library;