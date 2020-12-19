const joi = require('@hapi/joi');
const assignInstructorValidator = (request) =>{
    const createSchema = {
       instructorID: joi.number().integer(),
       courseID : joi.number().integer()
    };
    return joi.validate(request,createSchema);
}

const updateDayOffValidation = (request)=>{
    const updateSchema = {
        reponse:joi.number().integer().min(0).max(1)
    }
    return joi.validate(request, updateSchema);
}


module.exports={
    assignInstructorValidator,
    updateDayOffValidation
}