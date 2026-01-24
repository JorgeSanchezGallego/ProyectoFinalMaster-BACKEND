const express = require('express')
const {createPedido, getPedidos} = require('../controllers/pedidos.controllers')
const {isAuth, isManager} = require('../middlewares/auth.middleware')

const router = express.Router()

router.post('/pedido', [isAuth, isManager], createPedido)
router.get('/historial', [isAuth, isManager], getPedidos)

module.exports = router