import { useSocket } from "@/context/socketContext";
import { useAppStore } from "@/store";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr"
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";


const messageBar = () => {

    const emojiRef = useRef();
    const socket = useSocket();
    const { selectedChatType, selectedChatData, userInfo } = useAppStore();
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

            })
        }
    }

    return (
        <div className="h-[10vh] bg-[#1c2041] flex justify-center items-center px-7 mb-9 gap-6" >
            <div className="flex-1 flex bg-[#38449b] rounded-md items-center gap-5 pr-5">
                <input type="text" className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none" placeholder="Ingresa un mensaje" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                >
                    <GrAttachment className="text-2xl" />
                </button>
                <div className="realtive" >
                    <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                        onClick={() => setEmojiPickerOpen(true)}>
                        <RiEmojiStickerLine className="text-2xl" />
                    </button>
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