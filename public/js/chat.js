//*Validar si el JWT es correcto antes de acceder al socket
let usuario = null;
let socket = null;

//? REFERENCIAS HTML
const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');



let url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/api/auth/'
            : 'https://npm-abelprueba.herokuapp.com/api/auth/';
//? Validar el JWT del local storage
const validarJWT = async()=>{
    const token = localStorage.getItem('token') || '';
    if(token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token el servidor');
    }
    //?Llamando al end-point ruta/auth/
    const respuesta = await fetch(url,{
        headers : { 'x-token': token}
    });
    const {usuarioAuth : userDB, token : tokenDB} = await respuesta.json();
    console.log(userDB,{tokenDB});
    localStorage.setItem('token',tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;
    
    await conectarSocket();
}
const conectarSocket = async ()=>{
    socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token')
        }
    }); //Conexión con el backend server

    socket.on('connect',()=>{
        console.log('Sockets Online');
    });
    socket.on('disconnect',()=>{
        console.log('Sockets Offline');
    });

    socket.on('recibir-mensajes',listarMensajes);

    socket.on('usuarios-activos',(payload)=>{
        listarUsuariosConectados(payload);
    });

    socket.on('mensaje-privado',(payload)=>{
        console.log(payload);
        //TODO:
    });
}

const listarUsuariosConectados = (usuarios = []) =>{
    let usersHtml = '';
    usuarios.forEach( ({nombre, uid})=>{
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${nombre} </h5>
                    <span class="fs-6 text-muted">${ uid }</span>    
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;
}

const listarMensajes = (mensajes = []) =>{
    let mensajesHTML = '';
    mensajes.forEach( ({mensaje,nombre})=>{
        mensajesHTML += `
            <li>
                <p>
                    <h5 class="text-primary"> ${nombre} </h5>
                    <span>${ mensaje }</span>    
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHTML;
}

const main = async()=>{
    //?validar JWT
    await validarJWT();


};

main();

btnSalir.addEventListener('click',()=>{
    localStorage.removeItem('token');
    window.location = 'index.html';
});

txtMsg.addEventListener('keyup',({keyCode})=>{
    const mensaje = txtMsg.value;
    const uid = txtUid.value;
    if(keyCode!==13){return;} //? Si la tecla no es ENTER no enviaremos nada
    if(mensaje.length === 0){return;} //? No podrá enviar un mensaje vacío
    socket.emit('enviar-mensaje',{mensaje , uid});
    txtMsg.value = '';
});


