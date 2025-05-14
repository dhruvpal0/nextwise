import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const MEDIA_API = "http://localhost:8080/api/v1/media";


const LectureTab = () => {
    const navigate = useNavigate();
    
    const [lectureTitle, setLectureTitle] = useState("");
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [btnDisable, setBtnDisable] = useState(true);
    const params = useParams();
    const {courseId, lectureId} = params;

    const [videoFile, setVideoFile] = useState(null);
    const [videoURL, setVideoURL] = useState(null);

    const {data:lectureData} = useGetLectureByIdQuery(lectureId);
    const lecture = lectureData?.lecture;
    
    useEffect(()=>{
        if(lecture){
            setLectureTitle(lecture.lectureTitle);
            setIsFree(lecture.isPreviewFree);
            setUploadVideoInfo(lecture.videoInfo);
            // Set video URL if already uploaded
            if (lecture.videoInfo?.videoUrl) {
                setVideoURL(lecture.videoInfo.videoUrl);
                }
        }
    },[lecture]);

    const [ editLecture, {data, isLoading,error, isSuccess}] = useEditLectureMutation();
    const [ removeLecture,{data:removeData, isLoading:removeLoading, isSuccess:removeSuccess} ] = useRemoveLectureMutation();

    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            setMediaProgress(true);
            
            if (file && file.type.startsWith("video/")) {
                setVideoFile(file);
              } else {
                alert("Please upload a valid video file.");
              }
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round((loaded * 100) / total));
                    }
                })
                if (res.data.success) {
                    console.log(res);
                    setUploadVideoInfo({ 
                        videoUrl: res.data.data.url, 
                        publicId: res.data.data.public_id,
                    });
                    setBtnDisable(false);
                    toast.success(res.data.message);
                }

            } catch (error) {
                console.log(error);
                toast.error("video upload failed!")
            }
            finally {
                setMediaProgress(false);
            }
        }
    }
    useEffect(() => {
        if (videoFile) {
          const url = URL.createObjectURL(videoFile);
          setVideoURL(url);
          return () => URL.revokeObjectURL(url); // Clean up on unmount
        }
      }, [videoFile]);

    const editLectureHandler = async () => {
    console.log({ lectureTitle, uploadVideoInfo, isFree, courseId, lectureId });
    console.log({ courseId, lectureId });
    
    await editLecture({
            lectureTitle,
            videoInfo:uploadVideoInfo,
            isPreviewFree:isFree,
            courseId, 
            lectureId, 
        });
    }

    const removeLectureHandler = async () => {
        await removeLecture(lectureId);
    }   

    useEffect(()=>{
            if (isSuccess){
                toast.success(data.message);
                navigate(-1);
            }
            if (error){
                toast.success(error.data.message);
            }
        },[isSuccess, error])

    useEffect(()=>{
        if(removeSuccess){
            toast.success(removeData.message);
            navigate(-1);
        }
    }
    ,[removeSuccess])

    return (
        <div>
            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <div>
                        <CardTitle className="font-bold text-xl">
                            Edit Lecture
                        </CardTitle>
                        <CardDescription>
                            Make changes and click save when done.
                        </CardDescription>
                    </div>
                    <div className="flex gap-2 items-center ">
                        <Button disabled={removeLoading} variant="destructive" onClick={removeLectureHandler} >
                            {
                                removeLoading ? <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </> : "Remove Lecture"
                            }</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* <div className="flex flex-col gap-4 "></div> */}
                    <div className="flex flex-col gap-2 mb-4">
                        <Label htmlFor="course-name" className="text-sm font-semibold">
                            Title
                        </Label>
                        <Input
                            type="text"
                            name="courseTitle"
                            value={lectureTitle}
                            onChange={(e) => setLectureTitle(e.target.value)}
                            placeholder="Enter Lecture name"
                            className="border p-2 rounded-md"
                        />
                    </div>
                    <div>
                        <Label>Lecture <span className='text-red-600'> *</span></Label>
                        <Input type="file"
                            accept="video/*"
                            onChange={fileChangeHandler}
                            placeholder="Upload your video file here"
                            className="w-fit"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Upload your video file here. <br />
                            Supported formats: mp4, mkv, avi, mov, wmv
                        </p>
                    </div>
                    <div className="flex items-center gap-3 my-3">
                        <Switch
                            checked={isFree}
                            onCheckedChange={setIsFree}
                            id="free-video"
                            className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-700 transition-colors"
                        />
                        <Label
                            htmlFor="free-video"
                            className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Is this video Free? <span className='text-red-600'>*</span>
                        </Label>
                    </div>
                    {
                        mediaProgress && (
                            <div className='my-4'>
                                <Progress value={uploadProgress} />
                                <p>{uploadProgress}% uploaded</p>
                            </div>
                        )
                    }
                    {
                        videoURL && (
                        <div className="mt-4"> 
                            <Label className="block mb-1">Video Preview</Label> 
                                <video 
                                    src={videoURL} 
                                    controls 
                                    width="320" 
                                    height="240" 
                                    className="rounded-md shadow" 
                                /> 
                        </div>
                        )}
                    
                    <div className="mt-4">
                        <Button disabled={!uploadVideoInfo || isLoading}
                                onClick={editLectureHandler}>
                        {
                            isLoading ? <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Please wait
                            </> : "Update Lecture"
                        }            
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default LectureTab
