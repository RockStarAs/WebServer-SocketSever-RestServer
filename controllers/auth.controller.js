const { response } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { request } = require('express');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req, res = response) =>{

    const { correo, password } = req.body;
    try{
        //TODO: Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if(!usuario){
            return res.status(400).json({ message: 'Usuario / Pwd no es correcto - correo'});
        }
        //TODO: SI el usuario está activo
        if(!usuario.estado){
            return res.status(400).json({ message: 'Usuario eliminado, no se puede loguear. '});
        }
        //TODO: Verificar la contraseña
        const validarPwd = bcryptjs.compareSync(password,usuario.password);
        if( !validarPwd ){
            return res.status(400).json({ message: 'Contraseña incorrecta. '});
        }
        //TODO: Generar el JWT
        const token = await generarJWT( usuario.id);

        res.json({ 
            msg : 'Login ok',
            usuario,
            token
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg: 'Ocurrió un error procesando tu solicitud.'
        });
    }
}

const googleSingIn = async(req = request , res = response) => {
    const {id_token} = req.body;
    try{
        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});
        if(!usuario){
            //? Tengo que crear el usuario, si es que no existe
            const data = {
                nombre,
                correo,
                rol : 'ROL_USUARIO',
                password:'_default',
                img,
                google:true
            };
            usuario = new Usuario(data);
            await usuario.save();
        }
        //? Preguntar si el usuario en DB - 
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el admin del sistema, porque su estado está bloqueado'
            });
        }
        // Generar su JWT
        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        });
        //console.log(googleUser);
        /*res.json({
            msg : "Todo Bien! Google - signin",
            googleUser
        });*/
    }catch(error){
        return res.status(500).json({
            msg: 'Error con el servidor, posiblemente id_token',
            error
        });
    }
}

const validarToken = async(req,res = response)=>{
    let usuarioAuth = req.usuarioAuth;
    //? Generando un nuevo JWT
    const token = await generarJWT(usuarioAuth.id)
    res.json({
        usuarioAuth,
        token
    });
};

module.exports = {
    login,
    googleSingIn,
    validarToken
}