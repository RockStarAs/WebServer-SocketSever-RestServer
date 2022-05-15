

/*{
    nombre: '',
    correo: "rcalderonpe@unprg.edu.pe",
    password: "//"->enctriptado,
    img: "123456",
    rol: "213456",
    estado: true,
    google: true,
}*/
const {Schema,model} = require("mongoose");

const UsuarioSchema = Schema({
    nombre: { type : String, required: [true, 'El nombre es obligatorio']},
    correo: { type : String, required: [true, 'El correo es obligatorio'], unique: true},
    password: { type : String, required: [true, 'La contraseña es obligatoria']},
    img: { type : String},
    rol: { type : String, required: true, enum: ['ROL_ADMIN','ROL_USUARIO']},
    estado: { type : Boolean, default: true },
    google: { type : Boolean, default: false },
});


UsuarioSchema.methods.toJSON = function(){
    const { __v, password , _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}


module.exports = model('Usuario',UsuarioSchema );