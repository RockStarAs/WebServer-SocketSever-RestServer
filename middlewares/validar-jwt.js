const { request } = require('express');
const { response } = require('express');
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request,res = response, next) =>{

    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }
    try{
        const payload = jwt.verify(token,process.env.SECRET_OR_PUBLIC_KEY);
        const { uid } = payload;
        //console.log(payload);
        //TODO : LEER MODELO PARA EL USUARIO QUE CORRESPONDE PARA EL UID
        const usuarioAuth = await Usuario.findById(uid);
        if(!usuarioAuth){
            res.status(401).json({ msg : 'Token no válido - Usuario no existe en la db.'});
        }

        //? VERIFICAR SI EL USUARIO NO ESTA ELIMINADO 
        if(!usuarioAuth.estado) {
            res.status(401).json({ msg : 'Token no válido - El usuario está inhabilitado.'});    
        }
        //req.uid = uid;
        req.usuarioAuth = usuarioAuth;
        next();
    }catch(err){
        //console.log(err);
        res.status(401).json({ msg : 'Token no válido.'});
    }
    //console.log(token);
    
};


module.exports = {
    validarJWT
}