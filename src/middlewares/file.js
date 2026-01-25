const multer = require('multer')
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')


/**
 * Configuración del almacenamiento para las imágenes de productos.
 * Define la carpeta de destino en Cloudinary ('productos') y los formatos permitidos.
 * @type {CloudinaryStorage}
 */
const storageProducts = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "productos",
        allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
    },
})

/**
 * Configuración del almacenamiento para las imágenes de perfil de usuarios.
 * Define la carpeta de destino en Cloudinary ('users') y los formatos permitidos.
 * @type {CloudinaryStorage}
 */
const storageUsers = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "users",
        allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
    },
})

/**
 * Middleware de Multer configurado para la subida de imágenes de productos.
 * @type {multer.Multer}
 */
const subidaProductos = multer({storage: storageProducts})

/**
 * Middleware de Multer configurado para la subida de imágenes de usuarios.
 * @type {multer.Multer}
 */
const subidaUsuarios = multer({storage: storageUsers})

module.exports = {subidaProductos, subidaUsuarios}