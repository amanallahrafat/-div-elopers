const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = "jkanbvakljbefjkawkfew";
const Staff_Member = require('./Models/Users/Staff_Member.js');
const auth = require('./Authentication/authenticate.js');

const hrRouter = require('./Routes/hr.js');
const staffMemberRouter = require('./Routes/staffMember.js');
const courseInstructorRouter = require('./Routes/courseInstructor.js');

const app = express();

app.use(express.json());



app.use('/', staffMemberRouter);

app.use('/hr', hrRouter);
app.use('/ci', courseInstructorRouter);

module.exports = app;