const Staff_Member = require('./Models/Users/Staff_Member.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = "jkanbvakljbefjkawkfew";

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

app.post('/init', async(req, res)=>{
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash("123456", salt);
    const hr = new Staff_Member({name: "firstHR", ID:0 , password: hashedPass, email: "HR@guc.com", type: 1, dayOff: "saturday", gender: "male", salary: 8000});
    await hr.save();
    return res.send("HR added successfully");
})

module.exports = app ;

