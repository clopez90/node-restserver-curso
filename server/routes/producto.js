const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
const Producto = require('../model/producto');
const _ = require('underscore');

/**
 *  Muestra el producto por id
 */
app.get('/producto/:id', verificaToken, function(req, res) {

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Id no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });

        });

});




/**
 * Trae una lista de productos paginados
 */
app.get('/producto', verificaToken, function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            //{estado = true} para contar solo usuarios activos
            Producto.count({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    registros: conteo
                });
            });

        });





});

/**
 * Buscar producto
 */
app.get('/producto/buscar/:termino', verificaToken, function(req, res) {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });

});

//POST
/**
 * Crea un producto
 */
app.post('/producto', verificaToken, function(req, res) {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            producto: productoDB
        });
    });

});


// //PUT
/**
 * Updatea un producto
 */
app.put('/producto/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });

        });
});

// });

//DELETE
/**
 * Borra un producto
 */
app.delete('/producto/:id', verificaToken, function(req, res) {

    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true })
        .populate('usuario')
        .populate('categoria')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Id no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });

        });

});


module.exports = app;