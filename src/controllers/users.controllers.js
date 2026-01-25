const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const {generateToken} = require('../utils/token')
const {deleteImgCloudinary} = require('../utils/cloudinary.utils')


/**
 * Registra un nuevo usuario en el sistema.
 * Verifica si el email ya existe y gestiona la subida de la imagen de perfil a Cloudinary.
 * En caso de error o usuario duplicado, elimina la imagen subida para evitar huérfanos.
 * @async
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Datos del usuario (nombre, email, password, role).
 * @param {Object} [req.file] - Archivo de imagen opcional gestionado por Multer.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Respuesta 201 con el usuario creado o 400 si hay error.
 */
const registerUser = async (req, res) => {
    try {
        const user = new User(req.body)
        const userExist = await User.findOne({email: user.email})
        if (userExist) {
            if (req.file) {
                deleteImgCloudinary(req.file.path)
            }
            return res.status(400).json("El usuario ya existe")
        }
        if (req.file) {
            user.img = req.file.path
        }
        const userDB = await user.save()
        userDB.password = null
        res.status(201).json(userDB)
    } catch (error) {
        if (req.file) {
                deleteImgCloudinary(req.file.path)
            }
        res.status(400).json({error: "Error al registrar al usuario", detalle: error.message})
    }
}

/**
 * Autentificación de un usuario y genera un token de acceso.
 * Compara la contraseña proporcionada con el hash almacenado en la base de datos.
 * @async
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Credenciales del usuario (email, password).
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Respuesta 200 con el token y datos del usuario, o 400 si fallan las credenciales.
 */
const loginUser = async (req,res) => {
    try {
        const { email, password} = req.body
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json("Contraseña o usuario incorrecto")
        }
        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword) {
            return res.status(400).json("Contraseña o usuario incorrecto")
        }
        const token = generateToken(user.id, user.email)
        user.password = null
        return res.status(200).json({token, user})
    } catch (error) {
        return res.status(400).json("Error al login")
    }
}

module.exports = {registerUser, loginUser}