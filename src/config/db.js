const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Conectado con éxito a la BBDD 🟢");
    } catch (error) {
        console.log("Error en la conexión a la BBDD 🔴" + error);
    }
}

module.exports = {connectDB}