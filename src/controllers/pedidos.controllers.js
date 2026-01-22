const Pedido = require('../models/pedido.model')

const createPedido = async (req, res) => {
    try {
        const newPedido = new Pedido(req.body)
        newPedido.user = req.user._id
        const pedidoSaved = await newPedido.save()
        return res.status(201).json({detalle: "Pedido realizado con éxito", pedido: pedidoSaved})
    } catch (error) {
        return res.status(500).json({error: "Error al crear el pedido", detalle: error.message})
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