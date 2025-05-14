import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'
import Course from './Course';
import { useGetPublishedCoursesQuery } from '@/features/api/courseApi';

const Courses = ()=> {
    const {data, isLoading, isSuccess, isError } = useGetPublishedCoursesQuery();
    console.log(data); 
    if (isError) return <div ><h1> Some error occured while fetching courses.</h1></div>;

    return (
    <div className=''>
        <div className='max-w-7xl mx-auto p-6'>
            <h2 className=' text-3xl font-bold text-center mb-10'>Our Courses</h2>  
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>

        {isLoading ?  Array.from({length: 8}).map((_, index) => (
            <CourseSkeleton key={index} />
        )) : (
            data?.courses && data?.courses.map((course,index) => (
                <Course key={index} course={course} />
              ))
           )}
    </div>
    </div>
    </div>
  )
}   

export default Courses; 

const CourseSkeleton = () => {
    return (
        <div className='overflow-hidden rounded-lg bg-white dark:bg-black dark:border-gray-800 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300'>
            <div className='relative'>
                <Skeleton className='w-full h-36 rounded-t-lg' />
            </div>
            <div className='px-5 py-4 space-y-2'>
                <Skeleton className='h-5 w-3/4 rounded' /> {/* Course title */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        {/* Optional avatar */}
                        {/* <Skeleton className='w-8 h-8 rounded-full' /> */}
                        <Skeleton className='h-4 w-20 rounded' />
                    </div>
                    <Skeleton className='h-6 w-16 rounded-full' />
                </div>
                <Skeleton className='h-4 w-16 rounded' /> {/* Price */}
            </div>
        </div>
    );
};

// const CourseSkeleton = () => {
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {[...Array(8)].map((_, index) => (
//                 <div
//                     key={index}
//                     className="bg-white dark:bg-black dark:border-gray-800 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-lg overflow-hidden"
//                 >
//                     <div className="w-full h-36 bg-gray-300 dark:bg-gray-700" />
//                     <div className="px-5 py-4 space-y-2">
//                         <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
//                         <div className="flex items-center justify-between mt-2">
//                             <div className="flex items-center gap-3">
//                                 {/* Avatar Placeholder */}
//                                 {/* <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full" /> */}
//                                 <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
//                             </div>
//                             <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full" />
//                         </div>
//                         <div className="h-5 w-1/4 bg-gray-300 dark:bg-gray-700 rounded" />
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// const CourseSkeleton = () => {
//     return (
//         <div className='bg-white dark:bg-black dark:border-gray-800 dark:shadow-gray-900 shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden'>
//             <Skeleton className='w-full h-36' />
//             <div className='px-5 py-4 space-y-3'>
//                 <Skeleton className='w-3/4 h-6' />
//                 <div className='flex justify-between items-center'>
//                     <div className='flex items-center gap-3'>
//                         <Skeleton className='w-6 h-6 rounded-full' />
//                         <Skeleton className='w-20 h-4' />
//                     </div>
//                     <Skeleton className='w-16 h-4' />
//                 </div>
//                 <Skeleton className='h-4 w-1/4' />
//             </div>
//         </div>
//     )
// }
