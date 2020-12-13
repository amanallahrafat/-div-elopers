const mongoose = require('mongoose');

const Schema = mongoose.Schema
const DepartmentSchema = new Schema({
    name : String, 
    ID : {type:Number, unique:true, required:true},
    members : Array, //Array[memberID]
    hodID : Number,
    courses : Array, //Array[courseID]
});

module.exporst =mongoose.model('Department',DepartmentSchema);