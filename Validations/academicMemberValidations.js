const joi = require('@hapi/joi');

const validateDayOff = (request) => {
    const createSchema = {
        msg: joi.string(),
        newDayOff: joi.string().valid('saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday').required(),
    };
    return joi.validate(request, createSchema);
}
const validateMaternityLeave = (request) => {
    const createSchema = {
        documents: joi.string().required(),
        startDate: joi.number().required(),
        endDate: joi.number().required(),
        msg: joi.string()
    };
    return joi.validate(request, createSchema);
}
const validateSickLeave = (request) => {
    const createSchema = {
        documents: joi.string().required(),
        requestedDate: joi.number().required(),
        msg: joi.string()
    };
    return joi.validate(request, createSchema);
}

const validateReplacementRequest = (request) => {
    const createSchema = {
        requestedDate: joi.number().required(),
        replacementID: joi.number().required(),
        courseID: joi.number().required(),
        slotID: joi.number().required()
    };
    return joi.validate(request, createSchema);
}

const validateAnnualLeaveRequest = (request) => {
    const createSchema = {
        requestedDate: joi.number().required(),
        msg: joi.string(),
    };
    return joi.validate(request, createSchema);
}

const validateCompensationRequest = (request) => {
    const createSchema = {
        absenceDate: joi.number().required(),
        requestedDate: joi.number().required(),
        msg : joi.string().required()
    };
    return joi.validate(request, createSchema);
}
const validateAccidentalRequest = (request) =>{
    const createSchema = {
        requestedDate: joi.number().required(),
        msg : joi.string()
    };
    return joi.validate(request, createSchema);
}
module.exports = {
    validateReplacementRequest,
    validateDayOff,
    validateMaternityLeave,
    validateSickLeave,
    validateAnnualLeaveRequest,
    validateCompensationRequest,
    validateAccidentalRequest
};