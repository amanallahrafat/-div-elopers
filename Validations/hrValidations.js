
const joi = require('@hapi/joi');
const { request } = require('express');

const validateLocation = (request) =>{
    const createSchema = {
        name : joi.string().min(1).max(500).required(),
        type : joi.number().min(0).max(3).required(),
        capacity : joi.number().min(1).required()
    };
    return joi.validate(request,createSchema);
}

const validateFaculty = (request) =>{
    const createSchema = {
        name : joi.string().min(1).max(500).required(),
        departments : joi.array().items(joi.number())
    };
    return joi.validate(request,createSchema);
}

const validateDepartment = (request) =>{
    const createSchema = {
        name : joi.string().min(1).max(500).required(),
        members : joi.array().items(joi.number()),
        hodID : joi.number(),
    };
    return joi.validate(request,createSchema);
}

const validateAddStaffMember = (request)=>{
    const addSchema ={
        name : joi.string().min(1).max(500).required(),
        email :joi.string().email().required(),
        type : joi.number().integer().min(0).max(1).required(),
        dayOff :request.type == 1? joi.string().valid('saturday').required():
        joi.string().valid('saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday').required(),
        gender : joi.string().valid('male', 'female').required(),
        officeID :joi.number().integer().required(),
        extraInfo : joi.array(),
        salary:joi.number().min(4000).required(),
        //facultyName: request.type == 0? joi.string().required():joi.string(),
        departmentID: request.type == 0? joi.number().integer().required():joi.number().integer(),
       // courses: request.type == 0 ? joi.array()
        memberType:request.type == 0? joi.number().integer().valid(0,3):joi.number()
    };
    return joi.validate(request, addSchema);
}

const validateCourse_hr = (request)=>{
    const addSchema ={
        name : joi.string().min(1).max(500).required(),
       // coordinatorID : joi.number().integer(), // TO BE ADDED IN validateCourse_instructor
        code : joi.string().min(1).max(500).required(),
        // coverage : joi.number(),
        scheduleID : joi.number().integer(),
        //teachingStaff : joi.array().items(joi.number()), //Array[staffID] // TO BE ADDED IN validateCourse_instructor
        department : joi.array().items(joi.number()), //Array[departmentID]
        description : joi.string(),
    };
    return joi.validate(request, addSchema);
}
module.exports = {
    validateLocation,
    validateFaculty,
    validateDepartment,
    validateAddStaffMember,
    validateCourse_hr,
};