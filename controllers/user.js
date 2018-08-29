'use strict'
// modules
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

//models
var User = require('../models/user');

// servicios jwt
var jwt = require('../services/jwt');

//actions
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de usuario y la accion prueba',
        user: req.user
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
                } else {
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


function login(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({
        email: email.toLowerCase()
    }, (err, user) => {
        if (err) {
            res.status(500).send({
                message: 'Error al comprobar el Usuario'
            });
        } else {
            if (user) {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        if (params.gettoken) {
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(200).send({
                                user
                            });
                        }
                    } else {
                        res.status(404).send({
                            message: 'El Usuario no no ha podido loguearse o contraseña incorrecta'
                        });
                    }
                });

            } else {
                res.status(500).send({
                    message: 'El Usuario no no ha podido loguearse'
                });
            }
        }
    });
}

function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId).populate({
        path: 'user'
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({
                message: 'error en la peticion del usuario'
            });
        } else {
            if (!user) {
                res.status(404).send({
                    message: 'La publicacion no Existe'
                });
            } else {
                res.status(200).send({
                    user
                });
            }
        }
    });
}

function getUser2(req, res) {
    var userId = req.params.id;
    //buscar un documento por un  id
    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({
            message: 'Error en la petición'
        });
        if (!user) return res.status(404).send({
            message: 'EL usuario no existe'
        });
        followThisUser(req.user.sub, userId).then((value) => {
            user.password = undefined;
            return res.status(200).send({
                user,
                following: value.following,
                followed: value.followed
            });
        });

    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;
    delete update.password;
    // if (userId != req.user.sub) {
    //     return res.status(500).send({
    //         message: 'No tienes permiso para actualizar el usuario'
    //     });
    // }
    User.findByIdAndUpdate(userId, update, {
        new: true
    }, (err, userUpdate) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al Actualizar usuario'
            });
        } else {
            if (!userUpdate) {
                return res.status(404).send({
                    message: 'No se ha podido utilizar el usuario'
                });
            } else {
                return res.status(200).send({
                    user: userUpdate
                });
            }
        }
    });
}


function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'No subido...';
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg') {
            if (userId != req.user.sub) {
                return res.status(500).send({
                    message: 'No tienes permiso para actualizar la Imagen de Usuario'
                });
            }
            User.findByIdAndUpdate(userId, {
                image: file_name
            }, {
                new: true
            }, (err, userUpdate) => {
                if (err) {
                    res.status(500).send({
                        message: 'Error al actualizar usuario'
                    });
                } else {
                    if (!userUpdate) {
                        res.status(400).send({
                            message: 'No se ha podido actualizar la imagen de usuario'
                        });
                    } else {
                        res.status(200).send({
                            user: userUpdate,
                            image: file_name
                        });
                    }
                }
            });
        } else {
            fs.unlink(file_path, (err) => {
                if (err) {
                    return res.status(404).send({
                        message: 'La extencion no es valida y el fichero no ha sido borrado'
                    });
                } else {
                    return res.status(500).send({
                        message: 'La extencion no es valida'
                    });
                }
            })
        }
    } else {
        return res.status(404).send({
            message: 'No se ha subido ningun archivo'
        });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            return res.status(404).send({
                message: 'La Imagen no existe'
            });
        }
    });
}
// exports
module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImage,
    getImageFile,
    getUser,
    getUser2
}