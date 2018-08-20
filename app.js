'use strict'

var express = require ('express');
var bodyParser = require ('body-parser');

var app = express ();

// cargar rutas
var user_routes = require('./routes/user');
var publications_routes = require('./routes/publications');

// midelWare de Body-parse

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// configurar cabeceras y cors


// rutas base
app.use ('/api', user_routes);
app.use ('/api', publications_routes);



// exportar modulo

module.exports = app;