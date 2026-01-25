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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Producto',
                    required: true
                }
                ,
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ],
        total: {
            type: Number,
            required: true,
            default: 0
        },
        status: {
            type: String,
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
pedidoSchema.pre('save', function () {
    if (!this.products || this.products.length === 0) {
        this.total = 0
        return 
    }
    this.total = this.products.reduce((acc, item) => {
        return acc + (item.price * item.quantity)
    }, 0)
    this.total = Math.round(this.total * 100) / 100;
    
})

const Pedido = mongoose.model('Pedido', pedidoSchema)
module.exports = Pedido