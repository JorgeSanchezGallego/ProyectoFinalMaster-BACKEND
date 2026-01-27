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
        const { products } = req.body //Extraemos mediante destructuring el array de productos que el cliente envía
        if (!products || products.length === 0) { //Validación de seguridad. Si no hay productos, cortamos
            return res.status(400).json({ error: "El pedido debe tener productos" })
        }
        const productsWithPrice = await Promise.all(products.map(async (item) => { //Permite que todas las búsquedas en la base de datos se lancen a la vez, esperando a que todas terminen para continuar. Recorremos cada producto del pedido para procesarlo de forma individual y asíncrona.
            const productDB = await Producto.findById(item.product) //Buscamos el producto en la base de datos usando el ID enviado por el usuario.
            if (!productDB) {
                throw new Error(`Producto con ID ${item.product} no encontrado`)
            }
            return { //Creamos un nuevo objeto que combina lo que pidió el usuario con el precio oficial de la base de datos.
                product: item.product,
                quantity: item.quantity,
                price: productDB.precio
            }
        }))
        const newPedido = new Pedido({ //Instanciamos el modelo Pedido, usamos el req.user._id para usar el id del usuario logueado
            user: req.user._id,
            products: productsWithPrice
        })
        const pedidoSaved = await newPedido.save() //Guardamos el pedido en MongoDB.
        await pedidoSaved.populate('products.product') //Una vez guardado, le decimos a Mongoose que sustituya los IDs de los productos por la información real del producto
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
        const pedidos = await Pedido.find({user: req.user._id}).populate('products.product').sort({createdAt: -1}) //Buscamos los pedidos con el id del usuario logueado, populate para quitarnos el id y sea mas visible y ordenados de manera descendente
        return res.status(200).json(pedidos)
    } catch (error) {
        return res.status(500).json("Error al obtener el historial")
    }
}

module.exports = {
    createPedido,
    getPedidos
}