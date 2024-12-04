import jwt from 'jsonwebtoken'


export const verifyToken = (request, response, next) => {
    const token = request.cookies.jwt;
    if (!token) return response.status(401).send("Tú no estás Autenticado!")
    jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
        if (err) return response.status(403).send("Token no Valido!");
        request.userId = payload.userId;
        next();
    });
}


