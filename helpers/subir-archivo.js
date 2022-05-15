const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {
        const { archivo } = files;
        //? obteniento la extension del archivo
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida, extensiones permitidas : ${extensionesValidas}`);
        }
        const nombreTemp = `${uuidv4()}.${extension}`;
        uploadPath = path.join(__dirname, '../uploads/', carpeta , nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(nombreTemp); //* Retorna la ruta
        });
    });

}

module.exports = {
    subirArchivo
}