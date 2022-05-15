const { response } = require("express");
const { request } = require("express");


const esAdminRol = (req = request, res = response, next)=>{
    
    if(!req.usuarioAuth){
        return res.status(500).json({ msg : "Propiedad rol - no existe en req."});
    }
    const {rol , nombre } = req.usuarioAuth;
    if(rol !== 'ROL_ADMIN'){
        return res.status(401).json({msg : `${nombre} no tiene los privilegios de administrador`});
    }
    next();
};

const verificaRoles = ( ...roles )=>{
    return ( req = request, res = response , next) => {
        //console.log(roles, req.usuarioAuth.rol);
        if( !req.usuarioAuth){
            return res.status(500).json({ msg : "Error : No hay usuario."});
        }
        if( !roles.includes(req.usuarioAuth.rol)){ //Si el rol de mi usuario no está dentro
            return res.status(401).json({ msg : "Usuario no autorizado - No dispones de un rol apropiado."});
        }

        next();
    };
};

module.exports = { esAdminRol, verificaRoles }