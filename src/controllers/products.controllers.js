const Producto = require('../models/product.model')
const { deleteImgCloudinary} = require('../utils/cloudinary.utils')

const getProducts = async (req, res) => {
    try {
        const productos = await Producto.find()
        res.status(200).json(productos)
    } catch (error) {
        res.status(500).json({error: "Error al obtener los productos"})
    }
}

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

const searchProductByName = async (req, res) => {
    try {
        const { nombre} = req.query
        if (!nombre) {
            return res.status(400).json({error: "Debes indicar el nombre"})
        }
        const producto = await Producto.find({nombre: new RegExp(nombre, "i")})
        res.status(200).json(producto)
    } catch (error) {
        res.status(500).json({error: "Error al buscar productos", detalles: error.message})
    }
}