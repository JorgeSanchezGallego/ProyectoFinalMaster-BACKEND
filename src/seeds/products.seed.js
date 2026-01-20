const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Producto = require('../models/product.model')
const {leerCSV} = require('../utils/csvReader')
dotenv.config()

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Conectado a la BBDD");
        await Producto.deleteMany({})
        console.log("Productos borrados");
        const productosData = await leerCSV("Productos.csv")
        const productosFormateados = productosData.map(p => ({
            ...p,
            precio: parseFloat(p.precio)
        }))
        await Producto.insertMany(productosFormateados)
        console.log(`Cantidad de productos insertados: ${productosFormateados.length}`);
    } catch (error) {
        console.error('Error', error);
    } finally {
        mongoose.disconnect()
    }
}

seedProducts()