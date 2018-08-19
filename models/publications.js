'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PropSchema = Schema({
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
    antiquity: String,
    phone: String,
    security: String,
    pet: String,
    description: String,
    mapp: String,
    user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Publications', PropSchema);