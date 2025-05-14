import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({ 
    lectureTitle: {type: String,required: true},  
        videoUrl: {type: String, default: ""}, // Default value is an empty string
        publicId: {type: String, default: ""}, // Default value is an empty string
    isPreviewFree: {type: Boolean,default: false}, // Default value is false
},{timestamps: true} // Add timestamps to the schema
);

export const Lecture =  mongoose.model("Lecture", lectureSchema);