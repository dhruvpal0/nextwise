import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { useCreateCheckoutSessionMutation } from '@/features/api/purchaseApi'
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';


const BuyCourseButton = ({ courseId }) => {
  const  [createCheckoutSession,{data, isLoading, isSuccess, isError, error}] = useCreateCheckoutSessionMutation();
  
  const purchaseCourseHandler = async () => {
    await createCheckoutSession(courseId);
  };
  
  useEffect (()=>{
    if(isSuccess){
      // toast.success(data?.url)
      if(data?.url){
        window.location.href = data.url; // redirect to stripe checkout
      } else{
        toast.error("Invalid response from server.")
      }
    }
    if(isError){
      toast.error(error?.data?.message || "Failed to create checkout")
    }

  },[data, isSuccess, isError,error])
  return (
    <div>
      <Button 
        disabled={isLoading} 
        onClick={purchaseCourseHandler} 
        className="w-full">
        {
          isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
            </>
            ) : "Purchase Course"
        }
      </Button>
      </div>
  )
};

export default BuyCourseButton;
