import { useAppStore } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmpyChatContainer from "./components/empy-chat-container";
import ChatContainer from "./components/chat-container";

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
        <div className="flex h-[100vh] text-white overflow-hidden" >
          <ContactsContainer />
         {/* <EmpyChatContainer />  */}
         <ChatContainer /> 
        </div>
    )
}

export default Chat