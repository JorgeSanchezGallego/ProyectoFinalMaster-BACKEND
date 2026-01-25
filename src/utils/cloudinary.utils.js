const cloudinary = require('cloudinary').v2

/**
 * Elimina una imagen alojada en Cloudinary a partir de su URL completa.
 * * El proceso extrae el 'public_id' necesario para el borrado, asumiendo la estructura:
 * .../nombre_carpeta/nombre_archivo.extension
 * * @param {string} url - La URL absoluta de la imagen (proporcionada por cloudinary en req.file.path).
 * @returns {void} No retorna valor, realiza una operación asíncrona de borrado.
 */
const deleteImgCloudinary = (url) => {
    const array = url.split('/')
    const name = array.at(-1).split(".")[0]

    let public_id = `${array.at(-2)}/${name}`

    cloudinary.uploader.destroy(public_id, () => {
        console.log('Imagen eliminada');
    })
}

module.exports = {deleteImgCloudinary}