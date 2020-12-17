const express = require('express');
const courseInstructorController = require('../Controllers/courseInstructorController.js');
const courseInstructorRouter = express.Router();


courseInstructorRouter.get('/viewCourseCoverage/:courseID', courseInstructorController.viewCourseCoverage);
courseInstructorRouter.get('/viewSlotAssignment', courseInstructorController.viewSlotAssignment);


module.exports = courseInstructorRouter;