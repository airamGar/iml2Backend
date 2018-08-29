'use strict'
// modules
var fs = require('fs');
var path = require('path');

//models
var User = require('../models/user');
var Publication = require('../models/publications');

//actions
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de Publicaciones y la accion prueba',
        user: req.user
    })
}

function savePublications(req, res) {
    // creamos el nuevo objeto
    var publications = new Publication();
    // recogemos los paramatreos que nos llegan por body
    var params = req.body

    if (params.typeProp && params.title && params.price) {

        publications.province = params.province;
        publications.city = params.city;
        publications.sector = params.sector;
        publications.typeProp = params.typeProp;
        publications.transaction = params.transaction;
        publications.title = params.title;
        publications.imgage = null;
        publications.imgage2 = null;
        publications.price = params.price;
        publications.typePrice = params.typePrice;
        publications.equipped = params.equipped;
        publications.room = params.room;
        publications.bath = params.bath;
        publications.park = params.park;
        publications.meters = params.meters;
        publications.antiquity = params.antiquity;
        publications.security = params.security;
        publications.phone = params.phone;
        publications.pet = params.pet;
        publications.description = params.description;
        publications.googleMaps = params.googleMaps;
        publications.user = req.user.sub;
        publications.phoneUser = req.user.phone;
        publications.userName = req.user.name;
        publications.surnameUser = req.user.surname;
        publications.emailUser = req.user.email;

        publications.save((err, publicationStored) => {
            if (err) {
                res.status(500).send({
                    message: 'Error en el servidor al cargar propiedad'
                });
            } else {
                if (!publicationStored) {
                    res.status(404).send({
                        message: 'no se ha podido guardad la publicacion'
                    });
                } else {
                    res.status(200).send({
                        publications: publicationStored
                    });
                }
            }
        });

    } else {
        res.status(200).send({
            message: 'Faltan parametros para guardar la publicacion',
        })
    }
}

function getPublications (req, res){
    Publication.find({}).populate({path: 'user'}).exec((err, publications) =>{
        if(err){
            res.status(500).send({
                message: 'error en la peticion de las publicaciones',
            });
        }else{
            if (!publications) {
                res.status(404).send({
                    message: 'no hay publicaciones',
                });
            }else{
                res.status(200).send({
                    publications
                });
            }
        }
    });
}

function getPublication (req, res){

    var publicationId = req.params.id;

    Publication.findById(publicationId).populate({path: 'user'}).exec((err, publications) =>{
        if(err){
            res.status(500).send({
                message: 'error en la peticion de la publicacion'
            });
        }else{
            if(!publications){
                res.status(404).send({
                    message: 'La publicacion no Existe'
                });
            }else{
                res.status(200).send({
                    publications
                });
            }
        }
    });
}

function updatePublication (req, res){
    var publicationId = req.params.id;
    var update = req.body;

    Publication.findByIdAndUpdate(publicationId, update, {new: true}, (err, publicationUpdate) =>{
        if(err){
            res.status(500).send({
                message: 'no se ha podido actualizar la publicacion'
            });
        }else{
            if(!publicationUpdate){
                res.status(404).send({
                    message: 'La publicacion no existe o no se encontro'
                });
            }else{
                res.status(200).send({
                    publications: publicationUpdate
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var publicationId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg') {
            Publication.findByIdAndUpdate(publicationId, {
                image: file_name,
                image2: file_name
            }, {
                new: true
            }, (err, publicationUpdate) => {
                if (err) {
                    res.status(500).send({
                        message: 'Error al actualizar la publicacion'
                    });
                } else {
                    if (!publicationUpdate) {
                        res.status(400).send({
                            message: 'No se ha podido actualizar la imagen de la publicacion'
                        });
                    } else {
                        res.status(200).send({
                            publication: publicationUpdate,
                            image: file_name,
                            image2: file_name
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

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/publications/' + imageFile;

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        }else{
            return res.status(404).send({
                message: 'La Imagen no existe'
            });
        }
    });
}

function deletePublication (req, res){
    var publicationId = req.params.id;

    Publication.findOneAndRemove(publicationId, (err, publicationRemove) =>{
        if(err){
            return res.status(500).send({
                message: 'Error en la peticion para borrar publicacion'
            });
        }else{
            if(!publicationRemove){
                return res.status(404).send({
                    message: 'No se encontro esta publicacion o no existe'
                });
            }else{
                return res.status(200).send({
                    publication: publicationRemove
                });
            }
        }
    });
}

// exports
module.exports = {
    pruebas,
    savePublications,
    getPublications,
    getPublication,
    updatePublication,
    uploadImage,
    getImageFile,
    deletePublication
}