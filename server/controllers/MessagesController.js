import path from "path";
import Message from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from "fs"

export const getMessages = async (request, response, next) => {
    try {
        const user1 = request.userId;
        const user2 = request.body.id;

        if (!user1 || !user2) {
            return response.status(400).send("Both user IDs are required.");
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ],
        }).sort({ timestamp: 1 });

        return response.status(200).json({ messages });

    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error messages controller");
    }
};

export const uploadFiles = async (request, response, next) => {
    try {
        if (!request.file) {
            return response.status(400).send("Archivo Requerido")
        }
        const date = Date.now();
        const uploadDir = path.resolve("uploads/files", date.toString()); // Ruta absoluta para el directorio
        const absoluteFilePath = path.join(uploadDir, request.file.originalname); // Ruta completa para el archivo

        // Crear el directorio si no existe
        mkdirSync(uploadDir, { recursive: true });

        // Mover el archivo desde la ubicación temporal
        renameSync(request.file.path, absoluteFilePath);

        // Generar la ruta relativa para almacenar en la base de datos
        const relativeFilePath = `/uploads/files/${date}/${request.file.originalname}`;

        return response.status(200).json({ filePath: relativeFilePath });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error messages controller");
    }
}; 