import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { purchaseApi, useGetPurchaseCoursesQuery } from '@/features/api/purchaseApi';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer,LineChart, YAxis, Tooltip, Line, XAxis, CartesianGrid, } from 'recharts'

function Dashboard() {
  const navigate = useNavigate();
  const {data, isSuccess, isError, isLoading} = useGetPurchaseCoursesQuery();

  if(isLoading) return <h1> Loading...</h1>
  if(isError) return <h1 className='text-red-500'> Failed to get purchased Course</h1>
    
  const {purchasedCourse} = data || [];
  const courseData = purchasedCourse.map((course)=>({
    name:course.courseId.courseTitle,
    price: course.courseId.coursePrice,
  }))
  const totalRevenue = purchasedCourse.reduce((acc, element) => acc+(element.amount ||0) ,0)
  const totalSales = purchasedCourse.length;
  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-24 '>
      <Button type="submit" onClick={()=>navigate("/admin/course")}>Courses</Button>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-3xl font-bold text-blue-600'>{totalSales}</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-3xl font-bold text-blue-600'>{totalRevenue}</p>
        </CardContent>
      </Card>
      {/* Course Prices Card */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Course Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                angle={-30} // Rotated labels for better visibility
                textAnchor="end"
                interval={0} // Display all labels
              />
              <YAxis stroke="#6b7280" />
              <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4a90e2" // Changed color to a different shade of blue
                strokeWidth={3}
                dot={{ stroke: "#4a90e2", strokeWidth: 2 }} // Same color for the dot
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
