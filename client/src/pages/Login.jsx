// mongodb+srv://peerlynk:Z1rhlEj6heZW7hUb@cluster0.s1s6kze.mongodb.net/

import React, { useEffect, useState } from "react"; // Fixed import
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select";
const Login = () => {
  const [SignupInput, setSignupInput] = useState({
    role: 'student',
    name: '',
    email: '',
    password: '',
  });
  const [LoginInput, setLoginInput] = useState({
    email: '',
    password: '',
  });

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isloading: registerIsLoading,
      isSuccess: registerIsSuccess,
      // refetch
    },
  ] = useRegisterUserMutation(); // Assuming you have a register mutation defined in your authApi 

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isloading: loginIsLoading,
      isSuccess: loginIsSuccess
    }
  ] = useLoginUserMutation(); // Assuming you have a login mutation defined in your authApi
  const navigate = useNavigate();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === 'signup') {
      setSignupInput({ ...SignupInput, [name]: value });
    } else if (type === 'login') {
      setLoginInput({ ...LoginInput, [name]: value });
    } else {
      console.log('Invalid type');
    }
  }
  const handleRegisteration = async (type) => {
    const inputData = type === 'signup' ? SignupInput : LoginInput;
    const action = type === 'signup' ? registerUser : loginUser;
    await action(inputData);
  };

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || 'Registration successful!');
    }
    if (registerError) {
      toast.error(registerError.data.message || 'Registration failed!');
    }
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || 'Login successful!');
      navigate('/');
    }
    if (loginError) {
      toast.error(loginError.data.message || 'Login failed!');
    }

  }, [
    loginIsLoading,
    registerIsLoading,
    loginData,
    registerData,
    loginError,
    registerError,
    registerIsSuccess,
    loginIsSuccess
  ]);

  const handleGoogleLogin = () =>{
    prompt("email id");
  }

  return (

    <div className="flex flex-col gap-6 items-center w-full justify-center mt-20">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader className="items-center justify-center font-bold text-xl">
              <CardTitle>Signup</CardTitle>
              {/* <CardDescription>
              </CardDescription> */}
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={SignupInput.role}
                  onValueChange={(value) => setSignupInput({ ...SignupInput, role: value })}
                >
                  <SelectTrigger className="w-full">
                    <span>{SignupInput.role}</span>
                  </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-black text-black dark:text-white">
                    <SelectGroup>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={SignupInput.name}
                  onChange={(e) => changeInputHandler(e, 'signup')}
                  placeholder="Name"
                  required="true" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={SignupInput.email}
                  onChange={(e) => changeInputHandler(e, 'signup')}
                  placeholder="email@gmail.com"
                  required="true" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password </Label>
                <Input
                  type="password"
                  name="password"
                  value={SignupInput.password}
                  onChange={(e) => changeInputHandler(e, 'signup')}
                  placeholder="Password"
                  required="true" />
              </div>

            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-md hover:opacity-90"
                disaabled={registerIsLoading}
                onClick={() => handleRegisteration('signup')}
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : ('Signup'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader className="items-center justify-center font-bold text-xl">
              <CardTitle>Login</CardTitle>
              {/* <CardDescription>
                Login to your account and click login when you're done.
              </CardDescription> */}
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={LoginInput.email}
                  onChange={(e) => changeInputHandler(e, 'login')}
                  placeholder="email@gmail.com"
                  required="true" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="new"> Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={LoginInput.password}
                  onChange={(e) => changeInputHandler(e, 'login')}
                  placeholder="Password"
                  required="true" />
              </div>

            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-md hover:opacity-90"

                disabled={loginIsLoading}
                onClick={() => handleRegisteration('login')}
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : 'Login'
                }
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      <Button
      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        onClick={handleGoogleLogin}>Continue with Google</Button>

    </div>
  )
}

export default Login;
