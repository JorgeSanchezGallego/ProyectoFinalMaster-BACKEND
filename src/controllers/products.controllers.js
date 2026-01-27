const Producto = require('../models/product.model')
const { deleteImgCloudinary} = require('../utils/cloudinary.utils')


/**
 * Obtiene la lista completa de productos de la base de datos.
 * @async
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Respuesta con el array de productos o error 500.
 */
const getProducts = async (req, res) => {//Listamos todos los videojuegos
    try {
        const productos = await Producto.find() //Find devuelve toda la colección
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
const createProduct = async (req, res) => {//Subida de producto
    try {
        const newProduct = new Producto(req.body)//Intanciamos el modelo con los datos del req.body
        if (req.file){//Gestionamos la imagen, multer la deja en req.file
            newProduct.img = req.file.path //Guardamos en img la imagen que viene desde req.file
        } else {
            return res.status(400).json("Imagen obligatoria")
        }
        const productDB = await newProduct.save()//Guardamos en mongo, hasta que no se complete no se avanza
        return res.status(200).json(productDB)
    } catch (error) {
        if(req.file && req.file.path){ //Limpiamos si hay error y borramos la imagen
            deleteImgCloudinary(req.file.path)
        }
        if ( error.code === 11000){//Gestion de duplicados
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
const updateProduct = async (req,res) => {//Actualizar producto
    try {
        const {id} = req.params //Destructuring y guardamos el id
        const prev = await Producto.findById(id)//Capturamos el producto por id y no avanza hasta que se complete
        if (!prev){
            return res.status(404).json({error: "Producto no encontrado", detalle: error.message})//Mensaje de error
        }
        const updates = {...req.body}//Nuevo juego
        if(req.file){//Si el usuario sube una imagen nueva
            updates.img = req.file.path//Actualizamos la imagen
            deleteImgCloudinary(prev.img)//Borramos la antigua
        }
        const updated = await Producto.findByIdAndUpdate(id, updates, {//Aplicamos la actualizacion
            new: true, //Devuelve el objeto ya modificado
            runValidators: true //Asegura que las reglas del modelo se respetan al editar
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
const deleteProduct = async (req,res) => {//Borrar producto
    try{
        const {id} = req.params //Recuperamos el id
        const deleted = await Producto.findByIdAndDelete(id) //Buscamos y borramos en un solo paso y lo almacenamos en una variable
        if(!deleted){
            return res.status(404).json("Producto no encontrado")
        }
        deleteImgCloudinary(deleted.img) //Borramos imagen de cloudinary
        return res.status(200).json({mensaje: "Producto borrado", producto: deleted}) //Usamos la variable para mostrar por pantalla el videojuego borrado
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
const searchProductByName = async (req, res) => {//Busqueda por nombre
    try {
        const { nombre} = req.params//Recuperamos el nombre
        if (!nombre) { // Comprobaciones
            return res.status(400).json({error: "Debes indicar el nombre"})
        }
        const productos = await Producto.find({nombre: new RegExp(nombre, "i")}) //Buscamos por titulo y le decimos que sea insensitivo a mayusculas
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
const searchProductsByCategory = async (req, res) => {//Busqueda por categoria
    try {
        const {categoria} = req.params //Recuperamos la categoria
        if (!categoria){ 
            return res.status(400).json({error: "Debes indicar una categoria valida"})
        }
        const productos = await Producto.find({categoria: new RegExp(categoria, "i")}) //Buscamos el producto por categoria insensitivo a mayúsculas
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