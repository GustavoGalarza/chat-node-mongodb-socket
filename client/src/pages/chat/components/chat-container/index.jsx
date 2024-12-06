import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";
import MessageContainer from "./components/message-container";
import Background from '@/assets/bg4.jpg'

const ChatContainer = () => {
    return (
        <div className="fixed top-0  bg-[#1c2041] flex flex-col md:static md:flex-1 " style={{ backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center' }} >
            <ChatHeader />
            <MessageContainer />
            <MessageBar />
        </div>
    );
};

export default ChatContainer;