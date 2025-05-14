import { AlertCircle } from 'lucide-react'
import React, { useState } from 'react'
import SearchResult from './SearchResult';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Filter from './Filter';
import { useGetSearchCoursesQuery } from '@/features/api/courseApi';

const SearchPage = () => {
    const [searchParam] = useSearchParams();
    const query = searchParam.get("query");
    const [SelectedCategories, setSelectedCategories] = useState([]);
    const [sortByPrice, setSortByPrice] = useState("");

    const { data, isLoading } = useGetSearchCoursesQuery({
        searchQuery: query,
        categories: SelectedCategories,
        sortByPrice
    });
    const isEmpty = !isLoading && data?.courses.length === 0;

    const handleFilterChange = (categories, price) => {
        setSelectedCategories(categories);
        setSortByPrice(price);
    }

    return (
        <div className='max-w-7xl mx-auto p-4 md:p-8 mt-5'>
            <div className='my-6'>
                <h1 className='font-bold text-xl md:text-2xl'>Result for {`"${query}"`}</h1>
                <p>
                    Showing result for 
                    <span className="text-blue-800 font-bold italic"> {`"${query}"`} </span>
                </p>
            </div>
            <div className='flex flex-col md:flex-row gap-10'>
                <Filter handleFilterChange={handleFilterChange} />
                <div className='flex-1 '>
                    {
                        isLoading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <CourseSkeleton key={index} />
                            ))
                        ) : isEmpty ? (
                            <CourseNotFound />
                        ) : (
                            data?.courses?.map((course) => <SearchResult key={course._id} course={course} />)
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default SearchPage


const CourseSkeleton = () => {

    return (
        <div className='flex-1 flex flex-col md:flex-row justify-between'>
            <div className='h-32 2-full md w-64'>
                <Skeleton className="h-full w-full object-cover" />
            </div>
            <div className='flex- flex-col gap-2 flex-1 px-4'>
                <Skeleton className=" h-6 w-3/4" />
                <Skeleton className=" h-6 w-1/2" />
                <div className='flex items-center gap-2'>
                    <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-6 w-20 mt-2" />
            </div>
            <div className='flex flex-col items-end justify-between mt-4'>
                <Skeleton className="h-6 w-12" />
            </div>

        </div>
    )
}
// const CourseSkeleton = () => {
//     return (
//         <div className="flex flex-col md:flex-row justify-between gap-4 p-4 border rounded-lg shadow-sm bg-white">
//             {/* Left Image Placeholder */}
//             <div className="h-32 w-full md:w-64">
//                 <Skeleton className="h-full w-full object-cover rounded-md" />
//             </div>

//             {/* Middle Content Skeletons */}
//             <div className="flex flex-col gap-3 flex-1 px-2">
//                 <Skeleton className="h-6 w-3/4" />
//                 <Skeleton className="h-6 w-1/2" />
//                 <div className="flex items-center gap-2">
//                     <Skeleton className="h-4 w-1/3" />
//                     <Skeleton className="h-4 w-1/4" />
//                 </div>
//                 <Skeleton className="h-6 w-20 mt-1" />
//             </div>

//             {/* Right-side Action Skeleton */}
//             <div className="flex flex-col items-end justify-between gap-2 mt-2 md:mt-0">
//                 <Skeleton className="h-6 w-12" />
//                 <Skeleton className="h-6 w-16" />
//             </div>
//         </div>
//     );
// };


const CourseNotFound = () => {

    return (
        <div>
            <AlertCircle className="flex flex-col items-center justify-center min-h " />
            <h1 className='font-bold text-2xl md:text-4xl text-gray-800'>
                Course Not found
            </h1>
            <p className='text-lg text-gray-600 dark:text-gray-400 mb-4'>
                Sorry, we couldn't find the course you;re looking for.
            </p>
            <Link to="/" className="italic" >
                <Button variant="link">
                    Browse All Courses
                </Button>
            </Link>
        </div>
    )

}