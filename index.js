const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const cors = require('cors')
const { connectDB } = require('./src/config/db')
const PORT = process.env.PORT || 3000




app.use(express.json())
app.use(cors())


connectDB()


app.use('*', (req, res) => {
    return res.status(404).json("Route not found")
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    
})