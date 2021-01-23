const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ****************************
// Mostrar todas las categorias
// ****************************
app.get('/categoria', verificaToken, (req, res) => {
    
    Categoria.find({})
    .sort('descripcion') // Ordenar
    .populate('usuario', 'nombre email') // Nombre esquema y campos
    .exec( (err, categorias) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias
        });

    });
});

// ****************************
//   Mostrar categoria por ID
// ****************************
app.get('/categoria/:id', verificaToken, (req, res) => {
    // Categoria.findById(.....);
    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoria ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es valido'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });

    });
});

// ****************************
//    Crear nueva categoria
// ****************************
app.post('/categoria', verificaToken, (req, res) => {
    // Regresa la nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( ( err, categoriaBD ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaBD ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });

    });
});

// ****************************
//   Actualizar una categoria
// ****************************
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate( id, descCategoria, { new: true, runValidators: true }, ( err, categoriaBD) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaBD ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });

    });

});

// ****************************
//     Borrar una categoria
// ****************************
app.delete('/categoria/:id', [ verificaToken, verificaAdmin_Role ],(req, res) => {
    // Solo un administrador puede borrar categorias
    // Categoria.finByIdAndRemove
    let id = req.params.id;

    Categoria.findByIdAndRemove( id, ( err, categoriaBorrada ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaBorrada ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });

    });
});






module.exports = app;