const joi = require('@hapi/joi');
const { request } = require('express');

const validateLogin = (request) =>{
    const createSchema = {
        email: joi.string().email().required(),   
        password: joi.string().min(6).max(64).required()
    };
    return joi.validate(request,createSchema);
}

module.exports = {
    validateLogin,
};