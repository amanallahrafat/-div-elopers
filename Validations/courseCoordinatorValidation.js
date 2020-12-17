const joi = require('@hapi/joi');

const validateSlot = (request) =>{
    const createSchema = {
        slotNumber: joi.number().min(1).max(5).required(),   
        day: joi.string().valid('saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday','friday').required(),
        locationID : joi.number().required()
    };
    return joi.validate(request,createSchema);
}

module.exports = {
    validateSlot,
};