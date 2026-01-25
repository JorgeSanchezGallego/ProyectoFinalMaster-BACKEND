const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

/**
 * Establece la conexión con la base de datos MongoDB.
 * Utiliza la URL de conexión definida en las variables de entorno (DB_URL).
 * @async
 * @returns {Promise<void>} Una promesa que se resuelve cuando la conexión es exitosa.
 * @throws {Error} Muestra un mensaje de error en consola si la conexión falla.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Conectado con éxito a la BBDD 🟢");
    } catch (error) {
        console.log("Error en la conexión a la BBDD 🔴" + error);
    }
}

module.exports = {connectDB}