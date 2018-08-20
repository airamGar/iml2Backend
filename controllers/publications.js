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
        publications.img = null;
        publications.price = params.price;
        publications.typePrice = params.typePrice;
        publications.equipped = params.equipped;
        publications.room = params.room;
        publications.bath = params.bath;
        publications.park = params.park;
        publications.meters = params.meters;
        publications.antiquity = params.antiquity;
        publications.security = params.security;
        publications.pet = params.pet;
        publications.description = params.description;
        publications.googleMaps = params.googleMaps;
        publications.user = req.user.sub;
        publications.phone = req.user.phone;
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

// exports
module.exports = {
    pruebas,
    savePublications,
    getPublications,
    getPublication
}