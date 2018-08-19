'use strict'

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/imlDB', {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('La conexion a la base de datos imlDB es correcta')
    }).catch(err => console.log(err))