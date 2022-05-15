
const { Router } = require('express');
const { check } = require('express-validator');


const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categorias.controller');
const { existeCategoriaByID } = require('../helpers/db_validators');
const { validarJWT,validarCampos} = require('../middlewares/');

const router = Router();


/**
 * {{url}}api/categorias
 */
//? Crear mmiddleware para obtener id
//TODO OBTENER TODAS LAS CATEGORIAS
//? Obtener categorias - paginado - mostrar el total - populate (Siver en este caso como para mostrar al usuario asociado)
//? obtenerCategorias
router.get('/',obtenerCategorias);

//TODO OBTENER UNA CATEGORIA EN PARTICULAR
//? Parecido al anterior, pero con el ID se mostrará solo 1, igual mostrar con populate a su usaurios asociado
//? obtenerCategoria
router.get('/:id',[
    check('id','Su id no es válido.').isMongoId(),
    check('id').custom(existeCategoriaByID),
    validarCampos
],obtenerCategoria);

//TODO CREAR UNA NUEVA CATEGORIA, cualquier persona con un token válido (Método PRIVADO - SOLO USUARIO CON TOKEN)
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').notEmpty(),
    validarCampos,    
],crearCategoria);

//TODO ACTUALIZAR UN REGISTRO POR SU ID
//? Actualizar categoria solo recibir el nombre
router.put('/:id',[
    validarJWT, //* PARA LA PERSONA QUE HACE EL PUT, SE CAMBIARÁ EL USUARIO 
    check('id','El id ingresado en el parámetro no es válido').isMongoId(),
    check('id').custom(existeCategoriaByID),
    check('nombre','El nombre es obligatorio').notEmpty(),
    validarCampos
],actualizarCategoria);

//TODO BORRAR UNA CATEGORIA - SOLO SI ES UN ADMIN
//? solo recibir nombre y borrar categoria (soft delete ) - recibo id de una categoria
router.delete('/:id',[
    validarJWT, //* PARA LA PERSONA QUE HACE EL PUT, SE CAMBIARÁ EL USUARIO 
    check('id','El id ingresado en el parámetro no es válido').isMongoId(),
    check('id').custom(existeCategoriaByID),
    validarCampos
],eliminarCategoria);





module.exports = router;