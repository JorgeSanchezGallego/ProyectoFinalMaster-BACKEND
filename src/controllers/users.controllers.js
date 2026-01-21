const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const {generateToken} = require('../utils/token')
const {deleteImgCloudinary} = require('../utils/cloudinary.utils')

const registerUser = async (req, res) => {
    try {
        const user = new User(req.body)
        const userExist = await User.findOne({email: user.email})
        if (userExist) {
            if (req.file) {
                deleteImgCloudinary(req.file.path)
            }
            return res.status(400).json("El usuario ya existe")
        }
        if (req.file) {
            user.img = req.file.path
        }
        const userDB = await user.save()
        userDB.password = null
        res.status(201).json(userDB)
    } catch (error) {
        if (req.file) {
                deleteImgCloudinary(req.file.path)
            }
        res.status(400).json({error: "Error al registrar al usuario", detalle: error.message})
    }
}

const loginUser = async (req,res) => {
    try {
        const { email, password} = req.body
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json("Contraseña o usuario incorrecto")
        }
        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword) {
            return res.status(400).json("Contraseña o usuario incorrecto")
        }
        const token = generateToken(user.id, user.email)
        user.password = null
        return res.status(200).json({token, user})
    } catch (error) {
        return res.status(400).json("Error al login")
    }
}

