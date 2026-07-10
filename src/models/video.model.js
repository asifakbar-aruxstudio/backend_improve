import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const videoSchema = new mongoose.Schema({

    videoFile: {
        type: String,
        required: true,
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    thumbnail: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

duration: {
        type: Number,
        required: true,
    },

    views: {    
        
type: Number,
        default: 0,
    },

    isPublic: {
        type: Boolean,
        default: true,
    },

        videoSchema.plugin("mongoose-paginate-v2")


},
{timestamps: true})
export const Video = mongoose.model("Video", videoSchema)