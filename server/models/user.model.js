import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    role:{type:String,enum:["student", 'instructor'],default:"student"},
    enrolledCourses:[{type:mongoose.Schema.Types.ObjectId, ref:'Course'}],
    photoUrl:{type:String, default:"https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg"},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:Date.now},
    googleId:{ String } // only for Google OAuth users
},
{timestamps:true}
);

export const User = mongoose.model("User", userSchema);

