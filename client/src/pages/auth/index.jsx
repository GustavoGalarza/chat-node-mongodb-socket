import Background from '@/assets/login3.jpg'
import Background2 from '@/assets/regiter.jpg'

import Victory from "@/assets/victory.svg";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { toast } from 'sonner';
import apiclient from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';

const Auth = () => {
    const navigate = useNavigate()
    const { setUserInfo } = useAppStore()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email es requerido");
            return false;
        }
        if (!password.length) {
            toast.error("Password es requerido");
            return false;
        }
        return true;
    }

    const validateSignup = () => {

        if (!email.length) {
            toast.error("Email es requerido");
            return false;
        }
        if (!password.length) {
            toast.error("Password es requerido");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Password y confirmacion son Diferentes")
            return false;
        }
        return true;
    }

    const handleLogin = async () => {
        if (validateLogin()) {
            const response = await apiclient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
            console.log({ response });
            if (response.data.user.id) {
                setUserInfo(response.data.user)
                if (response.data.user.profileSetup) navigate('/chat')
                else navigate("/profile");
            }
        }
    }

    const handleSignup = async () => {
        if (validateSignup()) {
            const response = await apiclient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
            if (response.status === 201) {
                setUserInfo(response.data.user)
                navigate("/porfile");
            }
            console.log({ response });

        }
    }

    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center" style={{ backgroundImage: `url(${Background2})`, backgroundSize: 'cover', backgroundPosition: 'center' }} >
            <div className="h-[80vh] bg-[#8592f3f5] border-2 border-[#5e5cffd3] text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vh] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
                <div className="flex flex-col gap-10 items-center justify-center">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                            <img src={Victory} alt="Victory Emoji" className="h-[100px]" />
                        </div>
                        <p className='font-medium text-center'>Completa los datos para comenzar a usar la mejor aplicación de chat</p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs className="w-3/4" defaultValue="login">
                            <TabsList className="bg-transparent rounded-none w-full ">
                                <TabsTrigger value="login" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-blue-900 p-3 transition-all duration-300 " >Login</TabsTrigger>
                                <TabsTrigger value="signup" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-blue-900 p-3 transition-all duration-300 ">Signup</TabsTrigger>
                            </TabsList>
                            <TabsContent className="flex flex-col gap-5 " value="login" >
                                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <Input placeholder="Password" type="Password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <Button className="rounded-full p-6" onClick={handleLogin} >Login</Button>
                            </TabsContent>
                            <TabsContent className="flex flex-col gap-5 " value="signup" >
                                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <Input placeholder="Password" type="Password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <Input placeholder="confirm Password" type="Password" className="rounded-full p-6" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                <Button className="rounded-full p-6" onClick={handleSignup} >Signup</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="hidden xl:flex justify-center items-center">
                    <img src={Background} alt="Backgorund login" className="h-[400px] shadow-2xl rounded-3xl" />
                </div>
            </div>
        </div>
    )
}

export default Auth