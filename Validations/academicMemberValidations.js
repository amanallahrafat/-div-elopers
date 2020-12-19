const joi = require('@hapi/joi');

const validateDayOff = (request) =>{
    const createSchema = {
        newDayOff: joi.string().valid('saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday').required(),
        msg: joi.string()
    };
    return joi.validate(request,createSchema);
}

const validateReplacementRequest = (request) =>{
    const createSchema = {
        requestedDate : joi.number().required(),
        replacementID : joi.number().required(), 
        courseID : joi.number().required(), 
        slotID : joi.number().required()
    };
    return joi.validate(request,createSchema);
}

module.exports = {
    validateDayOff,validateReplacementRequest,
};