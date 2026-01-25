const User = require('../models/user.model')
const {verifyToken} = require('../utils/token')


/**
 * Middleware para autenticar usuarios mediante JWT.
 * Verifica la presencia del token en la cabecera 'Authorization', lo valida y recupera 
 * los datos del usuario de la base de datos para inyectarlos en el objeto 'req'.
 * @async
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware o controlador.
 * @returns {Promise<void>} Responde con 401 si el token no existe, es inválido o el usuario no existe.
 */
const isAuth = async(req, res, next) => {
    try {
        const authorization = req.headers.authorization
        if (!authorization) {
            return res.status(401).json("No autorizado")
        }
        const token = authorization.split(" ")[1]
        const { id } = verifyToken(token)
        const user = await User.findById(id)
        if (!user) {
            return res.status(401).json("Token o usuario invalidos")
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json("Token invalido o sesión expirada")
    }
}

/**
 * Middleware para restringir el acceso únicamente a usuarios con el rol 'encargado'.
 * Requiere que el middleware 'isAuth' se haya ejecutado previamente con éxito.
 * @async
 * @param {Object} req - Objeto de petición de Express que contiene 'req.user'.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente paso.
 * @returns {void} Responde con 403 si el rol no es válido o hay error de permisos.
 */
const isManager = async (req, res, next) => {
    try {
        if (req.user && req.user.role === "encargado") {
            return next()
        } else {
            return res.status(403).json("Acceso denegado")
        }
    } catch (error) {
        return res.status(403).json("Error de permisos")
    }
}

/**
 * Middleware para restringir el acceso únicamente a usuarios con el rol 'comercial'.
 * Requiere que el middleware 'isAuth' se haya ejecutado previamente con éxito.
 * @async
 * @param {Object} req - Objeto de petición de Express que contiene 'req.user'.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente paso.
 * @returns {void} Responde con 403 si el rol no es válido o hay error de permisos.
 */
const isSupplier = async (req, res, next) => {
    try {
        if (req.user && req.user.role === "comercial") {
            return next()
        } else {
            return res.status(403).json("Acceso denegado")
        }
    } catch (error) {
        return res.status(403).json("Error de permisos")
    }
}

module.exports = {isAuth, isManager, isSupplier}