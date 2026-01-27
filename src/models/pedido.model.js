const mongoose = require("mongoose")


/**
 * Esquema de Mongoose para la colección de Pedidos.
 * Gestiona la compra de productos por parte de los usuarios, manteniendo un registro
 * del precio histórico en el momento de la compra y calculando el total automáticamente.
 * * @typedef {Object} Pedido
 * @property {mongoose.Types.ObjectId} user - Referencia al usuario que realiza el pedido (Colección User).
 * @property {Array<Object>} products - Lista de productos incluidos.
 * @property {mongoose.Types.ObjectId} products.product - Referencia al producto (Colección Producto).
 * @property {number} products.quantity - Cantidad de unidades (Mínimo 1).
 * @property {number} products.price - Precio unitario capturado al momento del pedido.
 * @property {number} total - Suma total del pedido, calculada automáticamente.
 * @property {string} status - Estado actual (pendiente, entregado, cancelado).
 */
const pedidoSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, //Guardamos un id de usuario relacionado
            ref: 'User',
            required: true
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId, //Guardamos un producto que apunta al id del producto
                    ref: 'Producto',
                    required: true
                }
                ,
                quantity: {
                    type: Number, //Guardamos la cantidad de ese producto para luego realizar calculos de precio total
                    required: true,
                    min: 1
                },
                price: {
                    type: Number, //Pedimos precio, aunque luego el precio lo actualizaremos al precio de la DB
                    required: true,
                    min: 0
                }
            }
        ],
        total: {
            type: Number, //Precio total
            required: true,
            default: 0
        },
        status: {
            type: String, //Estado del pedido
            enum: ['pendiente', 'entregado', 'cancelado'],
            default: 'pendiente'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

/**
 * Middleware 'pre-save'.
 * Calcula automáticamente el total del pedido sumando el (precio * cantidad) de cada producto.
 * Redondea el resultado a dos decimales para evitar errores de precisión de punto flotante.
 */
pedidoSchema.pre('save', function () { //Se ejecuta antes del guardado en la DB
    if (!this.products || this.products.length === 0) { //Si el pedido esta vacio, no hace nada
        this.total = 0
        return 
    }
    this.total = this.products.reduce((acc, item) => { // Usamos reduce para calcular el total que será, el acc + (precio del producto * la cantidad)
        return acc + (item.price * item.quantity)
    }, 0)
    this.total = Math.round(this.total * 100) / 100; //Redondeamos el precio total 
    
})

const Pedido = mongoose.model('Pedido', pedidoSchema)
module.exports = Pedido