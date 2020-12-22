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
    attendanceRecord : Array, //Array[object] : object = {"status","signIn time","signout time"}
                                // status : {0:absent , 1:attendant}
                                // signin time : time of signing in "time stamp"
                                // signout time : time of signing out "time stamp"
    extraInfo : Array,
    salary : Number,
    annualBalance : Number,
    accidentalLeaveBalance : Number,
});

//StaffSchema.index();
module.exports =mongoose.model('Staff_Member',StaffSchema);