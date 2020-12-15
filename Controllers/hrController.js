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

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { find } = require('../Models/Academic/Course_Schedule');
const key = "jkanbvakljbefjkawkfew";

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
const getMaxStaffID=async (type)=>{
    const staffTable = await Staff_Member.find({type:type});
    let max = 0 ;
    if(staffTable.length != 0){
        max = Math.max.apply(Math, staffTable.map(obj=>  obj.ID));
    }
    console.log(max);
    return max;
}


const addStaffMember=async (req,res)=>{
    const isValid = validator.validateAddStaffMember(req.body);
    if(isValid.error)
        return res.status(400).send({error : isValid.error.details[0].message});

    const office = await Location.find({ID : req.body.officeID, type: 2});
    const users = await Staff_Member.find({email: req.body.email});
    if(users.length != 0){
        return res.status(400).send("This email already exists. Emails have to be unique");
    }
    console.log("the office is ");
    console.log(office);
    if(office.length == 0){
        return res.status(400).send("This location doesn't exist or it's not an office");
    }
    else {
        const countMembers = await Staff_Member.find({officeID : req.body.officeID});
        console.log("the countMembers are ");
        console.log(countMembers);
        if(countMembers.length == office[0].capacity)
            return res.status(400).send("This location is full");
    
    }
    if(req.body.type == 0){ //If it's an academic member 
        const faculty = await Faculty.find({name:req.body.facultyName});
        if(faculty.length == 0)
            return res.status(400).send("This faculty doesn't exist");
        const department  = await Department.find({ID: req.body.departmentID});
        if(department.length == 0)
            return res.status(400).send("This department doesn't exist");
            
    }
    // the salt number : recommended not to go above 14.
    const salt  = await bcrypt.genSalt(10);
    // always pass the body.passward as a string 
    const hashedPass = await bcrypt.hash("123456",salt);
    let max  = await getMaxStaffID(req.body.type);
    const u = new Staff_Member({
        name : req.body.name,
        ID : max + 1,
        email : req.body.email,
        type : req.body.type,
        password : hashedPass,
        dayOff :req.body.dayOff,
        gender : req.body.gender,
        officeID : req.body.officeID,
        extraInfo : req.body.extraInfo,
        salary:req.body.salary,
        annualBalance : 2.5,
        accidentalLeaveBalance : 6
    });
    await u.save();
    if(req.body.type == 0){ // If it's an academic member add it to academic member table
        const academic_member = new Academic_Member({
            ID : max + 1,
            facultyName : req.body.facultyName,
            departmentID : req.body.departmentID,
            type : 3, // { {"0" : HOD }, {"1" : course Instructor} , {"2" : Cooridnator}, {"3": Neither}}
        })
        await academic_member.save();
    }
    res.send("Registeration Completed!");
}

const updateStaffMember = async(req, res)=>{
    const member = await Staff_Member.find({ID: req.params.ID});
    if(member.length == 0){
        return res.status(400).send("This staff member doesn't exist");
    }



}
 
module.exports = {
    createLocation,
    updateLocation,
    deleteLocation,
    addStaffMember,
}