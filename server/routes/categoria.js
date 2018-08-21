const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
const Categoria = require('../model/categoria');
const _ = require('underscore');

/**
 * Muestra todas las categorias
 */

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('decripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Id no existe'
                    }
                });
            }
            res.json({
                categoria: categoriaDB
            })

        });


});

/**
 * Muestra una categoria por ID
 */
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    // Con populate nos traemos los objetos referenciados
    Categoria.findById(id)
        .sort('decripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontró la categoria'
                    }
                });
            }
            res.json({
                categoria: categoriaDB
            })

        });

});
/**
 * Crear nueva categoria
 */
app.post('/categoria', verificaToken, (req, res) => {
    //devuelve la nueva categoria
    //req.usuario.id

    let body = req.body;
    console.log(req.usuario);
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró la categoria'
                }
            });
        }
        res.status(201).json({
            categoria: categoriaDB
        });
    });

});

/**
 * Actualiza una categoria
 */
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .sort('decripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontró la categoria'
                    }
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });

        });
});

/**
 * Borra una categoria
 */
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró la categoria'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
    //solo un admin puede borrar categorias fisicamente.
    //Categoria findbyId and remove
});




module.exports = app;