'use strict'

var express = require ('express');
var PublicationController = require('../controllers/publications');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/publications'});

api.get('/pruebasPublicaciones', md_auth.ensureAuth, PublicationController.pruebas);
api.post('/guardarPublicacion', md_auth.ensureAuth, PublicationController.savePublications);
api.get('/publicaciones', PublicationController.getPublications);
api.get('/publicacion/:id', PublicationController.getPublication);


module.exports = api; 