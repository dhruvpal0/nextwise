import { Course } from "../models/course.model.js";
import { CourseProgress } from "../models/courseProgress.js";

export const getCourseProgress = async(req,res) => {
    
    try {
        const {courseId} = req.params;
        const userId = req.id;

        // if (!courseId) {
        //     return res.status(400).json({ message: "Course ID is required." });
        // }
        
        // step-1 fetch the user course progress 
        let courseProgress = await CourseProgress.findOne({
            courseId,
            userId
        }).populate("courseId");
        
        const courseDetails = await Course.findById(courseId).populate('lectures');

        if(!courseDetails){
            return res.status(404).json({
                message:"Course not found"
            })
        }

        // step-2  if no progress found in the course return course details with an empty progress

        if (!courseProgress){
            return res.status(200).json({
                data:{
                    courseDetails,
                    progress:[],
                    completed:false
                }
            })
        } 
        // step - 3 return the user's course progress along with cours details
        return res.status(200).json({
            data:{
                courseDetails,
                progress: courseProgress.lectureProgress,
                completed: courseProgress.completed,
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong", error });
    }
}

export const updatedLectureProgress = async(req, res) =>{
    try {
        const {courseId, lectureId} = req.params;
        const userId = req.id;
        // fetch or create course progress

        let courseProgress = await CourseProgress.findOne({courseId,userId});
        
        if (!courseProgress){
            // if no progress exist , create a new record
            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed:false,
                lectureProgress:[]
            });
        } 
        // find the lecture progress in the course progress
        const lectureIndex = courseProgress.lectureProgress.findIndex(
            (lecture)=> lecture.lectureId === lectureId);

        if(lectureIndex !== -1){
            // if lecture already exist, update its status
            courseProgress.lectureProgress[lectureIndex].viewed = true;
        }else{
            // add new lecture progress
            courseProgress.lectureProgress.push({
                lectureId, 
                viewed:true,
            })
        }
        // if all lectures is complete 
        const lectureProgressLength = courseProgress.lectureProgress
            .filter((lectureProg) => lectureProg.viewed).length;

        const course = await Course.findById(courseId);

        if(course.lectures.length ===lectureProgressLength){
            courseProgress.completed =true;
        }

        await courseProgress.save();
    
        return res.status(200).json({
            message:"Lecture progress updated successfully."
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Something went wrong", error });
    }
}

export const markAsComplete = async (req,res) =>{
    try {
        const {courseId} = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({courseId,userId});
        if(!courseProgress) return res.status(404).json({
            message:"Course progress not found"
        });

        courseProgress.lectureProgress.map(
            (lectureProgress) =>lectureProgress.viewed =true);
        courseProgress.completed =true;
        await courseProgress.save();

        return res.status(200).json({message:"Course Marked as completed."})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong", error });
    }
}


export const markAsInComplete = async (req,res) =>{
    try {
        const {courseId} = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({courseId,userId});
        if(!courseProgress) return res.status(404).json({
            message:"Course progress not found"
        });

        courseProgress.lectureProgress.map(
            (lectureProgress) =>lectureProgress.viewed =false);
        courseProgress.completed =false;
        await courseProgress.save();

        return res.status(200).json({message:"Course Marked as Incompleted."})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong", error });

    }
}