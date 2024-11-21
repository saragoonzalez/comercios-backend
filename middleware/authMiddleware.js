const jwt = require('jsonwebtoken')
const handleError = require('./slackMiddleware')

const JWT_KEY = process.env.JWT_KEY //Se obtiene de las variables de entorno el JWT Key a utilizar

// Middleware para verificar el token
exports.verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] // Se espera que el token venga en el header Authorization: Bearer <token>

    if (!token){
        return res.status(401).json({ error: 'No se proporciona token' })
    }
        

    try {
        const decoded = jwt.verify(token, JWT_KEY)
        req.user = decoded // Agrega los datos del usuario al objeto `req`
        next()
    } catch (error) {
        await handleError(error, 'Error en verifyToken: No se proporciona token')
        res.status(403).json({ error: 'Token inválido' })
    }
}

// Verificar si el usuario es admin
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Acceso denegado: Solo los administradores pueden realizar esta acción' })
    next()
}
