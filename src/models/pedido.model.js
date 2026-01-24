const mongoose = require("mongoose")

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