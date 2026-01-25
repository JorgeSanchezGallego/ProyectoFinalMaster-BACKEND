const Pedido = require('../models/pedido.model')
const Producto = require('../models/product.model')


/**
 * Crea un nuevo pedido en el sistema.
 * Valida la existencia de los productos, asigna sus precios actuales desde la base de datos 
 * para evitar manipulaciones y calcula el total automáticamente.
 * * @async
 * @param {Object} req - Objeto de petición de Express. 
 * @param {Object} req.body - Contiene el array de productos ({product: id, quantity: number}).
 * @param {Object} req.user - Usuario autenticado obtenido del middleware isAuth.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Envía una respuesta 201 con el pedido creado o 500 si hay un error.
 */
const createPedido = async (req, res) => {
    try {
        const { products } = req.body
        if (!products || products.length === 0) {
            return res.status(400).json({ error: "El pedido debe tener productos" })
        }
        const productsWithPrice = await Promise.all(products.map(async (item) => {
            const productDB = await Producto.findById(item.product)
            if (!productDB) {
                throw new Error(`Producto con ID ${item.product} no encontrado`)
            }
            return {
                product: item.product,
                quantity: item.quantity,
                price: productDB.precio
            }
        }))
        const newPedido = new Pedido({
            user: req.user._id,
            products: productsWithPrice
        })
        const pedidoSaved = await newPedido.save()
        await pedidoSaved.populate('products.product')
        return res.status(201).json({ detalle: "Pedido realizado con éxito", pedido: pedidoSaved })
    } catch (error) {
        return res.status(500).json({ error: "Error al crear el pedido", detalle: error.message })
    }
}

/**
 * Obtiene el historial de pedidos del usuario autenticado.
 * Los pedidos se devuelven ordenados por fecha de creación descendente.
 * * @async
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.user - Usuario autenticado (proporcionado por el middleware).
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Envía una respuesta 200 con el array de pedidos o 500 si falla.
 */
const getPedidos = async (req,res) => {
    try {
        const pedidos = await Pedido.find({user: req.user._id}).populate('products.product').sort({createdAt: -1})
        return res.status(200).json(pedidos)
    } catch (error) {
        return res.status(500).json("Error al obtener el historial")
    }
}

module.exports = {
    createPedido,
    getPedidos
}