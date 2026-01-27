const express = require('express')
const {createPedido, getPedidos} = require('../controllers/pedidos.controllers')
const {isAuth, isManager} = require('../middlewares/auth.middleware')

/**
 * Enrutador de Pedidos.
 * Define las rutas para la gestión de compras y consulta de historial.
 * Todas las rutas de este enrutador requieren autenticación previa.
 * @module routes/pedidos
 */
const router = express.Router() //Nos traemos el enrutador

/**
 * Ruta para realizar un nuevo pedido.
 * Requiere un token válido y rol de 'encargado'.
 * @name post/pedido
 * @route {POST} /pedido
 * @authentication Requiere isAuth e isManager.
 */
router.post('/pedido', [isAuth, isManager], createPedido) //Endpoint para realizar un pedido, solo accesible para el manager a traves de middlewares
/**
 * Ruta para obtener el historial de pedidos del usuario.
 * Requiere un token válido y rol de 'encargado'.
 * @name get/historial
 * @route {GET} /historial
 * @authentication Requiere isAuth e isManager.
 */
router.get('/historial', [isAuth, isManager], getPedidos) //Endpoint para visualizar el historial de pedidos, solo accesible para el manager a traves de middlewares

module.exports = router