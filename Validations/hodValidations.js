const joi = require('@hapi/joi');
const assignInstructorValidator = (request) =>{
    const createSchema = {
       instructorID: joi.number().integer(),
       courseID : joi.number().integer()
    };
    return joi.validate(request,createSchema);
}

const requestResponseValidation = (request)=>{
    console.log(typeof request.response, request.response)
    const updateSchema = {
        response:joi.number().integer().min(0).max(1).required()
        ,
        msg:joi.string()
    }
    return joi.validate(request, updateSchema);
}


module.exports={
    assignInstructorValidator,
    requestResponseValidation
}