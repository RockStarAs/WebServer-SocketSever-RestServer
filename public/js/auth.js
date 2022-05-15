console.log(window.location.hostname.includes('localhost'));
const miFormulario = document.querySelector('form');

let url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/api/auth/'
            : 'https://npm-abelprueba.herokuapp.com/api/auth/';

function handleCredentialResponse(response) {
    //GOOGLE TOKEN : ID_TOKEN 
    //console.log('ID Token: ',response.credential);
    const body = {id_token : response.credential};
    fetch(url + 'google',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then( (resp) => { return resp.json(); } )
        .then( ({token}) => { //trayendo el token de la respuesta que me arroja el rest-server 
            
            localStorage.setItem('token',token);
            window.location = 'chat.html';
        })
        .catch( console.warn );
}
const btn = document.getElementById('google_signout').addEventListener('click',()=>{
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke( localStorage.getItem('token'), (done)=>{
        localStorage.clear();
        location.reload();
    });
});
//btn.onClick = () =>{ 
    
   // console.log(google.accounts.id);
    //google.accounts.id.disableAutoSelect();
//};

//?Funcionamiento del login personalizado
miFormulario.addEventListener('submit', (e)=>{
    e.preventDefault();
    const formData = {};
    
    for(let elemento of miFormulario.elements){
        if(elemento.id.length > 0){
            formData[elemento.id] = elemento.value;
        }
    }
    fetch(url + 'login',{
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json'}
    }).then(respuesta => respuesta.json())
    .then(({msg, token})=>{
        if(msg !== 'Login ok'){
            return console.error(msg);
        }
        localStorage.setItem('token',token);
        window.location = 'chat.html';
    }).catch((err)=>{console.log(err);});
});