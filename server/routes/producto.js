const express = require('express');

let app = express();

const { verificaToken } = require('../middlewares/autenticacion');

let Producto = require('../models/producto');


// ****************************
//   Obtener los productos
// ****************************
app.get('/productos', verificaToken, ( req, res ) => {
    // Trae todos los productos
    // populate: usuario y categoria
    // Paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( ( err, productos ) => {

            if ( err ) {
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

// ****************************
//  Obtener un producto por ID
// ****************************
app.get('/productos/:id', verificaToken, ( req, res ) => {
    // populate: usuario y categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( ( err, producto ) => {

            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            if ( !producto ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es valido'
                    }
                });
            }
    
            res.json({
                ok: true,
                producto
            });

        });
    
});

// ****************************
//      Buscar productos
// ****************************
app.get('/productos/buscar/:termino', verificaToken,(req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
            .populate('categoria', 'descripcion')
            .exec( ( err, productos ) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos
                })

            });

});

// ****************************
//      Crear un producto
// ****************************
app.post('/productos', verificaToken, ( req, res ) => {
    // Grabar un usuario
    // Grabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save( ( err, productoBD ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoBD ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });

    });

});

// ****************************
//    Actualizar un producto
// ****************************
app.put('/productos/:id', verificaToken, ( req, res ) => {

    let id = req.params.id;
    let body = req.body;

    let actualizarProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion || 'Sin descripcion',
        categoria: body.categoria,
        disponible: true,
    };
    
    Producto.findByIdAndUpdate( id, actualizarProducto, { new: true, runValidators: true }, ( err, productoBD) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoBD ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: productoBD
        });

    });

});

// ****************************
//    Borrar un producto
// ****************************
app.delete('/productos/:id', verificaToken, ( req, res ) => {
    // Cambiar el disponible
    let id = req.params.id;

    let cambioDisponible = {
        disponible: false
    };

    Producto.findByIdAndUpdate( id, cambioDisponible, { new: true, runValidators: true }, (err, productoBD) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoBD ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID es invalido'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBD,
            message: 'Producto borrado'
        });

    });

});




module.exports = app;