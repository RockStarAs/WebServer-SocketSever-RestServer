
const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivo, actualizaImgColeccion, mostrarImg, actualizaImgColeccionCloudinary } = require('../controllers/uploads.controller');
const { coleccionesPermitidas } = require('../helpers/db_validators');
const { validarArchivoSubir,validarCampos } = require('../middlewares');


const router = Router();


router.post('/',[
    validarArchivoSubir,
    validarCampos
],cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id','El id debe ser un Mongo ID').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] )),
    validarCampos
],actualizaImgColeccionCloudinary);
//] , actualizaImgColeccion);

router.get('/:coleccion/:id',[
    check('id','El id debe ser un Mongo ID').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] )),
    validarCampos
],mostrarImg);

module.exports = router;