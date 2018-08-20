'use strict'

var express = require ('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

api.get('/pruebasDelControlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/registroUsuario', UserController.saveUser);
api.post('/loginUser', UserController.login);
api.put('/actualizarUsuario/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/cargarImagenUsuario/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/mostrarImagenUsuario/:imageFile', UserController.getImageFile);

module.exports = api;