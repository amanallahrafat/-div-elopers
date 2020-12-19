const joi = require('@hapi/joi');

const validateLogin = (request) =>{
    const createSchema = {
        email: joi.string().email().required(),   
        password: joi.string().min(6).max(64).required()
    };
    return joi.validate(request,createSchema);
}

const validateUpdateProfile = (request)=>{
    const addSchema ={
        email :joi.string().email().required(),
        gender : joi.string().valid('male', 'female').required(),
        officeID :joi.number().integer(),
        extraInfo : joi.array(),
        salary:joi.number().min(4000).required(),
    };
    return joi.validate(request, addSchema);
}

module.exports = {
    validateLogin,validateUpdateProfile,
};