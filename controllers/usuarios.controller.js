const { response,request } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

/*const usuariosGet = (req, res) => {
    //Porbar en postman http://localhost:8080/api/usuarios?nombre=Abel&access=true
    const body = req.body;
    const usuario = new Usuario(body); //Enviando al modelo

    //usuario.save();
    res.json({
        "ok" : true,
        "msje" : "Hola Abel separado",
        usuario
    });
}*/
const usuariosGet = async(req,res) =>{

    const {limite = 5 , desde = 0} = req.query;
    //Inicio cod, bloqueante
    /*const usuarios = await Usuario.find({ estado : true }) //Buscando usuarios con estado igual a true
        .skip(Number(desde))
        .limit(Number(limite))
    ;*/

    //const total = await Usuario.countDocuments({ estado : true });
    //Fin cod bloqueante, significa que ambos van por separado no se ejecutan al mismo tiempo por lo tanto el tiempo total de espera es la suma de ambos.
    //Para contrarrestar esto usaremos
    const [ total,usuarios ] = await Promise.all([
        Usuario.countDocuments({ estado : true }),
        Usuario.find({ estado : true })
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async(req, res) => {
    const id = req.params.id;
    const { _id,password, google,correo, ...resto } = req.body; //Nunca procesar el _id
    //Validad ID en bd (Middleware)
    if(password){
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync( password,salt );
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);


    res.json({
        "ok" : true,
        "msje" : "Actualizado con éxito.",
        id
    });
}

const usuariosPost = async (req, res) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({
        nombre,
        correo,
        password,
        rol 
    });
    
    //encriptar la contraseña - con bcryptjs
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password,salt );
    
    //guardar en DB

    await usuario.save();

    res.json({
        "ok" : true,
        "msje" : "post Abel controlador ",
        usuario,
    });
}

const usuariosDelete = async(req, res) => {
    const { id } = req.params;
    const uid = req.uid;
    //Borando físicamente
    //const usuario = await Usuario.findByIdAndDelete(id);
    const usuario = await Usuario.findByIdAndUpdate(id,{estado : false});
    //TODO: OBTENER EL USUARIO AUTENTICA
    const usuarioAuth = req.usuarioAuth;
    //console.log(uid);
    res.json({
        "ok" : true,
        "msje" : "delete Abel - controlador ",
        "msje_2" : "Usuario eliminado",
        usuario, //TODO IMPRIMIR USUARIO AITENTICADO
        usuarioAuth, //TODO IMP
    });
}

const usuariosPath = (req, res) => {
    res.json({
        "ok" : true,
        "msje" : "patch Abel - controlador",
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPath
}