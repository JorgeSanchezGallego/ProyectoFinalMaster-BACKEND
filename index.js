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



app.use(express.json())
app.use(cors())


connectDB()
connectCloudinary()

app.use("/api/users", usersRoutes)
app.use("/api/products", productsRoutes)
app.use("/api/pedidos", pedidosRoutes)


app.use((req, res, next) => {
    return res.status(404).json("Route not found")
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    
})