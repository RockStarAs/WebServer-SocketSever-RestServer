const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generar-jwt");
const { ChatMensajes } = require("../models");
//*Lo que está en parametros de new Socket no se debe hacer, esto puede ser considerado unos errores
const chatMensajes = new ChatMensajes(); //? Con declararlo acá solo una vez a nivel de servidor se ejecutará
const socketController = async(socket = new Socket(),io)=>{
    //console.log('Cliente conectado',socket);
    //?Si alguien llega a este pundo del backend se supone que ya está conectado, pero acá debemos validar si alguien ya está conectado
    //?Extrayendo el x-token
    //console.log(socket.handshake.headers['x-token']);
    const token = socket.handshake.headers['x-token'];
    let usuario = await comprobarJWT(token);
    if(!usuario){
        return socket.disconnect(); //? Lo desconectamos porque no nos interesa mantener la conexión
    }
    //? Agregar al usuario conectado
    chatMensajes.conectarUsuario(usuario);
    //? cuando alguien se conecta e instancié y llegue hasta acá, haremos que le diga a todo el mundo !! Me conecté xd
    io.emit('usuarios-activos',chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes',chatMensajes.ultimos10);

    //?Conectar a nuestro socket a una sala especial, la idea de esto es no manejar los mismo socket.id para todos porqué esto es muy vólatil, una recarga y el id cambia, por lo tanto el metodo socket.to(socket.idllegada) no nos servirá, lo que haremos mejor será unir al socket a una sala especial con su uid, para que así sea más fácil que reciba sus mensajes
    socket.join(  usuario.id ); //Sala global por socket id y ahora su sala por usuario.id
    //console.log('Se conectó', usuario.nombre);

    //?Limpiar cuando alguien se desconecta
    socket.on('disconnect', ()=>{
        chatMensajes.desconectarUsuarios(usuario.id);
        io.emit('usuarios-activos',chatMensajes.usuariosArr);
    });
    //? Escuchando la llegada de mensajes
    socket.on('enviar-mensaje',({uid,mensaje})=>{
        if(uid){
            //*Si el uid existe, enviar un mensaje privado.
            socket.to(uid).emit('mensaje-privado',{de: usuario.nombre, mensaje});
        }else{
            //* Si el uid no llega, enviar a todos
            chatMensajes.enviarMensaje(usuario.id,usuario.nombre,mensaje);
            //?Retornar el arreglo de mensajes
            io.emit('recibir-mensajes',chatMensajes.ultimos10);
        }
        
    });

}

module.exports = {
    socketController
}