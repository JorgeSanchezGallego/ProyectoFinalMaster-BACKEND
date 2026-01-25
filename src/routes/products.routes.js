const express = require('express')
const {
    getProducts,
    createProduct,
    updateProduct, 
    deleteProduct,
    searchProductByName,
    searchProductsByCategory
} = require('../controllers/products.controllers')
const { isAuth, isSupplier } = require('../middlewares/auth.middleware')
const { subidaProductos} = require('../middlewares/file')

/**
 * Enrutador de Productos.
 * Gestiona el catálogo de artículos, permitiendo la lectura a usuarios autenticados
 * y la modificación (CRUD) solo a usuarios con rol 'comercial'.
 * @module routes/products
 */
const router = express.Router()

/**
 * Obtener todos los productos.
 * @name get/
 * @route {GET} /
 * @authentication Requiere isAuth.
 */
router.get('/', [isAuth], getProducts)
/**
 * Buscar productos por nombre.
 * @name get/name/:nombre
 * @route {GET} /name/:nombre
 * @param {string} nombre - Parte del nombre del producto a buscar.
 * @authentication Requiere isAuth.
 */
router.get('/name/:nombre', [isAuth], searchProductByName)
/**
 * Filtrar productos por categoría.
 * @name get/category/:categoria
 * @route {GET} /category/:categoria
 * @param {string} categoria - Nombre de la categoría (Bebidas, Comida, Limpieza).
 * @authentication Requiere isAuth.
 */
router.get('/category/:categoria', [isAuth], searchProductsByCategory)


/**
 * Crear un nuevo producto.
 * @name post/
 * @route {POST} /
 * @authentication Requiere isAuth e isSupplier.
 * @bodyparam {File} img - Imagen del producto (campo 'img').
 */
router.post('/', [isAuth, isSupplier, subidaProductos.single('img')], createProduct)
/**
 * Actualizar un producto existente por su ID.
 * @name patch/:id
 * @route {PATCH} /:id
 * @param {string} id - ID de MongoDB del producto.
 * @authentication Requiere isAuth e isSupplier.
 */
router.patch('/:id', [isAuth, isSupplier, subidaProductos.single('img')], updateProduct)
/**
 * Eliminar un producto por su ID.
 * @name delete/:id
 * @route {DELETE} /:id
 * @param {string} id - ID de MongoDB del producto.
 * @authentication Requiere isAuth e isSupplier.
 */
router.delete('/:id', [isAuth, isSupplier], deleteProduct)

module.exports = router