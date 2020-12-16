const { number } = require('@hapi/joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema
const CourseSchema = new Schema({
    name : String,
    ID : {type:Number , unique:true , required:true},
    coordinatorID : Number,
    code : {type:String , unique:true},
    // coverage : Number,
    scheduleID : {type:Number},
    teachingStaff : Array, //Array[staffID]
    department : Array, //Array[departmentID]
    description : String,
});

module.exports =mongoose.model('Course',CourseSchema);