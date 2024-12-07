import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef } from "react";
import { MdFolderZip } from "react-icons/md"
import { IoMdArrowRoundDown } from "react-icons/io"
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

    const checkIfImage = (filePath) => {
        if (!filePath) return false;
        const imageRegex =
            /\.(jpg|jepg|png|gif|bmp|tiff|webp|svg|ico|heic|heif)$/i;
        return imageRegex.test(filePath);
    }

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

    const dowloadFile = async (url) => {
        const response = await apiClient.get(`${HOST}${url}`, {
            responseType: "blob",
        });
        const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
        const link= document.createElement("a");
        link.href=urlBlob;
        link.setAttribute("download",url.split("/").pop());
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(urlBlob);
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
            {
                message.messageType === "file" && (
                    <div
                        className={`${message.sender !== selectedChatData._id
                            ? "bg-[#1726ff] text-white border-[#8417ff]/50 "
                            : "bg-[#329115] text-white border-[#2feb38]/50 "
                            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
                    >
                        {checkIfImage(message.fileUrl) ? (
                            <div className="cursor-pointer">
                                <img
                                    src={`${HOST}${message.fileUrl}`}
                                    height={300} width={300}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3" >
                                    <MdFolderZip />
                                </span>
                                <span>{message.fileUrl.split("/").pop()}</span>
                                <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={() => dowloadFile(message.fileUrl)} >
                                    <IoMdArrowRoundDown />
                                </span>
                            </div>
                        )}
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