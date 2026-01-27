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
        nombre: {type: String, required: true, trim: true}, //Nombre requerido y sin espacios delante ni detras
        email: {type: String, required: true, trim: true, unique: true}, //Hacemos email unique para poder hacer comprobaciones de usuarios existentes
        password: {
            type: String,
            trim: true,
            required: true,
            minlength: [8, "La contraseña debe tener al menos 8 caracteres"] //Requerimiento minimo para la contraseña
        },
        role: {
            type: String,
            enum: ["encargado", "trabajador", "comercial"], //Solo estos roles disponibles
            default: "trabajador"
        },
        img : {
            type: String //No obligotaria
        }
    },
    {
        timestamps: true, //Crea campos createdAt y updatedAt
        versionKey: false //Elimina el campo __v interno de mongo
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
userSchema.pre("save", async function () { //Se ejecuta antes de guardar, usamos function por que necesitamos acceder a this.
    if (!this.isModified("password")) { //Si la contraseña no ha sido modificada, salimos 
        return
    }
    try {
        this.password = await bcrypt.hash(this.password, 10) //Si la contraseña es nueva, la encriptamos
    } catch (error) {
        console.log(error);
        
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User;