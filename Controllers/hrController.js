const Course_Schedule = require('../Models/Academic/Course_Schedule.js');
const Course = require('../Models/Academic/Course.js');
const Department = require('../Models/Academic/Department.js');
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
const checkings = require('../utils/checkings.js');
const mongoose = require('mongoose');

const validator = require('../Validations/hrValidations.js');
const mongoValidator = require('mongoose-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

// Start Faculty CRUD
const createFaculty = async (req,res) =>{
    const isValid = validator.validateFaculty(req.body);
    if(isValid.error)
        return res.status(400).send({error : isValid.error.details[0].message});
    const fac = await Faculty.find({name: req.body.name});
    if(fac.length)
        return res.status(400).send("Faculty name should be unique");

    // Check that the departments exist.
    for(let i = 0; i < req.body.departments.length; i++){
        let dep =  await Department.find({ID: req.body.departments[i]});
        if(dep.length == 0) return res.status(400).send("Department IDs are not valid");
    }

    // Check that no department is shared with another faculty.
    const facArray = await Faculty.find();
    for(const f of facArray){
        for(const d of req.body.departments){
            if(f.departments.includes(d))
                return res.status(400).send("Deparments can not be shared between different faculties");
        }
    }

    const faculty = new Faculty({
        name : req.body.name,
        departments : req.body.departments
    })
    await faculty.save();
    res.send("Faculty Added Successfully!");
}

const updateFaculty = async (req,res) =>{
    const faculty = await Faculty.findOne({name : req.params.name});
    if(!faculty)
        return res.status(404).send("Faculty Not Found");
    
    const body = req.body;
    if(body.name==null)body.name = faculty.name;
    if(body.departments==null)body.departments = faculty.departments;

    const isValid = validator.validateFaculty(body);
    if(isValid.error)
        return res.status(400).send({error : isValid.error.details[0].message});

    // Delete the faculty using the old name.
    await Faculty.deleteOne({name : faculty.name});

    const fac = await Faculty.find({name: body.name});
    if(fac.length){
        // Add the old faculty back to the DB.
        const newFaculty = new Faculty({
            name : faculty.name,
            departments : faculty.departments
        })
        await newFaculty.save();
        return res.status(400).send("Faculty name should be unique");
    }

    // Check that the departments exist.
    for(let i = 0; i < body.departments.length; i++){
        let dep =  await Department.find({ID: body.departments[i]});
        if(dep.length == 0){
            // Add the old faculty back to the DB.
            const newFaculty = new Faculty({
                name : faculty.name,
                departments : faculty.departments
            })
            await newFaculty.save();
            return res.status(400).send("Department IDs are not valid");
        } 
    }

    // Check that no department is shared with another faculty.
    const facArray = await Faculty.find();
    for(const f of facArray){
        for(const d of body.departments){
            if(f.departments.includes(d)){
                // Add the old faculty back to the DB.
                const newFaculty = new Faculty({
                    name : faculty.name,
                    departments : faculty.departments
                })
                await newFaculty.save();
                return res.status(400).send("Deparments can not be shared between different faculties");
            }
        }
    }

    const newFaculty = new Faculty({
        name : body.name,
        departments : body.departments
    })
    await newFaculty.save();
    res.send("Faculty Updated Successfully!");
}

const deleteFaculty = async(req, res)=>{
    const faculty = await Faculty.findOne({name : req.params.name});
    if(!faculty)
        return res.status(404).send("Faculty name Not Valid");

    await Faculty.deleteOne({name : req.params.name});
    res.send("Faculty Deleted Successfully!");
}
// End Faculty CRUD

const addStaffMember = async (req,res)=>{
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
 
// Start Department CRUD
const createDepartment = async (req,res) =>{
    const isValid = validator.validateDepartment(req.body);
    if(isValid.error)
        return res.status(400).send({error : isValid.error.details[0].message});

    // TODO: Check the question on piazza
    // Check that the department members are academic members.
    if(req.body.members){
        for(const memID of req.body.members){
            const exist = await Academic_Member.find({ID: memID});
            console.log(exist.length)
            if(exist.length==0)
                return res.status(400).send("Members must be academic members");
        }
    }

    // Check that the HOD is an academic member.
    if(req.body.hodID){
        const existHOD = await Academic_Member.find({ID: req.body.hodID});
    if(existHOD.length==0)
        return res.status(400).send("HOD must be an academic member");
    }

    if(!req.body.members.includes(req.body.hodID))
        return res.status(400).send("The HOD must be a member of the department first to be its head");
    
    const departmentTable = await Department.find();
    let max = 0 ;
    if(departmentTable.length != 0){
        max = Math.max.apply(Math, departmentTable.map(obj=>  obj.ID));
    }
    const department = new Department({
        ID : max + 1,
        name : req.body.name, 
        members : req.body.members, //Array[memberID]
        hodID : req.body.hodID,
    })
    await department.save();
    res.send("Department Added Successfully!");
}

const updateDepartment = async (req,res) =>{
    // TODO
}

const deleteDepartment = async (req,res) =>{
    const department = await Department.findOne({ID : req.params.ID});
    if(!department)
        return res.status(404).send("Department name Not Valid");

    await Department.deleteOne({ID : req.params.ID});
    res.send("Department Deleted Successfully!");
}

module.exports = {
    createLocation,updateLocation,deleteLocation,
    createFaculty,updateFaculty,deleteFaculty,
    createDepartment,updateDepartment,deleteDepartment,
    addStaffMember,
}