const mongoose = require("mongoose")
const bcrypt = require("bcrypt")


/**
 * Esquema de Mongoose para la colección de Usuarios.
 * Define el perfil de los usuarios del sistema, sus credenciales y niveles de acceso (roles).
 * * @typedef {Object} User
 * @property {string} nombre - Nombre completo del usuario.
 * @property {string} email - Correo electrónico único (utilizado para el login).
 * @property {string} password - Contraseña encriptada del usuario.
 * @property {string} role - Nivel de permiso: 'encargado', 'trabajador' o 'comercial'.
 * @property {string} [img] - URL de la imagen de perfil (opcional).
 */
const userSchema = new mongoose.Schema(
    {
        nombre: {type: String, required: true, trim: true},
        email: {type: String, required: true, trim: true, unique: true},
        password: {
            type: String,
            trim: true,
            required: true,
            minlength: [8, "La contraseña debe tener al menos8 caracteres"]
        },
        role: {
            type: String,
            enum: ["encargado", "trabajador", "comercial"],
            default: "trabajador"
        },
        img : {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

/**
 * Middleware 'pre-save'.
 * Se ejecuta antes de guardar el documento en la base de datos.
 * Si la contraseña ha sido modificada o es nueva, la encripta utilizando bcrypt
 * con un factor de coste de 10.
 * * @async
 * @returns {Promise<void>}
 */
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return
    }
    try {
        this.password = await bcrypt.hash(this.password, 10)
    } catch (error) {
        console.log(error);
        
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User;