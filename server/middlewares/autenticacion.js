const jwt = require('jsonwebtoken');
// *************************
//     Verificar Token
// *************************
let verificaToken = ( req, res, next ) => {

    let token = req.get('token'); // token o Authorization

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if ( err ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};

// *************************
//   Verificar ADMIN_ROLE
// *************************
let verificaAdmin_Role = ( req, res, next ) => {

    let usuario = req.usuario;

    if ( usuario.role === 'ADMIN_ROLE' ) {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
    
};

// *************************
// Verificar token para img
// *************************
let verificaTokenImg = ( req, res, next ) => {

    let token = req.query.token;

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if ( err ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}