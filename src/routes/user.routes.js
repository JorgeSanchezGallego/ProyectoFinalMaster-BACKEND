const express = require('express')
const { registerUser, loginUser} = require('../controllers/users.controllers')
const {subidaUsuarios} = require('../middlewares/file')

/**
 * Enrutador de Usuarios.
 * Gestiona los endpoints públicos para el acceso al sistema: registro e inicio de sesión.
 * @module routes/users
 */
const router = express.Router()

/**
 * Registro de nuevo usuario.
 * Permite crear una cuenta enviando datos de usuario y una imagen de perfil opcional.
 * @name post/register
 * @route {POST} /register
 * @bodyparam {string} nombre - Nombre completo.
 * @bodyparam {string} email - Correo electrónico único.
 * @bodyparam {string} password - Contraseña (mínimo 8 caracteres).
 * @bodyparam {File} [img] - Imagen de perfil (campo 'img').
 */
router.post('/register', subidaUsuarios.single('img'), registerUser)
/**
 * Inicio de sesión de usuario.
 * Valida credenciales y devuelve un token JWT para autenticación futura.
 * @name post/login
 * @route {POST} /login
 * @bodyparam {string} email - Correo electrónico del usuario.
 * @bodyparam {string} password - Contraseña del usuario.
 */
router.post('/login', loginUser)

module.exports = router