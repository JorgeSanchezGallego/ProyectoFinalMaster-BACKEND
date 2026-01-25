const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Producto = require('../models/product.model')
const {leerCSV} = require('../utils/csvReader')
dotenv.config()

/**
 * Script de automatización para la carga inicial de productos (Seeding).
 * * Este proceso realiza las siguientes acciones:
 * 1. Conecta con la base de datos MongoDB.
 * 2. Elimina todos los productos existentes (Limpieza total).
 * 3. Lee los datos desde un archivo CSV externo.
 * 4. Formatea los precios a tipo numérico (float).
 * 5. Inserta los nuevos productos de forma masiva.
 * 6. Cierra la conexión de forma segura.
 * * @async
 * @function seedProducts
 * @returns {Promise<void>}
 */
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