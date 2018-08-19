'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UseSchema = Schema({
    name: String,
    surname: String,
    contact: String,
    phone: Number,
    email: String,
    password: String,
    role: String,
    image: String
});

module.exports = mongoose.model('User', UseSchema);