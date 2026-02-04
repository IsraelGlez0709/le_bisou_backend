import jwt from "jsonwebtoken";

// Middleware para verificar que hay sesión iniciada
export const verificarToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    // El token viene así: "Bearer eyJhbGciOi..."
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. No hay token." });
    }

    try {
        // Verificamos si la firma es válida
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // IMPORTANTE: Guardamos los datos del usuario en la petición (req)
        // Así, en los controladores siguientes, podremos usar req.usuario.id
        req.usuario = decoded;

        next(); // Pasa a la siguiente función (el controlador real)
    } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado" });
    }
};

// Middleware extra: Solo permite pasar si es ADMIN
export const soloAdmin = (req, res, next) => {
    if (req.usuario && req.usuario.rol === "ADMIN") {
        next();
    } else {
        res.status(403).json({ error: "Acceso restringido a Administradores" });
    }
};
