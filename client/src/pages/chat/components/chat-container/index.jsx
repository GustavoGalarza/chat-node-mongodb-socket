import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";
import MessageContainer from "./components/message-container";

const ChatContainer = () => {
    return (
        <div className="fixed top-0 h-[49vw] w-[100vw] bg-[#1c2041] flex flex-col md:static md:flex-1 " >
            <ChatHeader />
            <MessageContainer />
            <MessageBar />
        </div>
    );
};

export default ChatContainer;