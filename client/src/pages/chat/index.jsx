import { useAppStore } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmpyChatContainer from "./components/empy-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {


    const { 
        userInfo, 
        selectedChatType,
        isUploading,
        isDownloading,
        fileUploadProgess,
        fileDownloadProgress, } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo.profileSetup) {
            toast('Por favor configura tu perfil para continuar');
            navigate("/profile");
        }
    }, [userInfo, navigate]);

    return (
        <div className="flex h-[100vh] text-white overflow-hidden" >
            {
                isUploading && <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black flex items-center justify-center flex-col gap-5 backdrop-blur-lg" >
                    <h5 className="text-5xl animate-pulse" >Subiendo Archivo</h5>
                    {fileUploadProgess}%
                </div>
            }
            {
                isDownloading && <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black flex items-center justify-center flex-col gap-5 backdrop-blur-lg" >
                    <h5 className="text-5xl animate-pulse" >Descargando Archivo</h5>
                    {fileDownloadProgress}%
                </div>
            }
            <ContactsContainer />
            {
                selectedChatType === undefined ? (<EmpyChatContainer />) : (<ChatContainer />
                )}
        </div>
    )
}

export default Chat