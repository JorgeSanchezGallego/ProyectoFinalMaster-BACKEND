const jwt = require('jsonwebtoken')

/**
 * Genera un token JWT firmado para un usuario.
 * @param {*} id - El ID único del usuario en Mongo.
 * @param {*} email - El correo electrónico del usuario.
 * @returns {string} El token JWT generado en formato string.
 */
const generateToken = (id, email) => {
    return jwt.sign(
        {id, email},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )
}

/**
 * Verifica si un token JWT es válido y no ha expirado.
 * @param {*} token - El token JWT recibido .
 * @returns {Object} El payload decodificado del usuario (id, email...) si el token es correcto.
 * @throws {Error} Lanza un error si el token es falso, ha caducado o está mal formado.
 */
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = { generateToken, verifyToken }