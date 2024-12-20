
import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import { renameSync, unlinkSync } from "fs"

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge, });
};

export const signup = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email o Contraseña requerido")
        }
        const user = await User.create({ email, password });
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return response.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            },
        });
    } catch ({ error }) {
        console.log({ error });
        return response.status(500).send("Internal Server Error Auhtcontroller");
    }
};

export const login = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email o Contraseña requerido");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(404).send("Usuario con Correo proporcionado no encontrado");
        }
        const auth = await compare(password, user.password);
        if (!auth) {
            return response.status(400).send("Password es inconrrecto");
        }


        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
                premium:user.premium,
            },
        });
    } catch ({ error }) {
        console.log({ error });
        return response.status(500).send("Internal Server Error Auhtcontroller");
    }
};


export const getUserInfo = async (request, response, next) => {
    try {
        const userData = await User.findById(request.userId);
        if (!userData) {
            return response.status(404).send("Usuario con ID no encontrado");
        }
        return response.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
            premium:userData.premium,
        });
    } catch ({ error }) {
        console.log({ error });
        return response.status(500).send("Internal Server Error Auhtcontroller getUserInfo      ");
    }
};


export const updateProfile = async (request, response, next) => {
    try {
        const { userId } = request;
        const { firstName, lastName, color } = request.body;
        if (!firstName || !lastName || !color) {
            return response.status(400).send("Nombre Apellido y color es requerido.");
        }

        const userData = await User.findByIdAndUpdate(userId, {
            firstName, lastName, color, profileSetup: true
        }, { new: true, runValidators: true })

        return response.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });
    } catch ({ error }) {
        console.log({ error });
        return response.status(500).send("Internal Server Error Auhtcontroller getUserInfo      ");
    }
};


export const addProfileImage = async (request, response, next) => {
    try {
        if (!request.file) {
            return response.status(400).send("Archivo Requerido.")
        }

        const date = Date.now();
        let fileName = "uploads/profiles/" + date + request.file.originalname;
        renameSync(request.file.path, fileName)

        const updatedUser = await User.findByIdAndUpdate(request.userId, { image: fileName }, { new: true, runValidators: true })

        return response.status(200).json({
            image: updatedUser.image,

        });
    } catch ({ error }) {
        console.log({ error });
        return response.status(500).send("Internal Server Error Auhtcontroller getUserInfo");
    }
};


export const removeProfileImage = async (request, response, next) => {
    try {
        const { userId } = request;
        const user = await User.findById(userId);

        if (!user) {
            return response.status(404).send("Usuario no encontrado-image");
        }
        if (user.image) {
            unlinkSync(user.image)
        }
        user.image = null;
        await user.save();

        return response.status(200).send("Imagen del perfil removida");
    } catch ({ error }) {
        console.log({ error });
        return response.status(500).send("Internal Server Error Auhtcontroller getUserInfo");
    }
};
export const updateUserPremiumStatus = async (request, response, next) => {
    try {
        const { userId } = request.body;  // El ID del usuario debe venir en el cuerpo de la solicitud
        const user = await User.findById(userId);

        if (!user) {
            return response.status(404).send("Usuario no encontrado");
        }

        // Actualizar el estado premium a true
        user.premium = true;
        await user.save();  // Guardamos los cambios en la base de datos

        return response.status(200).json({
            message: "El estado premium se ha actualizado con éxito.",
            premium: user.premium,  // Retorna el estado premium actualizado
        });
    } catch (error) {
        console.log(error);
        return response.status(500).send("Error al actualizar el estado premium.");
    }
};

export const logout = async (request, response, next) => {
    try {
        response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });

        return response.status(200).send("Logout exitoso.");
    } catch ({ error }) {
        console.log({ error });
        return response.status(500).send("Internal Server Error Auhtcontroller getUserInfo");
    }
}; 
