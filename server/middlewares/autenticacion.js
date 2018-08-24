const jwt = require('jsonwebtoken');
/**
 * Verificar token
 */

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        //metemos en request.usuario el usuario decodificado para poderse usar en el resto de servicios
        // req.usuario
        req.usuario = decoded.usuario;
        next();
    });


};
/**
 * Verificar adminRole
 */
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    console.log(usuario);
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            message: 'El usuario no es administrador'
        })
    } else {
        next();
    }

};
/**
 * Verificar token url
 */
let verficaTokenUrl = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        //metemos en request.usuario el usuario decodificado para poderse usar en el resto de servicios
        // req.usuario
        req.usuario = decoded.usuario;
        next();
    });

};


module.exports = { verificaToken, verificaAdmin_Role, verficaTokenUrl };