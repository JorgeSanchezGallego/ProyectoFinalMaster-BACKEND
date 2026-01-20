const dotenv = require('dotenv')
dotenv.config()
const cloudinary = require('cloudinary').v2

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