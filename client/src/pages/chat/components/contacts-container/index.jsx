import ProfileInfo from "./components/profile-info";
import NewDM from "./components/new-dm";
import { useEffect } from "react";
import apiClient from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNELS_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/contact-list";
import CreateChannel from "./components/create-channel";

const ContactsContainer = () => {

    const { setDirectMessageContacts, directMessageContacts, channels, setChannels } = useAppStore();

    useEffect(() => {
        const getContacts = async () => {
            const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
                withCredentials: true,
            });
            if (response.data.contacts) {
                setDirectMessageContacts(response.data.contacts);
            }
        };

        const getChannels = async () => {
            const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
                withCredentials: true,
            });
            if (response.data.channels) {
                setChannels(response.data.channels);
            }
        };

        getContacts();
        getChannels();
    }, [setChannels, setDirectMessageContacts]);

    return (
        <div className="relative md:-[35vw] lg:w-[30vw] xl:w-[25vw] bg-[#111531] border-r-4 border-[#282853] w-full " >
            <div className="p-3" >
                <Logo />
            </div>
            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text="#Chats" />
                    <NewDM />
                </div>
                <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden" >
                    <ContactList contacts={directMessageContacts} />
                </div>
            </div>
            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text="#Grupos" />
                    <CreateChannel />
                </div>
                <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden" >
                    <ContactList contacts={channels} isChannel={true} />
                </div>
            </div>
            <ProfileInfo />
        </div>
    );
};

export default ContactsContainer;

// const Logo = () => {
//     return (
//         <div className="flex p-5  justify-start items-center gap-2">
//             <svg
//                 id="logo-38"
//                 width="78"
//                 height="32"
//                 viewBox="0 0 78 32"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//             >
//                 {" "}
//                 <path
//                     d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
//                     className="ccustom"
//                     fill="#2d2faa"
//                 ></path>{" "}
//                 <path
//                     d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
//                     className="ccompli1"
//                     fill="#8383e9"
//                 ></path>{" "}
//                 <path
//                     d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
//                     className="ccompli2"
//                     fill="#a9a9fc"
//                 ></path>{" "}
//             </svg>
//             <span className="text-2xl font-semibold ">CHAT-APP</span>
//         </div>
//     );
// };
const Logo = () => {
    return (
        <div className="flex p-5 justify-start items-center gap-4">
            <div className="relative flex items-center">
                {/* SVG Animado */}
                <svg
                    id="logo-pendulum"
                    width="78"
                    height="32"
                    viewBox="0 0 78 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative"
                >
                    <path
                        d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
                        className="origin-top animate-newton-pendulum-slow"
                        fill="#4f46e5"
                    ></path>
                    <path
                        d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
                        className="origin-top animate-newton-pendulum-medium"
                        fill="#818cf8"
                    ></path>
                    <path
                        d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
                        className="origin-top animate-newton-pendulum-fast"
                        fill="#c7d2fe"
                    ></path>
                </svg>
            </div>
            {/* Texto con gradiente */}
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse">
                CHAT-APP
            </span>
        </div>
    );
};


const Title = ({ text }) => {
    return (
        <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
            {text}
        </h6>
    );
};