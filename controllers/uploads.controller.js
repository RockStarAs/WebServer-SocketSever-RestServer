const  path  = require('path');
const  fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");

const { Usuario,Producto } = require("../models/");

const cargarArchivo = async (req, res = response) => {
    let uploadPath;

    if (!req.files.archivo) {
        res.status(400).json({ msg: 'No hay archivos en la petición.' });
        return;
    }
    try {
        //? Para enviar a la fuerza un parametro, pero queriendo mantener los valores por defecto, se envia undefined
        const nombreArchivo = await subirArchivo(req.files, undefined, 'imgs');
        // const nombreArchivo = await subirArchivo(req.files,['txt','md','pdf'],'textos');
        res.json({ nombreArchivo });
    } catch (err) {
        res.status(400).json({ msg: err });
    }

};

const actualizaImgColeccion = async(req, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(404).json({ msg : `No existe un usuario con el id ${id}`});
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(404).json({ msg : `No existe un producto con el id ${id}`});
            }
        break;
        default:
            return res.status(500).json({msg : `Colección no contemplada`});
        break;
    }
    try{
        //?Limpiar imagenes previas
        if( modelo.img ){
            //? Si existe borrar la imagen del servidor
            const pathImagen = path.join(__dirname,'../uploads', coleccion , modelo.img);
            if( fs.existsSync(pathImagen) ){
                fs.unlinkSync(pathImagen);
            }
        }

        const nombre = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = nombre;
        await modelo.save();
        res.json({ msg : `Se ha guardado la imagen` });
    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: `Ocurrió un error en el servidor` });
    } 
};

const mostrarImg = async(req,res = response) =>{
    const { id, coleccion } = req.params;
    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(404).json({ msg : `No existe un usuario con el id ${id}`});
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(404).json({ msg : `No existe un producto con el id ${id}`});
            }
        break;
        default:
            return res.status(500).json({msg : `Colección no contemplada`});
        break;
    }
    try{
        const pathImagen = path.join(__dirname);
        //?Limpiar imagenes previas
        if( modelo.img ){
            //? Si existe borrar la imagen del servidor
            let pathBd = path.join(pathImagen,'../uploads', coleccion , modelo.img);
            if( fs.existsSync(pathBd) ){
                res.sendFile(pathBd); return;
            }
        }
        let pathBd = path.join(pathImagen,'../assets','no-image.jpg');
        res.sendFile(pathBd);
    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: `Ocurrió un error en el servidor` });
    } 
}

const actualizaImgColeccionCloudinary = async(req, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;

    switch(coleccion){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(404).json({ msg : `No existe un usuario con el id ${id}`});
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(404).json({ msg : `No existe un producto con el id ${id}`});
            }
        break;
        default:
            return res.status(500).json({msg : `Colección no contemplada`});
        break;
    }
    try{
        //?Limpiar imagenes previas
        if( modelo.img ){
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [public_id , extension] = nombre.split('.');
            
            //*Acá podemos borrar el await, porque no ocupamos esperar a que se borre, con dejarlo como proceso aparte basta.
            cloudinary.uploader.destroy(public_id);
        }
        const { tempFilePath } = req.files.archivo;
        const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
        
        //const nombre = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = secure_url;
        await modelo.save();
        res.json({ secure_url });
    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: `Ocurrió un error en el servidor` });
    } 
};
module.exports = {
    cargarArchivo,
    actualizaImgColeccion,
    mostrarImg,
    actualizaImgColeccionCloudinary
};