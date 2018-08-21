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
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
    res.header('Allow', 'GET, POST, PUT, OPTIONS, DELETE');
    next();
});

// rutas base
app.use ('/api', user_routes);
app.use ('/api', publications_routes);



// exportar modulo

module.exports = app;