import { populate } from "dotenv";
import {Course} from "../models/course.model.js";
import {Lecture} from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category} = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields!' });
        }
        const newCourse  = await Course.create({
            courseTitle,
            category,
            creator:req.id,
        });
        console.log("req.id:", req.id);

        return res.status(201).json({ 
            success: true, 
            message: 'Course created successfully',
            course: newCourse,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to create course!'});
    }
};

export const searchCourse = async (req, res) =>{
    try {
        const {query = "", categories= [], sortByPrice=""} = req.query;
        
        // create search query 
        const SearchCriteria = {
            isPublished:true,
            $or:[
                {courseTitle: {$regex:query, $options:"i"}},
                {subTitle: {$regex:query, $options:"i"}},
                {category: {$regex:query, $options:"i"}},
            ]
        }
        // if categories are selected
        if(categories.length > 0){
            SearchCriteria.category = {$in: categories};
        }
        // define sorting order
        const sortOptions = {};
        if(sortByPrice ==="low"){
            sortOptions.coursePrice = 1; // sort by Price in accending oeder
        } else if (sortByPrice === "high"){
            sortOptions.coursePrice = -1;
        }

        let courses = await Course.find(SearchCriteria).populate({path:"creator",select:"name photoUrl" }).sort(sortOptions);
        
        return res.status(200).json({
            success:true,
            courses: courses || []
        });

    } catch (error) {
        console.log(error);
    }
}

export const getPublishedCourse = async (_, res) => {   
    try {
        const courses = await Course.find({isPublished:true}).populate({path:"creator", select: "name photoUrl"});
        if (!courses) {
            return res.status(404).json({ 
                success: false, 
                message: 'No published courses found!' });
        }  
        return res.status(200).json({
            success: true,
            // message: 'All published courses fetched successfully',
            courses,
        });

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to get published course!'});
    } 
}

export const getCreatorCourses = async (req, res) => {
    try {
        const  userId  = req.id;
        const courses = await Course.find({creator:userId});
        //   .populate("creator", "name email");
        if (!courses) {
            return res.status(404).json({ 
                courses: [],
                success: false, 
                message: 'No courses found for this user!' });
        }  
        return res.status(200).json({
            // success: true,
            // message: 'All courses fetched successfully',
            courses,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to fetch courses!'});
    }
};

export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description, category, courseLevel, } = req.body;        
                // extract public id of the old image from the ulr is it exists

        let coursePrice = req.body.coursePrice;
        coursePrice = coursePrice ? Number(coursePrice) : undefined;

        if (coursePrice !== undefined && isNaN(coursePrice)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid course price provided',
            });
        }

        const thumbnail = req.file?.path || null;
        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ 
                success: false, 
                message: 'Course not found!' });
        }
                // upload new image to cloudinary
        let courseThumbnail ;
        if (thumbnail){
            if (course.thumbnail) {
                // const publicId = course.thumbnail.split('/').pop().split('.')[0];
                const publicId = course.thumbnail.match(/\/([^/]+)\.(jpg|jpeg|png|webp|gif)$/i)?.[1];
                await deleteMediaFromCloudinary(publicId); // delete old deleteCloudinaryImage
            }
            // upload new thumbnail to cloudinary
        courseThumbnail = await uploadMedia(thumbnail); //.path
        }

        const updatedData = {
            courseTitle,
            subTitle,
            description,
            category,
            courseLevel,
            coursePrice,
        };
        if (coursePrice !== undefined) {
            updatedData.coursePrice = coursePrice;
        }
        
        if (courseThumbnail?.secure_url) {
            updatedData.courseThumbnail = courseThumbnail.secure_url;
        }
        if (course.courseThumbnail) {
            const publicId = course.courseThumbnail.split('/').pop().split('.')[0]; // extract public id from the url
            await deleteMediaFromCloudinary(publicId);
        }
        course = await Course.findByIdAndUpdate(courseId, updatedData, { new: true });

        return res.status(200).json({ 
            success: true, 
            message: 'Course updated successfully',
            course,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to edit course!'});
        
    }
};

export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        
        const course = await Course.findById(courseId); //.populate("creator", "name email");
        if (!course) {
            return res.status(404).json({ 
                // success: false, 
                message: 'Course not found!' });
        }  
        return res.status(200).json({
            success: true,
            message: 'Course fetched successfully',
            course,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to get course by ID!'});
    }
};

// export const deleteCourse = async (req, res) => {
//     try {
//         const courseId = req.params.courseId;
        
//         const course = await Course.findById(courseId);
//         if (!course) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: 'Course not found!' });
//         }  
//         if (course.thumbnail) {
//             const publicId = course.thumbnail.split('/').pop().split('.')[0];
//             await deleteMediaFromCloudinary(publicId); // delete old deleteCloudinaryImage
//         }
//         await Course.findByIdAndDelete(courseId);
//         return res.status(200).json({
//             success: true,
//             message: 'Course deleted successfully',
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ 
//             success: false, 
//             message: error.message || 'Failed to delete course!'});
//     }
// }

export const createLecture = async (req, res) => {  
    try {
        const {lectureTitle} = req.body;
        const {courseId} = req.params;
        if (!lectureTitle || !courseId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields!' });
        };
        // create a new lecture
        const lecture = await Lecture.create({
            lectureTitle
            // videoUrl: req.file.path,
            // publicId: req.file.filename,
            // isPreview: false,
        });

        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }
        return res.status(201).json({
            success: true, 
            message: 'Lecture created successfully',
            lecture,
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to create lecture!'});
    }
};

export const getCourseLecture = async (req, res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if(!course) {
            return res.status(404).json({ 
                success: false, 
                message: 'Course not found!' });
        }
        return res.status(200).json({
            success: true,
            message: 'Course lectures fetched successfully',
            lectures: course.lectures, // only return the lectures
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to get course!'});
    }
};

// export const getPublishedLecture = async (_, res) => {   
//     try {
//         const lectures = await Lecture.find({isPublished:true}).populate({path:"creator", select: "name photoUrl"});
//         if (!lectures) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: 'No published lecture found!' });
//         }  
//         return res.status(200).json({
//             success: true,
//             // message: 'All published courses fetched successfully',
//             lectures,
//         });

        
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ 
//             success: false, 
//             message: error.message || 'Failed to get published lecture!'});
//     } 
// }

export const editLecture = async (req, res) => {    
    try {
        // console.log("Request body:", req.body);
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;

        const {courseId, lectureId} = req.params;
        console.log("Params received:", { courseId, lectureId });
        if (!courseId || !lectureId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields!'
            });
        };
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ 
                success: false, 
                message: 'Lecture not found!' });
        }

        console.log("Lecture found:", lecture);

        if (lecture.videoUrl) {
            const publicId = lecture.videoUrl.split('/').pop().split('.')[0]; // extract public id from the url
            await deleteVideoFromCloudinary(publicId);
        }
        // if (videoInfo?.publicId && lecture.publicId && lecture.publicId !== videoInfo.publicId) {
        //     await deleteVideoFromCloudinary (lecture.publicId);
        // }

        // update the lecture
        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        if (typeof isPreviewFree === "boolean") lecture.isPreviewFree = isPreviewFree;

        await lecture.save();
        // ensure the course still has the lecture id if it was not already added
        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        };

        return res.status(200).json({
            message: 'Lecture updated successfully',
            success: true,
            lecture,
        });
    } catch (error) {   
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to edit lecture!'});
        
    }

};

export const removeLecture = async (req, res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture) {
            return res.status(404).json({ 
                success: false, 
                message: 'Lecture not found!' });
        }
        // delete the lecture form cloudinary as well
        if(lecture.publicId) {
            await deleteMediaFromCloudinary(lecture.publicId); // delete old deleteCloudinaryImage
        }
        if (lecture.videoUrl) {
            const publicId = lecture.videoUrl.split('/').pop().split('.')[0]; // extract public id from the url
            await deleteVideoFromCloudinary(publicId);
        }
        // remove the lecture reference from the associated course
        await Course.updateOne(
            {lectures: lectureId}, //  find the course with the lecture
            {$pull: {lectures: lectureId}} // remove the lecture from the course's lectures array
        );
        return res.status(200).json({
            success: true,
            message: 'Lecture removed successfully',
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to remove lecture!'});
    }
};

export const getLectureById = async (req, res) => {
    try {
        const  {lectureId} = req.params;    
        const lecture = await Lecture.findById(lectureId);
        if(!lecture) {
            return res.status(404).json({ 
                success: false, 
                message: 'Lecture not found!' });
        }
        return res.status(200).json({
            success: true,
            message: 'Lecture fetched successfully',
            lecture,
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to get lecture by ID!'});
        
    }
};

// export const deleteLecture = async (req, res) => {
//     try {
//         const {courseId, lectureId} = req.params;
//         if (!courseId || !lectureId) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Please provide all required fields!' });
//         };
//         const course = await Course.findById(courseId);
//         if (!course) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: 'Course not found!' });
//         }  
//         const lecture = await Lecture.findById(lectureId);
//         if (!lecture) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: 'Lecture not found!' });
//         }  
//         // delete the lecture from the course
//         course.lectures = course.lectures.filter((lec) => lec.toString() !== lecture._id.toString());
//         await course.save();
        
//         // delete the lecture from the database
//         await Lecture.findByIdAndDelete(lectureId);
        
//         // delete the video from cloudinary
//         if (lecture.publicId) {
//             await deleteMediaFromCloudinary(lecture.publicId); // delete old deleteCloudinaryImage
//         }
        
//         return res.status(200).json({
//             success: true,
//             message: 'Lecture deleted successfully',
//             course,
//         });
//     } catch (error) {   
//         console.error(error);
//         return res.status(500).json({ 
//             success: false, 
//             message: error.message || 'Failed to remove lecture!'});
        
//     }
// }

export const togglePublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { publish } = req.query; // true or false
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ 
                success: false, 
                message: 'Course not found!' });
        };
        // publish or unpublish the course status based on the query parameter
        course.isPublished = publish === 'true' ? true : false;
        await course.save();
        const statusMessage = publish === 'true' ? 'published' : 'unpublished';
        return res.status(200).json({
            success: true,
            message: `Course ${statusMessage} successfully`,
            course,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to get update status of course!'});
    }
}

export const removeCourse = async (req, res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findByIdAndDelete(courseId);
        if(!course) {
            return res.status(404).json({ 
                success: false, 
                message: 'Course not found!' });
        }
        // delete the lecture form cloudinary as well
        if(course.publicId) {
            await deleteMediaFromCloudinary(course.publicId); // delete old deleteCloudinaryImage
        }
        if (course.videoUrl) {
            const publicId = course.videoUrl.split('/').pop().split('.')[0]; // extract public id from the url
            await deleteMediaFromCloudinary(publicId);
        }
        // remove the lecture reference from the associated course
        await Course.updateOne(
            {courses: courseId}, //  find the course with the lecture
            {$pull: {courses: courseId}} // remove the lecture from the course's lectures array
        );
        return res.status(200).json({
            success: true,
            message: 'Course removed successfully',
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to remove lecture!'});
    }
};

