import React, { useEffect } from 'react'
import { Menu, School } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSub, DropdownMenuSeparator, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import DarkMode from '@/DarkMode';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetFooter } from './ui/sheet';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '@/features/api/authApi';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const Navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      await logoutUser();
      Navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }
  console.log(user);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Logout successful");
    }
  }, [isSuccess])


  return (
    <div className='h-16 dark:bg-[#0A0A0A] dark:text-white bg-white text-black border-b  dark:border-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10'>
      {/* Desktop */}
      <div className='max-w-7xl  mx-auto  hidden md:flex justify-between items-center gap-10 h-full '>
        <div className='flex items-center gap-2'>
          <School size={30} />
          <Link to="/">
          <h1 className='hidden md:block front-extrabold  text-2xl'>
            NextWise
          </h1>
          </Link>
        </div>
        <div className='flex items-center gap-8'>
          {
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src={user?.photoUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white dark:bg-black text-black dark:text-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/">Home</Link>
                    </DropdownMenuItem>
                    {
                    user?.role === "student" &&(
                      <>
                    <Link to="my-learning"><DropdownMenuItem>My Learning</DropdownMenuItem></Link>
                    </>
                    )}<Link to="profile">
                     <DropdownMenuItem>Profile</DropdownMenuItem></Link>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutHandler}>Log out</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {/* <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>Email</DropdownMenuItem>
                          <DropdownMenuItem>Message</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>More...</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub> */}
                  </DropdownMenuGroup>
                  {
                    user?.role === "instructor" &&(
                      <>
                        <Link to="admin/dashboard"><DropdownMenuItem>Dashboard</DropdownMenuItem></Link>
                      </>
                    )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) :
              (
                <div className='flex items-center gap-2'>
                  <Button variant="outline" onClick={()=> navigate("/login")}>Login</Button>
                  <Button
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                  onClick={()=> navigate("/login")}>Signup</Button>
                </div>
              )}
          <DarkMode />
        </div>
      </div>
      {/* Mobile device */}
      <div className='flex md:hidden items-center justify-between px-4 h-full'>
        <School size={30} />
        <h1 className='text-2xl font-extrabold'>
          NextWise</h1>
        <MobileNavbar user={user}/>
      </div>
    </div>
  );
};

export default Navbar;

  const MobileNavbar = ({user}) => {
    const navigate = useNavigate();

  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const Navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      await logoutUser();
      Navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }
  console.log(user);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Logout successful");
    }
  }, [isSuccess])

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" className='rounded-full  hover:bg-gray-300  dark:hover:bg-gray-700 ' variant="outline">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent className='flex flex-col' >
          <SheetHeader className='flex flex-row justify-between items-center mt-2'>
            <SheetTitle> <Link to="/">Nextwise </Link> </SheetTitle>
            <DarkMode />
          </SheetHeader>
          <Separator className='mr-2' />
          <nav className='flex flex-col space-y-4'>
            <Link to="/my-learning"><span>My Learning</span> </Link>
            <Link to="profile"><span>Edit Profile</span></Link>
            { user ? 
              <Link><p onClick={logoutHandler}>Log out</p> </Link>
              :
              <Link><p onClick={()=> navigate("/login")}>Log In</p> </Link>
            }
          </nav>
          {
            user?.role === 'instructor' && (
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" onClick={()=>navigate("/admin/dashboard")}>Dashboard</Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button type="submit" onClick={()=>navigate("/admin/course")}>Courses</Button>
                </SheetClose>
              </SheetFooter>
            )
          }

        </SheetContent>
      </Sheet>
    </div>
  )
}

export { MobileNavbar };
