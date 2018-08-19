'use strict'
// modules
var bcrypt = require('bcrypt-nodejs');

//models
var User = require('../models/user');

//actions
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de usuario y la accion prueba'
    })
}

function saveUser(req, res) {
    // create user objet
    var user = new User();

    // obtener parametros de la peticion 
    var params = req.body;

    // comprobar y asignar valores al objeto usuario
    if (params.password && params.name && params.surname && params.contact && params.phone && params.email) {
        user.name = params.name;
        user.surname = params.surname;
        user.contact = params.contact;
        user.phone = params.phone;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        // comprobamos que el email no exista

        User.findOne({
            email: user.email.toLowerCase()
        }, (err, issetUser) => {
            if (err) {
                res.status(500).send({
                    message: 'error al guardar el usuario'
                });
            } else {
                if (!issetUser) {
                    // ciframos la contraseña 
                    bcrypt.hash(params.password, null, null, function (err, hash) {
                        user.password = hash;

                        // guardamos el usuario a la pase de datos
                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({
                                    message: 'error al guardar el usuario'
                                });
                            } else {
                                if (!userStored) {
                                    res.status(404).status({
                                        message: 'no se ha registrado el usuario'
                                    });
                                } else {
                                    res.status(200).send({
                                        user: userStored
                                    });
                                }
                            }
                        })

                    });
                }else{
                    res.status(500).send({
                        message: 'El usuaio no se puede registrar porque ya existe'
                    });
                }
            }
        })



    } else {

        res.status(500).send({
            message: 'Introduce los datos correctamente para poder registrar al usuario'
        });
    }


}

// exports
module.exports = {
    pruebas,
    saveUser
};