const mongoose = require('mongoose');

const Schema = mongoose.Schema
const AcademicMemberSchema = new Schema({
    ID : {type:Number, required:true},
    facultyID : Number,
    departmentID : Number,
    type : Number, // { {"0" : HOD }, {"1" : course Instructor} , {"2" : Cooridnator}}
    courses : Array, // Array[CourseID]
});

module.exports = mongoose.model('Academic_Member',AcademicMemberSchema);