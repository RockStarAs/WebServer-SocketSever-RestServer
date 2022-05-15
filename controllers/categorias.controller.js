const { response } = require('express');
const { Categoria } = require('../models/')


const obtenerCategorias = async(req, res) => {
    try{
        //? Desde - Paginacion 
        //?  0   -   (10 x defecto)
        let { desde =  0, pag = 5 } = req.query; //?Para los que traen en la URL
        const query = { estado : true};
        /*let totalCat = await Categoria.countDocuments();
        let categorias = await Categoria.find({estado : true}).populate('usuario').skip(Number(desde)).limit(Number(pag));*/
        
        const [totalCat, categorias] =  await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find({estado : true}).populate('usuario','nombre').skip(Number(desde)).limit(Number(pag))
        ]);

        res.status(200).json({
            totalCat,
            categorias
        });


    }catch(error){
        console.log(error);
        res.status(500).json({
            msg : 'Ha ocurrido un error con el servidor'
        });
    }
}

const actualizarCategoria = async(req, res) => {
    try{
        const usuarioAuth = req.usuarioAuth;
        const id = req.params.id;

        const { nombre } = req.body;

        const categoria = await Categoria.findByIdAndUpdate(id,{nombre, usuario : usuarioAuth.id }, { new : true });
        //const catAct = await Categoria.findById(id);
        res.status(201).json({
            msg : 'Actualizado con éxito',
            categoria,
            //catAct
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            msg : 'Ha ocurrido un error con el servidor'
        });
    }
};

const obtenerCategoria = async(req, res) => {
    try{
        const {id} = req.params.id;

        const categoria = await Categoria.findOne(id).populate('usuario');

        res.status(201).json({
            categoria
        });
    }catch(error){
        res.status(500).json({
            msg : 'Ha ocurrido un error con el servidor'
        });
    }
};


const crearCategoria = async(req, res = response ) => {
    try{
        const nombre = req.body.nombre.toUpperCase();

        const categoriaDb = await Categoria.findOne({ nombre });
    
        if(categoriaDb){
            return res.status(400).json({ msg: `La categoria ${categoriaDb.nombre} ya existe.`});
        }
        //* Generar la data a guardar
        const data = { nombre, usuario : req.usuarioAuth.id, estado : true };
        const categoria = await new Categoria(data);
    
        await categoria.save();
        res.status(201).json({ msg : `La categoría ${categoria.nombre} se ha grabado correctamente.`});
    }catch(error){
        console.log(error);
        res.status(500).json({ msg : "Ocurrió un error en el servidor. "});
    }
    
};

const eliminarCategoria = async(req,res = response ) =>{
    try{
        const id = req.params.id; 
        
        const categoria = await Categoria.findByIdAndUpdate(id,{estado : false});

        res.status(201).json({ categoria });
    }catch(err){
        console.log(err);
        res.status(500).json({ msg : "Ocurrió un error en el servidor. "});
    }
};

module.exports = { eliminarCategoria, crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria };