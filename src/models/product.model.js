const mongoose = require("mongoose")

/**
 * Esquema de Mongoose para la colección de Productos.
 * Define la estructura y validaciones para los artículos del inventario de hostelería.
 * * @typedef {Object} Producto
 * @property {string} nombre - Nombre del producto (ej: "Coca Cola", "Tomates").
 * @property {string} distribuidor - Proveedor del artículo. Solo permite: "Makro", "Comcarcia", "Coca cola", "Fruteria Pepe".
 * @property {string} img - URL de la imagen del producto. Por defecto utiliza un icono genérico.
 * @property {number} precio - Coste unitario del producto (Valor mínimo: 0).
 * @property {string} categoria - Clasificación del producto. Solo permite: "Bebidas", "Comida", "Limpieza".
 */
const productoSchema = new mongoose.Schema(
    {
        nombre: {type: String, required: true, trim:true}, //Trim quita espacios delante y detras, required lo hace obligatorio
        distribuidor: {
            type: String,
            required: true,
            enum: ["Makro", "Comcarcia", "Coca cola", "Fruteria Pepe"], //Solo puede ser uno de estos
            trim: true
        },
        img: {
            type: String,
            required: true, //Imagen del producto requerida
            default: "https://cdn-icons-png.flaticon.com/512/2927/2927347.png" //Si pasa algo al subir la imagen y se rompe, imagen default
        },
        precio: {type: Number, required: true, min: 0}, //Vigilamos que sea obligatorio y que no pueda ser negativo
        categoria: {
            type: String,
            required: true,
            enum: ["Bebidas", "Comida", "Limpieza"], //Solo estas categorias disponibles
            trim: true
        }
    },
    {
        timestamps: true, //Crea campos createdAt y updatedAt
        versionKey: false //Elimina el campo __v interno de mongo
    }
)


const Producto = mongoose.model("Producto", productoSchema)
module.exports = Producto