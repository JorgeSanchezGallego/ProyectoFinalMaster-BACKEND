const dotenv = require('dotenv') // Carga de variables de entorno
dotenv.config() // Traductor que lee las variables y las carga en process.env
const cloudinary = require('cloudinary').v2 // Inmportamos cloudinaryv2

/**
 * Configura la conexión con la API de Cloudinary.
 * Lee las credenciales (Cloud Name, API Key, Secret) desde las variables de entorno.
 * * @returns {void} No retorna nada, inicializa la configuración global de la librería.
 */
const connectCloudinary = () => {
    try {
        cloudinary.config({ //Le pasamos las credenciales necesarias para saber donde subir las fotos
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
        console.log('Conectado con éxito a Cloudinary');//Confirmacion de que todo va bien
    } catch (error) {
        console.log('Error al conectar a Cloudinary', error); //Mostramos error 
    }
}

module.exports = {connectCloudinary}