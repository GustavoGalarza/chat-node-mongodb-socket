import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef } from "react";


const MessageContainer = () => {
    const scrollRef = useRef();

    const { selectedChatType, selectedChatData, userInfo, selectedChatMessages, setSelectedChatMessage } = useAppStore();

    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await apiClient.post(
                    GET_ALL_MESSAGES_ROUTE,
                    { id: selectedChatData._id },
                    { withCredentials: true }
                 );
                if (response.data.messages) {
                    setSelectedChatMessage(response.data.messages)
                }
            } catch (error) {
                console.log({ error });
            }
        }

        if (selectedChatData._id) {
            if (selectedChatType === "contact") getMessages();
        }
    }, [selectedChatData, selectedChatType, setSelectedChatMessage]);



    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChatMessages])

    const renderMessages = () => {
        let lastDate = null;
        return selectedChatMessages.map((message, index) => {
            const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
            const showDate = messageDate !== lastDate;
            lastDate = messageDate;
            return (
                <div key={index} >
                    {showDate && (
                        <div className="text-center text-white my-2 text-2xl font-bold">
                            {moment(message.timestamp).format("LL")}
                        </div>
                    )}
                    {
                        selectedChatType === "contact" && renderDMMessages(message)
                    }
                </div>
            );
        });
    };

    const renderDMMessages = (message) => (
        <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"
            }`} >
            {
                message.messageType === "text" && (
                    <div
                        className={`${message.sender !== selectedChatData._id
                            ? "bg-[#1726ff] text-white border-[#8417ff]/50 "
                            : "bg-[#329115] text-white border-[#2feb38]/50 "
                            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`} >
                        {message.content}
                    </div>
                )}
            <div className="text-xs text-white/75" >
                {
                    moment(message.timestamp).format("LT")
                }
            </div>
        </div>
    );
    return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
            {renderMessages()}
            <div ref={scrollRef} ></div>
        </div>
    );
};

export default MessageContainer;