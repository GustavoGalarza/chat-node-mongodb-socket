import { useAppStore } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { toast } from "sonner";

const Chat = () => {

    const {userInfo}= useAppStore();
    const navigate =useNavigate();

    useEffect(()=>{
        if (!userInfo.profileSetup){
            toast('Por favor configura tu perfil para continuar');
            navigate("/profile");
        }
    },[userInfo,navigate]);

    return (
        <div>
            Chat fees
        </div>
    )
}

export default Chat