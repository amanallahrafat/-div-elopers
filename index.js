const express = require('express');
const hrRouter = require('./Routes/hr.js');
const hodRouter = require('./Routes/hod.js');

const staffMemberRouter = require('./Routes/staffMember.js');
const courseInstructorRouter = require('./Routes/courseInstructor.js');
const courseCoordinatorRouter = require('./Routes/courseCoordinator.js');
const academicMemberRouter = require('./Routes/academicMember.js');

const app = express();
app.use(express.json());


app.use('/', staffMemberRouter);
app.use('/hr', hrRouter);
app.use('/ci', courseInstructorRouter);
app.use('/cc', courseCoordinatorRouter);
app.use('/hod',hodRouter);
app.use('/ac', academicMemberRouter);

module.exports = app ;

