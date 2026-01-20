const mongoose = require("mongoose")

const productoSchema = new mongoose.Schema(
    {
        nombre: {type: String, required: true, trim:true},
        distribuidor: {
            type: String,
            required: true,
            enum: ["Makro", "Comcarcia", "Coca cola", "Fruteria Pepe"],
            trim: true
        },
        img: {
            type: String,
            required: true,
            default: "https://cdn-icons-png.flaticon.com/512/2927/2927347.png" 
        },
        precio: {type: Number, required: true, min: 0},
        categoria: {
            type: String,
            required: true,
            enum: ["Bebidas", "Comida", "Limpieza"],
            trim: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Producto = mongoose.model("Producto", productoSchema)
module.exports = Producto