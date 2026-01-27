const mongoose = require('mongoose')//Importamos mongoose
const dotenv = require('dotenv')// Carga de variables de entorno

dotenv.config()// Traductor que lee las variables y las carga en process.env

/**
 * Establece la conexión con la base de datos MongoDB.
 * Utiliza la URL de conexión definida en las variables de entorno (DB_URL).
 * @async
 * @returns {Promise<void>} Una promesa que se resuelve cuando la conexión es exitosa.
 * @throws {Error} Muestra un mensaje de error en consola si la conexión falla.
 */
const connectDB = async () => {//Montamos funcion async por que no es instantaneo, necesita await mas abajo
    try {
        await mongoose.connect(process.env.DB_URL)//Conectamos con la Database y hasta que no termine no continua
        console.log("Conectado con éxito a la BBDD 🟢");//Mensaje de exito
    } catch (error) {
        console.log("Error en la conexión a la BBDD 🔴" + error);//Mensaje de error
    }
}

module.exports = {connectDB}