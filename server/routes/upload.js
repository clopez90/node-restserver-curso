const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../model/usuario');
const Producto = require('../model/producto');
const fs = require('fs');
const path = require('path');


// default options
// todo lo que se suba se va a colocar dentro de req.files
app.use(fileUpload());


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    //valido tipos
    let tiposValidos = ['producto', 'usuario'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Los tipos permitidos son ' + tiposValidos.join(',')
                }
            });


    }

    //archivo sera el nombre del parametro del request
    let archivo = req.files.archivo;

    // extensiones validas
    validExtensions = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'];
    if (!validExtensions.includes(archivo.mimetype)) {
        return res.status(500).json({
            ok: false,
            err: {
                message: `Solo ${validExtensions.join(', ')} son permitidas`
            }
        });
    }


    // Cambiar nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds() }.${archivo.mimetype.split('/')[1]}`;


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        // Aqui ya sabemos que la imagen se ha cargado

        guardarImagen(id, res, nombreArchivo, tipo);
    });



});

function guardarImagen(id, res, nombreArchivo, tipo) {

    let entity;

    if (tipo === 'producto') {
        entity = Producto;
    } else if (tipo == 'usuario') {
        entity = Usuario;
    }

    entity.findById(id, (err, entityDB) => {

        if (err) {
            // borro el archivo que acabo de subir
            borrarArchivo(nombreArchivo, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!entityDB) {
            borrarArchivo(nombreArchivo, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: `${tipo} no existe`
                }
            });
        }

        //borro la imagen asociada antes de cargar la nueva
        borrarArchivo(entityDB.img, tipo);

        //actualizamos la imagen del user
        entityDB.img = nombreArchivo;
        entityDB.save((err, entitySaved) => {
            res.json({
                ok: true,
                entity: entitySaved,
                img: nombreArchivo
            });
        });

    });

}

function borrarArchivo(nombreImagen, tipo) {
    //generamos el path de la imagen
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    //si encuentra imagen, la borra
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;