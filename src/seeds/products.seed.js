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
const seedProducts = async () => { //Función asincrona
    try {
        await mongoose.connect(process.env.DB_URL) //Hasta que no conecte con la DB no continua
        console.log("Conectado a la BBDD"); //Mensaje de éxito
        await Producto.deleteMany({}) //Hasta que no borre la DB de productos no continua
        console.log("Productos borrados"); //Mensaje de éxito
        const productosData = await leerCSV("Productos.csv") //Declaramos nuestros productos y llamamos a nuestra funcion leerCSV que necesita un CSV
        const productosFormateados = productosData.map(p => ({ //Mapeamos cada producto ya que el precio viene como string, y lo necesitamos como number para poder hacer calculos
            ...p, //Nos quedamos con todo el producto
            precio: parseFloat(p.precio) //Pero en precio, parseamos
        }))
        await Producto.insertMany(productosFormateados) //Guardamos todos los productos nuevos
        console.log(`Cantidad de productos insertados: ${productosFormateados.length}`); //Mensaje de éxito 
    } catch (error) {
        console.error('Error', error);
    } finally {
        mongoose.disconnect() //Nos desconectamos de mongoose
    }
}

seedProducts() //Llamamos a la función