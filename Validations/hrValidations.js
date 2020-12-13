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

module.exports = {
    validateLocation,
};