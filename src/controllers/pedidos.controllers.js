const Pedido = require('../models/pedido.model')
const Producto = require('../models/product.model')

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