const { response, request } = require('express');
const { Producto } = require('../models/');


const listarProductos = async(req = request, res = response)=>{
    try{
        //? Desde - Paginacion 
        //?  0   -   (10 x defecto)
        let { desde =  0, pag = 5 } = req.query; //?Para los que traen en la URL
        const query = { estado : true};

        const [productosActivos,totalProductos] = await Promise.all([
            Producto.find(query).populate('usuario','nombre').populate('categoria','nombre').skip(Number(desde)).limit(Number(pag)),
            Producto.countDocuments(query)
        ]);
        res.status(200).json({
            totalProductos,
            productosActivos
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            msg: "Ocurrió un error con el servidor."
        });
    }
};
const listarProducto = async(req = request, res = response)=>{
    try{
        const idProducto = req.params.id;
        const producto = await Producto.findById(idProducto).populate('usuario','nombre').populate('categoria','nombre');
        if(!producto.estado){
            return res.status(401).json({
                msg: "El producto buscado está eliminado."
            });
        }
        return res.status(200).json({
            producto
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            msg: "Ocurrió un error con el servidor."
        });
    }
}
const crearProducto = async(req = request, res = response) =>{
    try{
        const userAuth = req.usuarioAuth;

        const { nombre, precio, categoria} = req.body;

        const productoExiste = await Producto.findOne({nombre});
        if(productoExiste){
            return res.status(400).json({
                msg : "Un producto con el mismo nombre ya existe."
            });
        }
        const data = {
            nombre, 
            precio,
            categoria,
            estado : true,
            usuario : userAuth.id
        }

        const producto = await new Producto(data);
        await producto.save();

        res.status(201).json({
            msg : "El producto se agregó con éxito",
            producto
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            msg : "Ocurrió un error con el servidor."
        }); 
    }
};
const actualizarProducto = async(req = request, res = response) =>{
    try{
        // PRECIO - NOMBRE - DISPONIBLE
        const id = req.params.id;
        const {nombre, precio, disponible = true} = req.body;
        const usuarioAuth = req.usuarioAuth;

        const producto = await Producto.findByIdAndUpdate(id,{nombre,precio,disponible,usuario : usuarioAuth.id}, { new : true});

        res.status(201).json({ producto});

    }catch(err){
        console.log(err);
        res.status(500).json({
            msg : "Ocurrió un error con el servidor."
        });
    }
};
const deleteProducto = async(req = request, res = response) => { 
    try{
        // PRECIO - NOMBRE - DISPONIBLE
        const id = req.params.id;
        const producto = await Producto.findByIdAndUpdate(id,{estado : false}, { new : true});

        res.status(201).json({ producto});

    }catch(err){
        console.log(err);
        res.status(500).json({
            msg : "Ocurrió un error con el servidor."
        });
    }
};
module.exports = {
    crearProducto,
    listarProductos,
    listarProducto,
    actualizarProducto,
    deleteProducto
}