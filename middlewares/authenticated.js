'use strict'

var jwt = require('jwt-simple');
var momnet = require('moment');
var secretCode = '2da_validacion_para_crear_token';

exports.ensureAuth = function (req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({
            message: 'la peticion no tiene la cabecera de autenticacion'
        });
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secretCode);
        if(payload.exp <= momnet().unix()){
            return res.status(401).send({
                message: 'el token a expirado'
            });
        }
    } catch (ex) {
        return res.status(401).send({
            message: 'el token no es valido'
        });
    }
    req.user = payload;

    next();
}