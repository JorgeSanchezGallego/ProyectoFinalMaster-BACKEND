const multer = require('multer')
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')

const storageProducts = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "productos",
        allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
    },
})


const storageUsers = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "users",
        allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
    },
})

const subidaProductos = multer({storage: storageProducts})
const subidaUsuarios = multer({storage: storageUsers})

module.exports = {subidaProductos, subidaUsuarios}