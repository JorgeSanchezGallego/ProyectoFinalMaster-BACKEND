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
    return new Promise((resolve, reject) => { //Envolvemos en una promesa
        const resultados = [] //Array vacio para guardar la informacion
        const ruta = path.join(__dirname, '../data', filename) //Creamos la ruta absoluta del archivo
        fs.createReadStream(ruta) //Node va leyendo el archivo poco a poco
            .pipe(csv()) //Transforma el texto bruto en objetos
            .on('data', (data) => resultados.push(data)) //Cuando el parser termina de leer una linea, nos devuelve data que pusheamos a resultados
            .on('end', () => resolve(resultados)) //Cuando el evento ha terminado, entregamos el array lleno
            .on('error', (error) => reject(error)) //Cualquier error
    })
}

module.exports = { leerCSV }