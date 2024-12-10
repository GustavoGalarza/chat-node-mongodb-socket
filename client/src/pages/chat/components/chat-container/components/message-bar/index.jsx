import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSocket } from "@/context/socketContext";
import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";

import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr"
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";


const messageBar = () => {

    const emojiRef = useRef();
    const fileInputRef = useRef();
    const socket = useSocket();
    const { selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgess } = useAppStore();
    const [message, setMessage] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            removeEventListener("mousedown", handleClickOutside)
        }
    }, [emojiRef])

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji)
    }

    const handleSendMessage = async () => {
        if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined,
            });
        } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
                sender: userInfo.id,
                content: message,
                messageType: "text",
                fileUrl: undefined,
                channelId: selectedChatData._id,
            });
        }
        setMessage("");
    };

    const handleAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleAttachmentChange = async (event) => {
        try {
            const file = event.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                setIsUploading(true);
                const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
                    withCredentials: true, onUploadProgress: data => {
                        setFileUploadProgess(Math.round((100 * data.loaded) / data.total))
                    }
                });

                if (response.status === 200 && response.data) {
                    setIsUploading(false);
                    if (selectedChatType === "contact") {
                        socket.emit("sendMessage", {
                            sender: userInfo.id,
                            content: undefined,
                            recipient: selectedChatData._id,
                            messageType: "file",
                            fileUrl: response.data.filePath,
                        });
                    } else if (selectedChatType === "channel") {
                        socket.emit("send-channel-message", {
                            sender: userInfo.id,
                            content: undefined,
                            messageType: "file",
                            fileUrl: response.data.filePath,
                            channelId: selectedChatData._id,
                        });
                    }
                }
            }
            console.log({ file });

        } catch (error) {
            setIsUploading(false);
            console.log({ error });

        }
    }


    return (
        <div className="h-[14vh] bg-[#1c2041] flex justify-center items-center px-5 gap-6" >
            <div className="flex-1 flex bg-[#38449b] rounded-md items-center gap-5 pr-5">
                <input type="text" className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none" placeholder="Ingresa un mensaje" value={message} onChange={(e) => setMessage(e.target.value)}
                />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all disabled:text-gray-400"
                                onClick={handleAttachmentClick}
                                disabled={!userInfo?.premium}
                            >
                                <GrAttachment className="text-2xl" />
                            </button>
                        </TooltipTrigger>
                        {!userInfo?.premium && (
                            <TooltipContent className="bg-[#192055] border-none text-white">
                                Función exclusiva para usuarios Premium.
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />

                <div className="realtive" >
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all disabled:text-gray-400"
                                    onClick={() => setEmojiPickerOpen(true)}
                                    disabled={!userInfo?.premium}
                                >
                                    <RiEmojiStickerLine className="text-2xl" />
                                </button>
                            </TooltipTrigger>
                            {!userInfo?.premium && (
                                <TooltipContent className="bg-[#192055] border-none text-white">
                                    Función exclusiva para usuarios Premium.
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>
                    <div className="absolute bottom-16 right-0" ref={emojiRef} >
                        <EmojiPicker theme="dark" open={emojiPickerOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
                    </div>
                </div>
            </div>
            <button className="bg-[#38449b] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#1e1bda] focus:bg-[#1e1bda] focus:outline-none focus:text-white duration-300 transition-all"
                onClick={handleSendMessage} >
                <IoSend className="text-2xl" />
            </button>
        </div>
    );
};

export default messageBar;