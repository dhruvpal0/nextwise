import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Label } from '@radix-ui/react-label'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const [createLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation();

  const { data: lectureData, isLoading: lectureLoading, isError: lectureError, refetch } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  console.log(lectureData);

  const handleBack = () => {
    navigate(-1);
  }

  return (
    <div className=''>
      <div className='flex-10 mx-10'>
        <div className='mb-4'>
          <h1 className="font-bold text-xl">
            Lets add Lecture, add some basic details
          </h1>
          <p className='text-sm'>
            hello world! this is a simple form to add Lecture.
          </p>
          <div className='mt-4 mb-4'>
            <div className='space-y-4'></div>
            <Label className='font-bold text-lg'>Title</Label>
            <Input
              type="text"
              value={lectureTitle}
              placeholder='Lecture Name'
              onChange={(e) => setLectureTitle(e.target.value)}
              className='border-2 border-gray-300 rounded-lg p-2 w-full'
            />
          </div>
          <div>
            <div className='flex items-center  gap-2 mt-2'>
              <Button variant='outline' onClick={handleBack} >Back to Course</Button>
              <Button disabled={isLoading} className='bg-blue-500 text-white' onClick={createLectureHandler}>
                {
                  isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Please wait...
                    </>
                  ) : "Create Lecture"}

              </Button>
            </div>
            <div className='mt-10'>
              { 
                lectureLoading ? (
                  <p>Loading lectures....</p>
                ) : lectureError ? (
                  <p>Failed to load lectures</p>
                ) : lectureData.lectures.length === 0 ? (
                  <p> No lecture available</p>
                ) : (
                  lectureData.lectures.map((lectureItem, index) => (
                    <Lecture key={lectureItem._id} lecture={lectureItem} index={index} />                   
                  ))
                )}
            </div>
            {/* <Lecture /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateLecture
