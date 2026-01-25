const fs = require('fs')
const csv = require('csv-parser')
const path = require('path')

/**
 * Lee un archivo CSV y transforma su contenido en un array de objetos JavaScript.
 * Utiliza Streams para procesar el archivo de forma eficiente, lo que permite manejar 
 * grandes volúmenes de datos sin saturar la memoria.
 * * @param {string} filename - Nombre del archivo CSV (debe estar en la carpeta /src/data).
 * @returns {Promise<Array<Object>>} Una promesa que resuelve con los datos parseados en un array.
 * @throws {Error} Rechaza la promesa si hay un error en la lectura o la ruta del archivo.
 */
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