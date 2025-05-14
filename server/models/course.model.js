

import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
    courseTitle:{type:String,required:true},
    subTitle: {type:String}, 
    description:{ type:String},
    category:{type:String,required:true},
    courseLevel:{type:String,enum:["Beginner", 'Intermediate', "Advanced"],default:"Beginner"},
    coursePrice:{type:Number},
    courseThumbnail:{type:String,default:"https://res.cloudinary.com/dqppqvblk/image/upload/v1740665425/tdmbniu1sqmyntbyiybp.jpg"},
    enrolledStudents:[
        {type:mongoose.Schema.Types.ObjectId,ref:'User'}
    ],
    lectures:[
        {type:mongoose.Schema.Types.ObjectId,ref:"Lecture"}
    ],
    creator:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    isPublished:{type:Boolean,default:false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {timestamps:true});

export const Course = mongoose.model("Course", courseSchema);

            // title: { type: String, required: true },
            // description: { type: String },
            // videoUrl: { type: String, required: true },
            // duration: { type: Number, required: true }, // in seconds
    
    // price: { type: Number},
  
    // rating: { type: Number, default: 0 },
    // ratingCount: { type: Number, default: 0 },
    // image: { type: String, required: true },
    // instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // isDeleted: { type: Boolean, default: false },
    // publishedAt: { type: Date },
    // deletedAt: { type: Date },
    // reviews: [
    //     {
    //         user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    //         rating: { type: Number, required: true },
    //         comment: { type: String },
    //         createdAt: { type: Date, default: Date.now },
    //     }   
    // ],
    // prerequisites: { type: String },
    // requirements: { type: String },