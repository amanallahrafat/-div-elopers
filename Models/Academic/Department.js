const mongoose = require('mongoose');

const Schema = mongoose.Schema
const DepartmentSchema = new Schema({
    ID : {type:Number, unique:true, required:true},
    name : String, 
    members : Array, //Array[memberID]
    hodID : Number,
    //courses : Array, //Array[courseID]
});

module.exports =mongoose.model('Department',DepartmentSchema);