const joi = require('@hapi/joi');

const validateDayOff = (request) =>{
    const createSchema = {
        newDayOff: joi.string().valid('saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday').required(),
        msg: joi.string()
    };
    return joi.validate(request,createSchema);
}

module.exports = {
    validateDayOff,
};