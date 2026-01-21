const User = require('../models/user.model')
const {verifyToken} = require('../utils/token')

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