import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const searchHandler = (e) => {
    e.preventDefault();
    if(searchQuery.trim() !== ""){
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("")
  }
  return (
      <div className='relative bg-gradient-to-r from-[#6a11cb] to-[#2575fc] dark:from-[#3a0ca3] dark:to-[#4361ee] py-20 px-4 text-center'>
        <div className='max-w-3xl mx-auto'>
            <h1 className='text-white text-4xl font-bold mb-4'>Find the best courses for your future</h1>
            <p className='text-gray-200 dark:text-gray-400 mb-8'>Discover, Learn, and upskill with our wide range of courses</p>
            <form action="" onSubmit={searchHandler} 
              value = {searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
              className='flex justify-center'>
                <input type="text" placeholder='Search for a course' className='w-full p-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black/20 dark:border-white/20 dark:focus:ring-blue-400'/>
                <Button type="submit" className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-r-full duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 h-full overflow-hidden '>
                Search
            </Button>
           </form>
           <Button
            onClick={()=> navigate(`/course/search?query`)}
            className='mt-4 bg-white text-black hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 rounded-full'>
                Explore courses
            </Button>
        </div>
    </div>
  )
}

export default HeroSection
