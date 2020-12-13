const Course_Schedule = require('../Models/Academic/Course_Schedule');
const Course = require('../Models/Academic/Course.js');
const Department = require('../Models/Academic/Department');
const Faculty = require('../Models/Academic/Faculty.js');
const Location = require('../Models/Others/Location.js');
const Notification = require('../Models/Others/Notification.js');
const Accidental_Leave_Request = require('../Models/Requests/Accidental_Leave_Request.js');
const Annual_Leave_Request = require('../Models/Requests/Annual_Leave_Request.js');
const Change_Day_Off_Request = require('../Models/Requests/Change_Day_Off_Request.js');
const Compensation_Leave_Request = require('../Models/Requests/Compensation_Leave_Request.js');
const Maternity_Leave_Request = require('../Models/Requests/Maternity_Leave_Request.js');
const Sick_Leave_Request = require('../Models/Requests/Sick_Leave_Request.js');
const Academic_Member = require('../Models/Users/Academic_Member.js');
const Staff_Member = require('../Models/Users/Staff_Member.js');
const mongoose = require('mongoose');

const validator = require('../Validations/hrValidations.js');
const mongoValidator = require('mongoose-validator');

// Start Location CRUD
const createLocation = async (req,res) =>{
    const isValid = validator.validateLocation(req.body);
    if(isValid.error)
        return res.status(400).send({error : isValid.error.details[0].message});
    const locationTable = await Location.find();
    let max = 0 ;
    if(locationTable.length != 0){
        max = Math.max.apply(Math, locationTable.map(obj=>  obj.ID));
    }
    const location = new Location({
        ID : max + 1,
        name : req.body.name,
        capacity : req.body.capacity,
        type : req.body.type
    })
    await location.save();
    res.send("Location Added Successfully!");
}

const updateLocation = async (req,res)=>{
    const location = await Location.findOne({ID : req.params.ID});
    if(!location)
        return res.status(404).send("Location Not Found");

    if(req.body.name==null)req.body.name = location.name;
    if(req.body.capacity==null)req.body.capacity = location.capacity;
    if(req.body.type==null)req.body.type = location.type;

    const isValid = validator.validateLocation(req.body);
    if(isValid.error)
        return res.status(400).send({error : isValid.error.details[0].message});

    await Location.updateOne({ID : req.params.ID}, req.body);
    res.send("Location Updated Successfully!");
}

const deleteLocation = async(req, res)=>{
    const location = await Location.findOne({ID : req.params.ID});
    if(!location)
        return res.status(404).send("Location ID Not Valid");

    await Location.deleteOne({ID : req.params.ID});
    res.send("Location Deleted Successfully!");
}
// End Location CRUD


 
module.exports = {
    createLocation,
    updateLocation,
    deleteLocation,
}