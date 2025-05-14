import Loading from "@/components/Loading";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation, useRemoveCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {

    const [input, setInput] = useState({
        courseTitle:"",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: "",
    });
    const params = useParams();
    const courseId = params.courseId; // Extracting courseId from URL using useParams

    const {data:courseByIdData, isLoading:courseByIdLoading, refetch} = useGetCourseByIdQuery(courseId, {refetchOnMountOrArgChange:true});
    const [publishCourse ] = usePublishCourseMutation(courseId);
    
    useEffect(() => {
        if (courseByIdData?.course){
            const course = courseByIdData?.course;
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: course.courseThumbnail,
            });
        }
        },[courseByIdData]);
        

    const[previewThumbnail,setPreviewThumbnail] = useState(null);
    const navigate = useNavigate();
    // const courseId = window.location.pathname.split("/").pop(); // Extracting courseId from URL
    
    const [editCourse, { data, isLoading, isSuccess, error}] = useEditCourseMutation();
    const [ removeCourse,{data:removeData, isLoading:removeLoading, isSuccess:removeSuccess} ] = useRemoveCourseMutation();
    

    const handleBack = () => {
        navigate(-1); // This goes back to the previous page in the browser history
    };
    const changeEventhandler = (e) => {
        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value,
        });
    };
    const selectCategory = (value) => {
        setInput({ ...input,category: value});
    }
    const selectCourseLevel = (value) => {
        setInput({...input,courseLevel: value,});
    };
    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file){
            setInput({ ...input, courseThumbnail: file });
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewThumbnail(fileReader.result);
            };
            fileReader.readAsDataURL(file);
        }
    };
    // const updateCourseHandler = async () => {
    //     console.log("Course updated successfully", input);
    // }
        const updateCourseHandler = async () => { 
        if (!input.courseTitle) {
            toast.error("Please fill in all required fields.");
            return;}   
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("courseLevel", input.courseLevel);
        formData.append("coursePrice", input.coursePrice);
        // formData.append("courseThumbnail", input.courseThumbnail);
        if (input.courseThumbnail instanceof File) {
            formData.append("courseThumbnail", input.courseThumbnail); // Assuming backend expects 'file' key
          }
        await editCourse({formData,courseId});
        navigate("/admin/course");
    }
    const publishStatusHandler = async (action) => {
        // Logic to toggle publish status
        const resposnse = await publishCourse({courseId, query: action});

        if (resposnse.data) {
            refetch();
            toast.success(resposnse.data.message || "Failed to update publish status!");
        } else {
            toast.error( resposnse.error.data.message||"Failed to update publish status!");
        }
    }
    const removeCourseHandler = async () => {
        await removeCourse(courseId);
    } 

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "Course updated successfully!");
        }
        if (error) {
            toast.error(error.data.message || "Failed to update course!");
        }
    }
    , [isSuccess, error, data]);
    
        useEffect(()=>{
            if(removeSuccess){
                toast.success(removeData.message);
                navigate(-1);
            }
        }
        ,[removeSuccess]);

    if(courseByIdLoading) return <Loading/>


    
    return (
        <div>
            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <div>
                        <CardTitle className="font-bold text-xl">
                            Basic Information
                        </CardTitle>
                        <CardDescription>
                            Make changes in your courses here. Click save when you're done.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button className=""
                        variant={courseByIdData?.course.isPublished ? "secondary" : "default"}
                        disabled={courseByIdData?.course.lectures.length ===0 }
                        onClick={()=>publishStatusHandler(courseByIdData?.course.isPublished ? "false": 'true')} 
                        >
                            {courseByIdData?.course.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                        <Button disabled={removeLoading} variant="destructive" onClick={removeCourseHandler} >
                            {
                                removeLoading ? <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </> : "Remove Course"
                            }</Button>                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 "></div>
                    <div className="flex flex-col gap-2 mb-4">
                        <Label htmlFor="course-name" className="text-sm font-semibold">
                            Title
                        </Label>
                        <Input
                            type="text"
                            name="courseTitle"
                            value={input.courseTitle}
                            onChange={changeEventhandler}
                            placeholder="Enter course name"
                            className="border p-2 rounded-md"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                        <Label 
                            htmlFor="SubTitle" 
                            className="text-sm font-semibold">
                            SubTitle
                        </Label>
                        <textarea
                            type="text"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventhandler}
                            placeholder="Enter course SubTitle"
                            className="border p-2 rounded-md bg-transparent"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2 mb-4">
                        <Label
                            htmlFor="course-description"
                            className="text-sm font-semibold">Course Description
                        </Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="flex flex-col gap-2 mb-4">
                            <Label>Category</Label>
                            <Select onValueChange={selectCategory} value={input.category}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a Category" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-black text-black dark:text-white">
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <hr />
                                        <SelectItem value="Web Development">
                                            Web Development
                                        </SelectItem>
                                        <SelectItem value="Mobile Development">
                                            Mobile Development
                                        </SelectItem>
                                        <SelectItem value="Game Development">
                                            Game Development
                                        </SelectItem>
                                        <SelectItem value="Programming Languages">
                                            Programming Languages
                                        </SelectItem>
                                        <SelectItem value="Database & Design and Development">
                                            Database & Design and Development
                                        </SelectItem>
                                        <SelectItem value="Software Testing">
                                            Software Testing
                                        </SelectItem>
                                        <SelectItem value="Network & Security">
                                            Network & Security
                                        </SelectItem>
                                        <SelectItem value="AI & ML">AI & ML</SelectItem>
                                        <SelectItem value="Cloud Computing">
                                            Cloud Computing
                                        </SelectItem>
                                        <SelectItem value="DevOps & CI/CD">
                                            DevOps & CI/CD
                                        </SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="Blockchain">Blockchain</SelectItem>
                                        <SelectItem value="Others">Others</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2 mb-4">
                            <Label>Course Level</Label>
                            <Select onValueChange={selectCourseLevel} value={input.courseLevel}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a Course Level" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-black text-black dark:text-white">
                                    <SelectGroup>
                                        <SelectLabel>Course Level</SelectLabel>
                                        <hr />
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2 mb-4">
                            <Label>Price in (INR)</Label>
                            <Input
                                type="number"
                                name="coursePrice"
                                value={input.coursePrice}
                                onChange={changeEventhandler}
                                placeholder="Enter course price"
                                className="w-fit"
                            />
                        </div>
                </div>
                <div>
                    <Label>Course Thumbnail</Label>
                    <Input type="file"
                        accept="image/*"
                        onChange={selectThumbnail}
                        // value={input.courseThumbnail}
                        className="w-fit"
                    />
                    {previewThumbnail && (
                        <img src={previewThumbnail}
                            alt="Thumbnail Preview"
                            className="e-64 w-64 h-64 mt-2 rounded-md"/>
                    )}
                    </div>
                        <div className="flex items-center gap-2 mt-2">
                            <Button variant="outline" onClick={handleBack}>
                                Cancel
                            </Button>
                            <Button
                                disabled={isLoading}
                                className="bg-blue-500 text-white"
                                onClick={updateCourseHandler}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait...
                                    </>
                                ) : (
                                    "Save"
                                )}
                            </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CourseTab;
