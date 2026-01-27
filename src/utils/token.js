const jwt = require('jsonwebtoken')//Firma datos con una clave secreta

/**
 * Genera un token JWT firmado para un usuario.
 * @param {*} id - El ID único del usuario en Mongo.
 * @param {*} email - El correo electrónico del usuario.
 * @returns {string} El token JWT generado en formato string.
 */
const generateToken = (id, email) => {//Funcion para generar un token cuando el usuario introduce su email y contraseña correctas
    return jwt.sign(
        {id, email},//Guardamos id y email para saber que usuario es
        process.env.JWT_SECRET,//Firma unica del servidor
        {expiresIn: "1d"}//Solo estara disponible la sesion durante un dia
    )
}

/**
 * Verifica si un token JWT es válido y no ha expirado.
 * @param {*} token - El token JWT recibido .
 * @returns {Object} El payload decodificado del usuario (id, email...) si el token es correcto.
 * @throws {Error} Lanza un error si el token es falso, ha caducado o está mal formado.
 */
const verifyToken = (token) => {//Funcion para comprobar si un token es valido
    return jwt.verify(token, process.env.JWT_SECRET)//Comprueba que no ha caducado, que la firma coincide con JWTSecret, si todo va bien devuelve el objeto original
}

module.exports = { generateToken, verifyToken }