'use strict'

var express = require ('express');
var UserController = require('../controllers/user');

var api = express.Router();

api.get('/pruebasDelControlador', UserController.pruebas);
api.post('/registroUsuario', UserController.saveUser);
api.post('/loginUser', UserController.login);

module.exports = api;