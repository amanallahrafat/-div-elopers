const mongoose = require('mongoose');

const Schema = mongoose.Schema
const StaffSchema = new Schema({
    name : String,
    ID : Number,
    email : String,
    type : Number, // { {"0" : academic }, {"1" : hr} }
    password : String,
    dayOff : String,
    gender : String,
    officeID : Number,
    extraInfo : Array,
    salary : Number,
    annualBalance : Number,
    accidentalLeaveBalance : Number,
});

//StaffSchema.index();
module.exporst =mongoose.model('Staff_Member',StaffSchema);