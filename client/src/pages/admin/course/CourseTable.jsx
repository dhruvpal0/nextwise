import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGetCreatorCourseQuery } from '@/features/api/courseApi'
import { Badge, Edit, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


const CourseTable = () => {
  const { data, isLoading } = useGetCreatorCourseQuery();

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader2 className='animate-spin' size={50} />
      </div>
    )
  }
  console.log("data->", data);



  return (
    <div>
      <Button onClick={() => navigate('create')}>Create a new Course</Button>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tittle</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="font-medium">{course?.coursePrice || "0"}</TableCell>
              {/* <TableCell><Badge className="">{course.isPublished ? "Published" : "Draft"}</Badge></TableCell> */}
              <TableCell>
                <div className={`px-3 py-1 rounded-md text-sm font-medium w-fit ${course.isPublished ? 'bg-green-500 text-white' : 'bg-gray-900 text-white'}`}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </div>
              </TableCell>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell className="text-right"><Button variant="ghost" onClick={()=>navigate(`${course._id}`)}><Edit /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export default CourseTable
