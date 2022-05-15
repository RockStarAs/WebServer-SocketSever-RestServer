const { response } = require('express');

const validarArchivoSubir = (req, res = response , next) =>{
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({ msg: 'No hay archivos en la petición - archivo.' });
        return;
    }
    next();
};

module.exports = {
    validarArchivoSubir
};