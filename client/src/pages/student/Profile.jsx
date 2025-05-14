import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Course from './Course';
import MyLearningSkeleton from './MyLearning';
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/authApi';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { data } from 'react-router-dom';
import { toast } from 'sonner';



const Profile = () => {
  
  const { data, isLoading, } = useLoadUserQuery(); 

  if (isLoading) return <MyLearningSkeleton />

  if (!data) return <div>Loading...</div>; // or handle the error properly

  const user = data && data.user; 
  
    return (
    <div>
        <div className='max-w-4xl mx-auto my-24 px-4 '> 
            <h1 className='text-2xl font-bold text-center md:text-left'>Profile</h1>
            <div className='flex flex-col md:flex-row items-center  md:items-start gap-8 my-5'>
              <div className='flex flex-col items-center '>
                <Avatar className='w-24 h-24 md:w-32 md:h-32'>
                  <AvatarImage src={user?.photoUrl} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className='mb-2'>
                  <h1 className='text-2xl font-semibold  '>
                    Name: <span className='font-normal text-lg'>{user.name}</span></h1>
                </div>
                <div className='mb-2'>
                  <h1 className='text-2xl font-semibold '>
                    Email: <span className='font-normal text-lg'>{user.email}</span></h1>
                </div>
                <div className='mb-2'>
                  <h1 className='text-2xl font-semibold '>
                    Role: <span className='font-normal text-lg'>{user.role.toUpperCase()}</span></h1>
                </div>
                <div>
                  
                </div>
                {/* <Button><Link to='/edit-profile'>Edit Profile </Link></Button> */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size='sm'  className='bg-blue-500 text-white mt-2'>Edit Profile</Button>
                  </DialogTrigger>
                    <EditProfile user={user}/> 
              </Dialog>
              </div>
            </div>
            <div className='max-w-4xl mx-auto my-24 px-4 md:px-0'>
            <h1 className='text-3xl font-bold text-center mb-10'>Courses you're enrolled in</h1>
            <div className='my-5'>      
                  {
                    isLoading ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
                <div className="animate-pulse space-y-4 p-4 border rounded-lg shadow-md w-full max-w-sm">

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
                    ) : (
                    user.enrolledCourses.length === 0 ? (
                        <p>You are not enrolled in any course.</p>
                    ):(
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                            {
                                user.enrolledCourses.map((course) => (
                                    <Course course={course} key={course._id} />
                                ))
                            }
                        </div>
                    )
                )  }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile;


const EditProfile = ({user}) => {
  // const [name, setName] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [updateUser,
     {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    }
  ] = useUpdateUserMutation();


  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file) ;
  }
  const updateUserHandler = async () => {
    try {
        console.log(name, profilePhoto);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("profilePhoto", profilePhoto);
        // Use await to ensure that the updateUser mutation is completed before proceeding
        const response = await updateUser(formData).unwrap(); // unwrap() is useful to get the resolved value of the mutation
        console.log("updateUserData", response); // The response will now contain the updated data
    } catch (error) {
        console.error("Error updating user:", error);
    }
}
  useEffect(()=>{
    fetch();
  },[]);

  useEffect(() => {
    if (isSuccess) {
      fetch();
      toast.success(data.message || "Profile updated!");
    }
    if (isError) {
      toast.error(Error.message || "Something went wrong");
    }
  }, [error, updateUserData, isError, isSuccess]);

    // if (updateUserData) {
    //   toast.success("Profile updated successfully");
    // }
    // if (error) {
    //   toast.error(error.data.message);
    // }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input 
          type="text" 
          value={name}
          placeholder="Name"
          className="col-span-3"
          onChange={(e)=>setName(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="file" className="text-right">
            Profile Picture
          </Label>
          <Input
            id="file" 
            type="file" 
            accept="image/*" 
            className="col-span-3" 
            onChange={onChangeHandler} />
        </div>
      </div>
      <DialogFooter>
        <Button disabled={updateUserIsLoading} onClick={updateUserHandler}>
          {
            updateUserIsLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Please wait...
              </>
            ) : (
              'Save changes'
            )
          }
        </Button>

      </DialogFooter>
    </DialogContent>
  )
}