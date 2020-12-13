const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = "jkanbvakljbefjkawkfew";
const Staff_Member = require('./Models/Users/Staff_Member.js');
const auth = require('./Authentication/auth.js');

const hrRouter = require('./Routes/hr.js');
const staffMemberRouter = require('./Routes/staffMember.js');

const app = express();

app.use(express.json());

app.post('/register',async (req,res)=>{
        // the salt number : recommended not to go above 14.
        const salt  = await bcrypt.genSalt(10);
        // always pass the body.passward as a string 
        //const hashedPass = await bcrypt.hash(req.body.password,salt);
        const hashedPass = await bcrypt.hash("team9",salt);
        const u = new Staff_Member({
            name : "sarah",
            ID : 12 ,
            email : "req.body.name",
            type : 0,
            password : hashedPass,
            dayOff :" req.body.name",
            gender : "req.body.name",
            officeID : 5,
            extraInfo : "req.body.name",
            salary : 1500,
            annualBalance : 0,
            accidentalLeaveBalance : 6
        });
        await u.save();
        res.send("Registeration Completed!");
})

app.use('/', staffMemberRouter);

app.use('/hr',hrRouter);

module.exports = app ;