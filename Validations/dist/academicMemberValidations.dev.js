"use strict";

var joi = require('@hapi/joi');

var validateDayOff = function validateDayOff(request) {
  var createSchema = {
    newDayOff: joi.string().valid('saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday').required(),
    msg: joi.string()
  };
  return joi.validate(request, createSchema);
};

var validateMaternityLeave = function validateMaternityLeave(request) {
  var createSchema = {
    documents: joi.string().required(),
    startDate: joi.number().required(),
    endDate: joi.number().required(),
    msg: joi.string()
  };
  return joi.validate(request, createSchema);
};

var validateSickLeave = function validateSickLeave(request) {
  var createSchema = {
    documents: joi.string().required(),
    requestedDate: joi.number().required(),
    msg: joi.string()
  };
  return joi.validate(request, createSchema);
};

var validateReplacementRequest = function validateReplacementRequest(request) {
  var createSchema = {
    requestedDate: joi.number().required(),
    replacementID: joi.number().required(),
    courseID: joi.number().required(),
    slotID: joi.number().required()
  };
  return joi.validate(request, createSchema);
};

var validateAnnualLeaveRequest = function validateAnnualLeaveRequest(request) {
  var createSchema = {
    requestedDate: joi.number().required(),
    msg: joi.string()
  };
  return joi.validate(request, createSchema);
};

module.exports = {
  validateReplacementRequest: validateReplacementRequest,
  validateDayOff: validateDayOff,
  validateMaternityLeave: validateMaternityLeave,
  validateSickLeave: validateSickLeave,
  validateAnnualLeaveRequest: validateAnnualLeaveRequest
};