import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import apiClient from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";


const NewDM = () => {
    const { setSelectedChatType, setSelectedChatData } = useAppStore();

    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);



    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const response = await apiClient.post(SEARCH_CONTACTS_ROUTES, { searchTerm }, { withCredentials: true });
                if (response.status === 200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts)
                }
            } else {
                setSearchedContacts([])
            }
        } catch (error) {
            console.log({ error });
        }
    }

    const selectNewContact = (contact) => {
        setOpenNewContactModal(false);
        setSelectedChatType("contact");
        setSelectedChatData(contact);
        setSearchedContacts([]);
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300 "
                            onClick={() => setOpenNewContactModal(true)} />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#192055] border-none md-2 p-3  text-white" >
                        Seleciona un Nuevo Contacto
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal} >
                <DialogContent className="bg-[#1c2041] border-none text-white w-[400px] h-[400px] flex flex-col" >
                    <DialogHeader>
                        <DialogTitle>Por favor Seleciona un Contacto</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Buscar Contactos" className="rounded-lg p-5 bg-[#131a49] border-none"
                            onChange={e => searchContacts(e.target.value)} />
                    </div>
                    {
                        searchedContacts.length>0 && (
                            <ScrollArea className="h-[250px] ">
                        <div className="flex flex-col gap-5">
                            {searchedContacts.map((contact => <div key={contact._id} className="flex gap-3 items-center cursor-pointer" onClick={() => selectNewContact(contact)} >
                                <div className="w-12 h-12 relative">
                                    <Avatar className="h-12 w-12  rounded-full overflow-hidden" >
                                        {contact.image ? (
                                            <AvatarImage
                                                src={`${HOST}/${contact.image}`}
                                                alt="profile"
                                                className=" object-cover w-full h-full bg-black " />
                                        ) : (
                                            <div className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                                                {contact.firstName
                                                    ? contact.firstName.split("").shift()
                                                    : contact.email.split("").shift()
                                                }
                                            </div>
                                        )}
                                    </Avatar>
                                </div>
                                <div className="flex flex-col">
                                    <span>
                                        {
                                            contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}`
                                                : contact.email
                                        }
                                    </span>
                                    <span className="text-xs">
                                        {contact.email}
                                    </span>
                                </div>

                            </div>
                            ))}
                        </div>
                    </ScrollArea>
                        )
                    }
                    
                    {searchedContacts.length <= 0 && (
                        <div className="flex-1 md:bg-[#1c2041] md:flex md:mt-0 flex-col justify-center items-center hidden duration-100 transition-all" >
                            <Lottie
                                isClickToPauseDisabled={true}
                                height={100}
                                width={100}
                                options={animationDefaultOptions}
                            />
                            <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-2xl transition-all duration-300 text-center " >
                                <h3 className="poppins-semibold-italic mt-2" >
                                    Hi<span className="text-blue-600" >!</span> Buscando
                                    <span className="text-blue-600"> Amigos?</span>
                                </h3>
                            </div>
                        </div>
                    )
                    }
                </DialogContent>
            </Dialog>

        </>
    );
};

export default NewDM;