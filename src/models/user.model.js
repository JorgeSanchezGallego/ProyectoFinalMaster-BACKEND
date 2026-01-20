const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

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