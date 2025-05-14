import React from 'react'
import Course from './Course'
import { useLoadUserQuery } from '@/features/api/authApi';


function MyLearning() {
    // const isLoading = false;
    const {data, isLoading} = useLoadUserQuery();
    // const myLearningCourses = [1, 2, 3, 4, 5, 6, 7, 8];
    const myLearning = data?.user.enrolledCourses || [];

    return (
        <div className='max-w-4xl mx-auto my-24 px-4 md:px-0'>
            <h1 className='text-3xl font-bold text-center mb-10'>My Learning</h1>
            <div className='my-5'>
                {
                    isLoading ? (
                        <MyLearningSkeleton />
                    ) : (
                        myLearning.length === 0 ? (
                            <p>You are not enrolled in any course.</p>
                        ):(
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                                {
                                    myLearning.map((course, index) => (
                                        <Course key={index} course={course} />
                                    ))
                                }
                            </div>
                        )
                    )
                }
            </div>
        </div>
    )
}

const MyLearningSkeleton = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse space-y-4 p-4 border rounded-lg shadow-md w-full max-w-sm">

                    <div className="h-40 bg-gray-300 rounded-lg" /> {/* image placeholder */}

                    <div className="h-4 bg-gray-300 rounded w-3/4" /> {/* title */}
                    <div className="h-3 bg-gray-300 rounded w-1/2" /> {/* subtitle */}

                    <div className="flex space-x-2 mt-4">
                        <div className="h-6 w-20 bg-gray-300 rounded-full" /> {/* badge 1 */}
                        <div className="h-6 w-16 bg-gray-300 rounded-full" /> {/* badge 2 */}
                    </div>
                </div>
            ))}
        </div>
    );
};


export default MyLearning;

