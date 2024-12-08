import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
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
import apiClient from "@/lib/api-client";
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTES, } from "@/utils/constants";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";


const CreateChannel = () => {
    const { setSelectedChatType, setSelectedChatData, addChannel } = useAppStore();

    const [newChannelModal, setNewChannelModal] = useState(false);

    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState("");


    useEffect(() => {
        const getData = async () => {
            const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, { withCredentials: true });
            setAllContacts(response.data.contacts);
        }
        getData()
    }, [])


    const createChannel = async () => {
        try {
            if (channelName.length > 0 && selectedContacts.length > 0) {
                const response = await apiClient.post(CREATE_CHANNEL_ROUTE, {
                    name: channelName,
                    members: selectedContacts.map((contact) => contact.value),

                }, { withCredentials: true }
                );
                if (response.status === 201) {
                    setChannelName("");
                    setSelectedContacts([]);
                    setNewChannelModal(false);
                    addChannel(response.data.channel);

                }
            }
        } catch (error) {
            console.log({ error });
        }
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300 "
                            onClick={() => setNewChannelModal(true)} />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#192055] border-none md-2 p-3  text-white" >
                        Crear nuevo Chat Grupal
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={newChannelModal} onOpenChange={setNewChannelModal} >
                <DialogContent className="bg-[#1c2041] border-none text-white w-[400px] h-[400px] flex flex-col" >
                    <DialogHeader>
                        <DialogTitle>Por favor completa los datos para el nuevo grupo</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Nombre del grupo" className="rounded-lg p-5 bg-[#131a49] border-none"
                            onChange={e => setChannelName(e.target.value)} value={channelName}
                        />
                    </div>
                    <div>
                        <MultipleSelector
                            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                            defaultOptions={allContacts}
                            placeholder="Buscar contactos"
                            value={selectedContacts}
                            onChange={setSelectedContacts}
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-500" >
                                    Resultados no encontrados
                                </p>
                            }
                        />
                    </div>
                    <div>
                        <Button className="w-full bg-purple-500 hover:bg-purple-950 transition-all duration-300"
                            onClick={createChannel}
                        >Crear Grupo</Button>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    );
};

export default CreateChannel; 