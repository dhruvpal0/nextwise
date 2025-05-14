import BuyCourseButton from '@/components/BuyCourseButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetCourseDetailWithStatusQuery } from '@/features/api/purchaseApi';
import { BadgeInfo, Lock, PlayCircle } from 'lucide-react';
import ReactPlayer from 'react-player';
import { useNavigate, useParams } from 'react-router-dom';

const CourseDetails = () => {

    const params = useParams();
    const courseId = params.courseId;
    const navigate = useNavigate();

    const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId);
    if (isLoading) {
        return <div className='flex items-center justify-center h-screen'>Loading...</div>
    }
    if (isError) {
        return <div className='flex items-center justify-center h-screen'>Failed to load course details</div>
    }
    console.log(isError);
    (isError)
    const { course, purchased } = data;
    console.log(course, purchased);

    const handleContinueCourse = () => {
        if (purchased) {
            navigate(`/course-progress/${courseId}`);
        }
    }

    return (
        <div >  
            {/* className= 'mt-20 space-y-5'  */}
            <div className='bg-[#2D2F31] text-white'>
                <div className='max-w-4xl mx-auto py-4 md:py-8 flex flex-col gap-2'>
                    <h1 className='font-bold text-2xl md:text-3xl'>{course?.courseTitle}</h1>
                    <h1 className='font-semibold md:text-lg'>{course?.subTitle}</h1>
                    <h1 className=''>Created by <span className='italic underline '>{course?.creator.name}</span></h1>
                    <h1> </h1>
                    <div className='flex items-center gap-2 text-sm'>
                        <BadgeInfo size={16} />
                        <p>created At {course?.createdAt.split("T")[0]}</p>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                        <BadgeInfo size={16} />
                        <p>Last updated {course?.updatedAt.split("T")[0]}</p>
                    </div>
                    <p>Student enrolled: {course?.enrolledStudents.length}</p>
                </div>
            </div>
            <div className='max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10 '>
                <div className='w-full lg:w-1/2 space-y-5'>
                    <h1 className="font-bold text-xl md:text-2xl">Description</h1>
                    <p
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: course?.description }}
                    />
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                            <CardDescription>{course?.lectures.length} lectures</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-3'>
                            {course.lectures.map((lecture, index) => (
                                <div key={index} className='flex items-center gap-3' >
                                    <span>
                                        {
                                            true ? (<PlayCircle size={20} />) : (
                                                <Lock size={20} />
                                            )
                                        }
                                    </span>
                                    <p className='text-base font-medium'>{lecture?.lectureTitle}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                                    <div>
                     <ReactPlayer width={'100%'} height={'100%'} url={course.lectures[0].videoUrl}
                                    controls={true} config={{
                                        file: {
                                            attributes: {
                                                controlsList: 'nodownload nofullscreen noremoteplayback', // disables download, fullscreen, and remote playback options
                                                disablePictureInPicture: true, // disables PiP                              },
                                            },
                                        }
                                    }}
                                />
                </div>
                </div>
                <div className='w-full lg:w-1/3'>
                    <Card>
                        <CardContent className='p-4 flex flex-col gap-5'>
                            <div className=' w-full aspect-video mb-4'>
                                    <img src={course.courseThumbnail}
                                    alt="course image"
                                />
                                {/* <ReactPlayer width={'100%'} height={'100%'} url={course.lectures[0].videoUrl}
                                    controls={true} config={{
                                        file: {
                                            attributes: {
                                                controlsList: 'nodownload nofullscreen noremoteplayback', // disables download, fullscreen, and remote playback options
                                                disablePictureInPicture: true, // disables PiP                              },
                                            },
                                        }
                                    }}
                                /> */}
                            </div>
                            <h1 className='font-bold items-center text-justify text-lg'>{course.courseTitle}</h1>
                            <Separator className="my-2" />
                            {/* <h1 className='text-lg md:text-xl font-semibold '>{course?.coursePrice}</h1> */}
                        </CardContent>
                        <CardFooter className='flex items-center justify-between p-4'>
                            {/* {
                        purchased ? (
                            <Button onClick={handleContinueCourse} className="w-full">Continue Course</Button>
                        ) : (
                            <BuyCourseButton courseId = {courseId}/>
                        )
                    } */}
                            {purchased ? (
                                <>
                                    <h1 className='font-bold'>Already Purchased</h1>
                                    <Button onClick={handleContinueCourse} className="w-full">Continue Course</Button>
                                </>
                            ) : (
                                <>
                                    <h1 className='text-lg md:text-xl font-semibold '>{course?.coursePrice}</h1>
                                    <BuyCourseButton courseId={courseId} />
                                </>
                            )}

                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>

    )
}

export default CourseDetails
