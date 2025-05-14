import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useCreateCourseMutation } from '@/features/api/courseApi'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse,{data, isLoading, error, isSuccess}] = useCreateCourseMutation();

  const navigate = useNavigate();

  const getSelectedCategory = (value) => {
    setCategory(value);
    // alert(`Selected Category: ${value}`);
  }
  
  const createCourseHandler = async() => {
    await createCourse({ courseTitle, category}).unwrap();
    console.log('Title',courseTitle,'Catagory',category);
    
  }
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course Created Successfully!");
      navigate("/admin/course")
    }
  }, [isSuccess,error]);


    const handleBack = () => {
      navigate(-1); // This goes back to the previous page in the browser history
    };

  return (
    <div className=''>
      <div className='flex-10 mx-10'>
        <div className='mb-4'>
          <h1 className="font-bold text-xl">
            Lets add course, add some basic details
          </h1>
          <p className='text-sm'>
            hello world! this is a simple form to add course, you can add course name, description, image and other details.
          </p>
          <div className='mt-4 mb-4'>
            <div className='space-y-4'></div>
            <Label className='font-bold text-lg'>Title</Label>
            <Input 
            type="text"
            value={courseTitle}
            placeholder='Course Name' 
            onChange={ (e) => setCourseTitle(e.target.value) }
            className='border-2 border-gray-300 rounded-lg p-2 w-full'
            />
          </div>
          <div>  
            <Label>Category</Label>
            <Select onValueChange={getSelectedCategory}  >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-black">
                <SelectGroup >
                  <SelectLabel>Category</SelectLabel>
                  <hr />
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                  <SelectItem value="Game Development">Game Development</SelectItem>
                  <SelectItem value="Programming Languages">Programming Languages</SelectItem>
                  <SelectItem value="Database & Design and Development">Database & Design and Development</SelectItem>
                  <SelectItem value="Software Testing">Software Testing</SelectItem>
                  <SelectItem value="Network & Security">Network & Security</SelectItem>
                  <SelectItem value="AI & ML">AI & ML</SelectItem>
                  <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                  <SelectItem value="DevOps & CI/CD">DevOps & CI/CD</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Blockchain">Blockchain</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>  
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className='flex items-center  gap-2 mt-2'>
              <Button variant='outline' onClick={handleBack}>Back</Button>
              <Button disabled={isLoading} className='bg-blue-500 text-white' onClick={createCourseHandler}>
                {
                isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please wait...
                  </>
                ): "Create"}
                
              </Button>

            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default AddCourse;


  // const [coursePrice, setCoursePrice] = useState("");
 // const [courseDescription, setCourseDescription] = useState("");
  // const [courseImage, setCourseImage] = useState("");
  // const [courseVideo, setCourseVideo] = useState("");
  // const [courseDuration, setCourseDuration] = useState("");
  // const [courseLevel, setCourseLevel] = useState("");
  // const [courseLanguage, setCourseLanguage] = useState("");
  // const [courseInstructor, setCourseInstructor] = useState("");
  // const [courseContent, setCourseContent] = useState("");
  // const [courseRequirements, setCourseRequirements] = useState("");
  // const [courseCertificate, setCourseCertificate] = useState("");
  // const [coursePreview, setCoursePreview] = useState("");
  // const [courseRating, setCourseRating] = useState("");

  // const [courseReviews, setCourseReviews] = useState("");

  // const [courseStudents, setCourseStudents] = useState("");
  // const [courseEnrollments, setCourseEnrollments] = useState("");
  // const [courseCompletionRate, setCourseCompletionRate] = useState("");
  // const [courseFeedback, setCourseFeedback] = useState("");     

  // const [courseQandA, setCourseQandA] = useState("");
  // const [courseDiscussion, setCourseDiscussion] = useState("");

  // const [courseAssignments, setCourseAssignments] = useState("");
  // const [courseQuizzes, setCourseQuizzes] = useState("");
