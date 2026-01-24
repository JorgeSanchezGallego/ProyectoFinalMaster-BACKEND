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

const router = express.Router()

router.get('/', [isAuth], getProducts)
router.get('/name', [isAuth], searchProductByName)
router.get('/category', [isAuth], searchProductsByCategory)

router.post('/', [isAuth, isSupplier, subidaProductos.single('img')], createProduct)
router.patch('/:id', [isAuth, isSupplier, subidaProductos.single('img')], updateProduct)
router.delete('/:id', [isAuth, isSupplier], deleteProduct)

module.exports = router