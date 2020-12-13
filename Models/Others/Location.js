const mongoose = require('mongoose');

const Schema = mongoose.Schema
const LocationSchema = new Schema({
    ID : {type:Number, unique:true, required:true},
    name : String,
    capacity : Number,
    type : Number, //{{0:"hall"},{1:"tut room"},{2:"office"},{3:"lab"}}
});

module.exporst =mongoose.model('Location',LocationSchema);