const dotenv = require('dotenv')
dotenv.config()
const cloudinary = require('cloudinary').v2

/**
 * Configura la conexión con la API de Cloudinary.
 * Lee las credenciales (Cloud Name, API Key, Secret) desde las variables de entorno.
 * * @returns {void} No retorna nada, inicializa la configuración global de la librería.
 */
const connectCloudinary = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
        console.log('Conectado con éxito a Cloudinary');
    } catch (error) {
        console.log('Error al conectar a Cloudinary', error);      
    }
}

module.exports = {connectCloudinary}