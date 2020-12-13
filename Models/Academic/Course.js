const mongoose = require('mongoose');

const Schema = mongoose.Schema
const CourseSchema = new Schema({
    name : String,
    ID : {type:Number , unique:true , required:true},
    code : {type:String , unique:true},
    coverage : Number,
    scheduleID : {type:Number,unique:true},
    teachingStaff : Array, //Array[staffID]
    description : String,
});

module.exporst =mongoose.model('Course',CourseSchema);