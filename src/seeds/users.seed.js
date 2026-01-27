const mongoose = require('mongoose')
const User = require('../models/user.model')
const dotenv = require('dotenv')
dotenv.config()
const {leerCSV} = require('../utils/csvReader')

/**
 * Script de automatización para la carga inicial de usuarios (Seeding).
 * * Acciones realizadas:
 * 1. Conexión a MongoDB.
 * 2. Limpieza de la colección de usuarios.
 * 3. Lectura de datos desde "Usuarios.csv".
 * 4. Creación individual de usuarios para disparar middlewares de encriptación.
 * 5. Cierre de conexión.
 * * @async
 * @function seedUsers
 * @returns {Promise<void>}
 */
const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)//Hasta que no conecte con la DB no continua
        console.log("Conectado a la BBDD");//Mensaje de éxito
        await User.deleteMany({})//Hasta que no borre la DB de productos no continua
        console.log("Usuarios borrados");//Mensaje de éxito
        const usuariosData = await leerCSV("Usuarios.csv")//Declaramos nuestros productos y llamamos a nuestra funcion leerCSV que necesita un CSV
        for (const user of usuariosData) {
            await User.create(user) //Forof para recorrer cada usuario y poder encriptar la contraseña y los creamos uno a uno
        }
        console.log(`Numero de usuarios registrados: ${usuariosData.length}`);//Mensaje de éxito
    } catch (error) {
        console.error('Error: ' + error)
    } finally {
        mongoose.disconnect()//Nos desconectamos de mongoose
    }
}

seedUsers()//Llamamos a la función