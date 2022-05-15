
const { Router } = require('express');
const { check } = require('express-validator');

const { crearProducto, listarProductos, listarProducto, actualizarProducto, deleteProducto } = require('../controllers/productos.controller');
const { existeProductoByID } = require('../helpers/db_validators');
const { validarJWT,validarCampos} = require('../middlewares/');

const router = Router();

//*Listado de todos los productos
router.get('/', listarProductos);

//*Listado de producto en especifico
router.get('/:id',[
    check('id','Su id no válido').isMongoId(),
    check('id').custom(existeProductoByID),
    validarCampos
], listarProducto);

//*Insertar un producto
router.post('/',[
    validarJWT,
    check('nombre','El nombre no debe estar vacío').notEmpty(),
    check('categoria','El código de categoría es inválido').isMongoId(),
    check('precio','El precio debe ser un número.').isNumeric(),
    validarCampos
],crearProducto);

//*Actualizar un producto
router.put('/:id',[
    validarJWT,
    check('id','El id no es válido').isMongoId(),
    check('id').custom(existeProductoByID),
    check('precio','El precio debe ser un número').isNumeric(),
    check('nombre', 'El nombre no debe estar vacío').notEmpty(),
    validarCampos
], actualizarProducto);

//*Eliminar un producto en especifico
router.delete('/:id',[
    check('id','El id no es válido').isMongoId(),
    check('id').custom(existeProductoByID),
    validarCampos
] ,deleteProducto);



module.exports = router;
