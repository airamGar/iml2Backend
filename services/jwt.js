'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretCode = '2da_validacion_para_crear_token';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        contact: user.contact,
        phone: user.phone,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    }
    return jwt.encode(payload, secretCode);
}