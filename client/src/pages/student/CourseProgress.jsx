import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useCompleteCourseMutation, useGetCourseProgressQuery, useInCompleteCourseMutation, useUpdateLectureProgressMutation } from '@/features/api/courseProgressApi';
import { CheckCircle, CirclePlay } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseProgress = () => {

  const params = useParams();
  const courseId = params.courseId;

  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();

  const [completeCourse, { data: markCompleteData, isSuccess: completedSuccess }] = useCompleteCourseMutation();
  const [inCompleteCourse, { data: markInCompleteData, isSuccess: inCompletedSuccess }] = useInCompleteCourseMutation();

  
  useEffect(() => {
    console.log(markCompleteData);

    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData.message);
    }
    if (inCompletedSuccess) {
      refetch();
      toast.success(markInCompleteData.message);
    }
  }, [completedSuccess, inCompletedSuccess]);

  const [currentLecture, setCurrentLecture] = useState(null);

  if (isLoading) return <p>Loading....</p>
  if (isError) return <p>failed to load course details </p>
  console.log(data);

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle } = courseDetails;

  // initialize the first lecture is not exist
  const initialLecutre = currentLecture || courseDetails.lectures && courseDetails.lectures[0];


  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  } // Replace with actual completion status

  // handle select a specific lecture to watch 
  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture?._id)
  }

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  }

  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
  }

  const handleInCompleteCourse = async () => {
    await inCompleteCourse(courseId);
  }

  return (
    <div className=' max-w-7xl mx-auto p-4 my-24 '>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-bold'>{courseTitle}</h1>
        <Button
          variant={completed ? "outline" : "default"}
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
        >
          {
            completed ?
              <div className='flex items-center'>
                <CheckCircle /> <span> &nbsp;Completed</span>
              </div> :
              "Mark as complete"
          }
        </Button>
      </div>

      <div className='flex flex-col md:flex-row gap-6'>
        {/* video section */}
        <div className='flex-1 md:w-3/5 h-fit rounded-lg shadow-md p-4'>

          <div>
            <video
              src={currentLecture?.videoUrl || initialLecutre.videoUrl}
              controls
              className="w-full max-w-3xl h-auto mx-auto md:rounded-lg"
              onEnded={() => { handleLectureProgress(currentLecture?._id || initialLecutre._id) }}
              // onTimeUpdate={(e) => {
              //   const video = e.target;
              //   const remaining = video.duration - video.currentTime;
              //   const currentId = currentLecture?._id || initialLecutre._id;
              //   if (remaining <= 5 && !video.dataset.marked) {
              //     video.dataset.marked = "true"; // Prevent multiple calls
              //     handleLectureProgress(currentId);
              //   }
              // }}
            />
          </div>
          {/* Display current watching lecture lecture title */}
          <div className='mt-2'>
            <h3 className='text-lg font-semibold mb-2'>
              {
                `Lecture ${courseDetails.lectures.findIndex((lec) => lec._id === (currentLecture?._id || initialLecutre._id)) + 1}:${currentLecture?.lectureTitle || initialLecutre.lectureTitle}`
              }
            </h3>
          </div>
        </div>
        {/* Lecture sidebar */}
        <div className='flex flex-col w-full md:w-2/5 h-fit border-t-0 md:border-l md:pl-4 rounded-lg shadow-md p-4'>
          <h2 className='font-semibold text-xl mb-4'>Course Lectures</h2>
          <div className='flex-1 overflow-y-auto'>
            {/* <div className='flex flex-col gap-4'> */}
            {/* Map through the lectures */}
            {courseDetails?.lectures.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${lecture?._id === currentLecture?._id ? "bg-gray-300 text-black dark:bg-gray-800" : ""}`}
                onClick={() => handleSelectLecture(lecture)}>
                <CardContent className='flex items-center justify-between  p-4'>
                  <div className='flex items-center '>
                    {
                      isLectureCompleted(lecture._id) ? (
                        <CheckCircle className='text-green-500 mr-2' size={24} />
                      ) : (
                        <CirclePlay className='text-gray-500 mr-2' size={24} />
                      )}
                    <div>
                      <CardTitle className="text-lg font-medium">{lecture?.lectureTitle}</CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <span className="inline-block bg-green-200 text-green-400 text-sm font-medium px-3 py-1 rounded-md">
                      Completed
                    </span>
                  )
                  }
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseProgress
