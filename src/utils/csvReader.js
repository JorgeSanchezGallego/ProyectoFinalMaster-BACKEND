const fs = require('fs')
const csv = require('csv-parser')
const path = require('path')

const leerCSV = (filename) => {
    return new Promise((resolve, reject) => {
        const resultados = []
        const ruta = path.join(__dirname, '../data', filename)
        fs.createReadStream(ruta)
            .pipe(csv())
            .on('data', (data) => resultados.push(data))
            .on('end', () => resolve(resultados))
            .on('error', (error) => reject(error))
    })
}

module.exports = { leerCSV }