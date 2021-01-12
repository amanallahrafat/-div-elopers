const Staff_Member = require('./Models/Users/Staff_Member.js');
const bcrypt = require('bcryptjs');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const key = "jkanbvakljbefjkawkfew";

const express = require('express');


const hrRouter = require('./Routes/hr.js');
const hodRouter = require('./Routes/hod.js');
const staffMemberRouter = require('./Routes/staffMember.js');
const courseInstructorRouter = require('./Routes/courseInstructor.js');
const courseCoordinatorRouter = require('./Routes/courseCoordinator.js');
const academicMemberRouter = require('./Routes/academicMember.js');

require("dotenv").config();


const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "client", "build")))


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

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

module.exports = app ;

