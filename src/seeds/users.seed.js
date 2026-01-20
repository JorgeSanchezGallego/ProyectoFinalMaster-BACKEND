const mongoose = require('mongoose')
const User = require('../models/user.model')
const dotenv = require('dotenv')
dotenv.config()
const {leerCSV} = require('../utils/csvReader')

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Conectado a la BBDD");
        await User.deleteMany({})
        console.log("Usuarios borrados");
        const usuariosData = await leerCSV("Usuarios.csv")
        for (const user of usuariosData) {
            await User.create(user)
        }
        console.log(`Numero de usuarios registrados: ${usuariosData.length}`);
    } catch (error) {
        console.error('Error: ' + error)
    } finally {
        mongoose.disconnect()
    }
}

seedUsers()