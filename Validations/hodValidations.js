const joi = require('@hapi/joi');
const assignInstructorValidator = (request) =>{
    const createSchema = {
       instructorID: joi.number().integer(),
       courseID : joi.number().integer()
    };
    return joi.validate(request,createSchema);
}

module.exports={
    assignInstructorValidator,
}