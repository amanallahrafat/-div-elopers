const express = require('express');
const hrRouter = require('./Routes/hr.js');
const staffMemberRouter = require('./Routes/staffMember.js');

const courseInstructorRouter = require('./Routes/courseInstructor.js');
const courseCoordinatorRouter = require('./Routes/courseCoordinator.js');


const app = express();
app.use(express.json());


app.use('/', staffMemberRouter);

app.use('/hr', hrRouter);
app.use('/ci', courseInstructorRouter);

app.use('/cc', courseCoordinatorRouter);

module.exports = app;