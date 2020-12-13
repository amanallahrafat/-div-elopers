const mongoose = require('mongoose');

const Schema = mongoose.Schema
const FacultySchema = new Schema({
    name : {type:String, unique:true, required:true}, 
    departments : Array, // Array[departmentID]
});

module.exports =mongoose.model('Faculty',FacultySchema);