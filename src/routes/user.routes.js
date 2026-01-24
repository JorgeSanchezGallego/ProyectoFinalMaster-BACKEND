const express = require('express')
const { registerUser, loginUser} = require('../controllers/users.controllers')
const {subidaUsuarios} = require('../middlewares/file')

const router = express.Router()

router.post('/register', subidaUsuarios.single('img'), registerUser)
router.post('/login', loginUser)

module.exports = router