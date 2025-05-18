import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/coursePurchase.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js"
import path from "path"; // 

dotenv.config({});

// call database connection 
connectDB();
const app = express();

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();
// console.log(__dirname);


app.use(express.json());
app.use(cookieParser());

app.use(cors({
    // origin: process.env.URL,//"http://localhost:5173",
    origin: ["http://localhost:5173", "https://nextwise.onrender.com"],
    credentials: true
}));

// APIs
app.use('/api/v1/media', mediaRoute)
app.use('/api/v1/user', userRoute);
app.use('/api/v1/course', courseRoute); // course route
app.use('/api/v1/purchase', purchaseRoute); // course purchase route
app.use('/api/v1/progress', courseProgressRoute)


app.use(express.static(path.join(__dirname, "client/dist")));// 
app.get("*",(req,res) =>{
    res.sendFile(path.resolve(__dirname, "client","dist", "index.html")); //
});

// home route

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


