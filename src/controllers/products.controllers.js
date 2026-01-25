const Producto = require('../models/product.model')
const { deleteImgCloudinary} = require('../utils/cloudinary.utils')


/**
 * Obtiene la lista completa de productos de la base de datos.
 * @async
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Respuesta con el array de productos o error 500.
 */
const getProducts = async (req, res) => {
    try {
        const productos = await Producto.find()
        res.status(200).json(productos)
    } catch (error) {
        res.status(500).json({error: "Error al obtener los productos"})
    }
}

/**
 * Crea un nuevo producto y sube su imagen a Cloudinary.
 * @async
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Datos del producto (nombre, precio, etc.).
 * @param {Object} req.file - Archivo de imagen gestionado por Multer.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Producto creado o error (con limpieza de imagen en Cloudinary si falla).
 */
const createProduct = async (req, res) => {
    try {
        const newProduct = new Producto(req.body)
        if (req.file){
            newProduct.img = req.file.path
        } else {
            return res.status(400).json("Imagen obligatoria")
        }
        const productDB = await newProduct.save()
        return res.status(200).json(productDB)
    } catch (error) {
        if(req.file && req.file.path){
            deleteImgCloudinary(req.file.path)
        }
        if ( error.code === 11000){
            return res.status(409).json({error: "Producto duplicado", detalle: error.message})
        }
        return res.status(400).json({error: "Error al cargar el producto", detalle: error.message})
    }
}

/**
 * Actualiza los datos de un producto existente.
 * Si se sube una nueva imagen, elimina la anterior de Cloudinary.
 * @async
 * @param {Object} req - Objeto de petición.
 * @param {string} req.params.id - ID del producto a actualizar.
 * @param {Object} req.file - Nueva imagen opcional.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Promise<void>}
 */
const updateProduct = async (req,res) => {
    try {
        const {id} = req.params
        const prev = await Producto.findById(id)
        if (!prev){
            return res.status(404).json({error: "Producto no encontrado", detalle: error.message})
        }
        const updates = {...req.body}
        if(req.file){
            updates.img = req.file.path
            deleteImgCloudinary(prev.img)
        }
        const updated = await Producto.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        })
        return res.status(200).json(updated)
    } catch (error) {
        res.status(400).json({error: "Error al actualizar el producto", detalle: error.message})
    }
}

/**
 * Elimina un producto de la base de datos y su imagen de Cloudinary.
 * @async
 * @param {Object} req - Objeto de petición.
 * @param {string} req.params.id - ID del producto a eliminar.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Promise<void>}
 */
const deleteProduct = async (req,res) => {
    try{
        const {id} = req.params
        const deleted = await Producto.findByIdAndDelete(id)
        if(!deleted){
            return res.status(404).json("Producto no encontrado")
        }
        deleteImgCloudinary(deleted.img)
        return res.status(200).json({mensaje: "Producto borrado", producto: deleted})
    } catch (error){
        return res.status(404).json({error: "Error al eliminar producto", detalle: error.message})
}
}

/**
 * Busca productos cuyo nombre coincida parcialmente con el término proporcionado.
 * @async
 * @param {Object} req - Objeto de petición.
 * @param {string} req.params.nombre - Término de búsqueda.
 * @param {Object} res - Objeto de respuesta.
 * @returns {Promise<void>}
 */
const searchProductByName = async (req, res) => {
    try {
        const { nombre} = req.params
        if (!nombre) {
            return res.status(400).json({error: "Debes indicar el nombre"})
        }
        const productos = await Producto.find({nombre: new RegExp(nombre, "i")})
        res.status(200).json(productos)
    } catch (error) {
        res.status(500).json({error: "Error al buscar productos", detalles: error.message})
    }
}

/**
 * Filtra productos por categoría exacta o parcial.
 * @async
 * @param {Object} req - Objeto de petición.
 * @param {string} req.params.categoria - Categoría a filtrar (Bebidas, Comida, Limpieza).
 * @param {Object} res - Objeto de respuesta.
 * @returns {Promise<void>}
 */
const searchProductsByCategory = async (req, res) => {
    try {
        const {categoria} = req.params
        if (!categoria){
            return res.status(400).json({error: "Debes indicar una categoria valida"})
        }
        const productos = await Producto.find({categoria: new RegExp(categoria, "i")})
        res.status(200).json(productos)
    } catch (error) {
        res.status(500).json({error: "Error al buscar productos", detalle: error.message})
    }
}

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProductByName,
    searchProductsByCategory
}