const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const cors = require('cors')
const { connectDB } = require('./src/config/db')
const PORT = process.env.PORT || 3000
const usersRoutes = require('./src/routes/user.routes')
const productsRoutes = require('./src/routes/products.routes')
const pedidosRoutes = require('./src/routes/pedidos.routes')
const { connectCloudinary } = require('./src/config/cloudinary')

/**
 * Servidor Principal de la API de Hostelería.
 * Configuración central del servidor Express, conexiones a bases de datos y servicios en la nube.
 */

// Middlewares de configuración global
app.use(express.json()) // Permite recibir cuerpos de mensaje en formato JSON
app.use(cors()) // Habilita el intercambio de recursos de origen cruzado (necesario para el Frontend)

// Inicialización de conexiones externas
connectDB() // Conexión a MongoDB
connectCloudinary() // Configuración de la API de Cloudinary


/**
 * Definición de Rutas de la API
 * Se establece el prefijo '/api' seguido del recurso correspondiente.
 */
app.use("/api/users", usersRoutes) // Endpoints de autenticación y registro
app.use("/api/products", productsRoutes) // Endpoints de catálogo y gestión de productos
app.use("/api/pedidos", pedidosRoutes) // Endpoints de transacciones y pedidos

/**
 * Middleware de manejo de rutas no encontradas (404).
 * Se ejecuta si la petición no coincide con ninguna de las rutas anteriores.
 */
app.use((req, res, next) => {
    return res.status(404).json("Route not found")
})

/**
 * Arranque del servidor.
 * Escucha peticiones en el puerto definido en .env o por defecto en el 3000.
 */
app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    
})