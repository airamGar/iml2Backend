'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PropSchema = Schema({
    province: String,
    city: String,
    sector: String,
    typeProp: String,
    transaction: String,
    title: String,
    img: String,
    price: Number,
    typePrice: String,
    equipped: String,
    room: Number,
    bath: Number,
    park: Number,
    meters: Number,
    antiquity: String,
    security: String,
    pet: String,
    description: String,
    googleMaps: String,
    user: { type: Schema.ObjectId, ref: 'User' },
    phone: Number,
    userName: String,
    surnameUser: String,
    contactUser: String,
    emailUser: String
});

module.exports = mongoose.model('Publication', PropSchema);