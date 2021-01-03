const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = "jkanbvakljbefjkawkfew";
const Staff_Member = require('../Models/Users/Staff_Member.js');
const Academic_Member = require('../Models/Users/Academic_Member.js');
const BlackListedToken = require('../Models/Others/BlackListedToken.js');
const validator = require('../Validations/staffMemberValidations.js');
const mongoValidator = require('mongoose-validator');
const extraUtils = require('../utils/extraUtils');


const Accidental_Leave_Request = require('../Models/Requests/Accidental_Leave_Request.js');
const Annual_Leave_Request = require('../Models/Requests/Annual_Leave_Request.js');
const Change_Day_Off_Request = require('../Models/Requests/Change_Day_Off_Request.js');
const Compensation_Leave_Request = require('../Models/Requests/Compensation_Leave_Request.js');
const Maternity_Leave_Request = require('../Models/Requests/Maternity_Leave_Request.js');
const Sick_Leave_Request = require('../Models/Requests/Sick_Leave_Request.js');

const signIn = async (req, res) => {
    const { ID, type } = req.header.user;
    const staff_member = await Staff_Member.findOne({ ID: ID, type: type });
    if (staff_member.attendanceRecord.length != 0) {
        const lastRecord = staff_member.attendanceRecord[staff_member.attendanceRecord.length - 1];
        if (!lastRecord.signout)
            return res.status(400).send("Please sign out before signning in.");
    }
    staff_member.attendanceRecord.push({ status: 1, signin: Date.now() });

    staff_member.attendanceRecord.push({ status: 1, signin: Date.now(), signout: "" });
    await Staff_Member.updateOne({ ID: ID, type: type }, { attendanceRecord: staff_member.attendanceRecord });
    res.send("Sign in Sucessfully!");
}

const signOut = async (req, res) => {
    const { ID, type } = req.header.user;
    const staff_member = await Staff_Member.findOne({ ID: ID, type: type });
    if (staff_member.attendanceRecord.length == 0) {
        return res.status(400).send("Please sign out before signning in.");

    }
    const lastRecord = staff_member.attendanceRecord[staff_member.attendanceRecord.length - 1];
    if ((lastRecord.signout || !lastRecord.signin))
        return res.status(400).send("Please sign in before signning in.");
    lastRecord.signout = Date.now();
    await Staff_Member.updateOne({ ID: ID, type: type }, { attendanceRecord: staff_member.attendanceRecord });
    res.send("Sign out Sucessfully!");
}

const login = async (req, res) => {
    const isValid = validator.validateLogin(req.body);
    if (isValid.error)
        return res.status(400).send({ error: isValid.error.details[0].message });
    const u = await Staff_Member.findOne({ email: req.body.email });
    if (!u)
        return res.status(403).send("The user does not exist. The login falied!");
    const verify = await bcrypt.compare(req.body.password, u.password);
    if (!verify)
        return res.status(403).send("Wrong Password");
    // param1: payload (params needed for handeling the user requests)
    // param2 : secret Key (random string)
    const token = jwt.sign({ ID: u.ID, type: u.type }, key);
    let academicMemberType = undefined;
    if (u.type == 0) {
        const academicMember = await Academic_Member.findOne({ ID: u.ID });
        academicMemberType = academicMember.type;
    }
    res.header('auth-token', token).send({
        msg: "Login Successfully!",
        type: u.type,
        ID : u.ID,
        academicMemberType: academicMemberType,
    });
}

const logout = async (req, res) => {
    const token = req.header("auth-token");
    const blackListedToken = new BlackListedToken({
        token: token
    });
    await blackListedToken.save();
    res.send("Loged out Successfully!");
}

const viewProfile = async (req, res) => {
    const { ID, type } = req.header.user;
    const profile = await Staff_Member.findOne({ ID: ID, type: type });
    delete profile['_doc'].password;
    delete profile['_doc']['_id'];
    delete profile['_doc']['__v'];

    profile.attendanceRecord = profile.attendanceRecord.filter((x) => { return (x.signin && x.signout) }).map((x) => {
        x.signin = new Date(x.signin);
        x.signout = new Date(x.signout); return x;
    });
    const office=(await extraUtils.getOfficeByID(profile.officeID));
    if(office)
    profile['_doc'].officeID = office.name;
    res.send(profile);
}

const resetPassword = async (req, res) => {
    const { ID, type } = req.header.user;
    const staffMember = await Staff_Member.findOne({ ID: ID, type: type });
    const verify = await bcrypt.compare(req.body.oldPassword, staffMember.password);
    if (!verify)
        return res.status(400).send("please enter the old password correctly");
    if (req.body.newPassword.length < 6)
        return res.status(400).send("your password is less than 6 characters");

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.newPassword, salt);
    await Staff_Member.updateOne({ ID: ID, type: type }, { password: hashedPass });
    res.send("password has changed successfully");
}


const viewAttendance = async (req, res) => {
    const { ID, type } = req.header.user;
    const staff_member = await Staff_Member.findOne({ ID: ID, type: type });
    const attendanceArray = staff_member.attendanceRecord;
    let responseArray = [];
    for (const record of attendanceArray) {
        record.status = (record.status == 1) ? "attended" : "absent";
        if (record.signin && record.signout)
            if (!req.body.month || ((req.body.month - 1) == (new Date(record.signin)).getMonth())) {
                record.signin = new Date(record.signin);
                record.signout = new Date(record.signout);
                responseArray.push(record);
            }
    }
    res.send(responseArray);
}

const viewMissingHours = async (req, res) => {
    const { ID, type } = req.header.user;
    const staff_member = await Staff_Member.findOne({ ID: ID, type: type });

    const accidentalLeaves = await Accidental_Leave_Request.find();
    const annualLeaves = await Annual_Leave_Request.find();

    const compensationLeaves = await Compensation_Leave_Request.find();

    const maternalityLeaves = await Maternity_Leave_Request.find();
    const sickLeaves = await Sick_Leave_Request.find();

    const missingHours = extraUtils.getMissingHours(staff_member, accidentalLeaves, annualLeaves, compensationLeaves, maternalityLeaves, sickLeaves);
    if (missingHours > 0) {
        res.send("the missing hours till today are ".concat(missingHours));
    } else {
        res.send("you have extra hours till today ".concat(-1 * missingHours));
    }


}



const updateMyProfile = async (req, res) => {
    const { ID, type } = req.header.user;
    const member = await Staff_Member.findOne({ ID: ID, type: type });
    if (type == 0) {
        if (req.body.salary != undefined || req.body.officeID != undefined) {
            return res.status(400).send("academic member can't update his/her salary or/and office")
        }
    }
  
    if (req.body.name != undefined || req.body.ID != undefined || req.body.type != undefined || req.body.dayOff != undefined ||
        req.body.attendanceRecord != undefined || req.body.annualBalance != undefined || req.body.accidentalLeaveBalance != undefined) {
        return res.status(400).send("you can't update any of your name,ID,type,dayOff,attendance record,annualBalance,accidentalLeaveBlance");

    }
    let obj = {};
  
    if (req.body.email == undefined) {
        obj.email = member.email;

    } else {
        const users = await Staff_Member.find({ email: req.body.email });
        if (users.length != 0 && users[0].ID != ID && users[0].type != type) {
            return res.status(400).send("This email already exists. Emails have to be unique");
        }


        obj.email = req.body.email;

    }
    if (req.body.gender == undefined) obj.gender = member.gender;
    else obj.gender = req.body.gender;

    obj.officeID = (req.body.officeID == undefined) ? member.officeID : req.body.officeID;
    obj.extraInfo = (req.body.extraInfo == undefined) ? member.extraInfo : req.body.extraInfo;

    obj.salary = (req.body.salary == undefined) ? member.salary : req.body.salary;
    const isValid = validator.validateUpdateProfile(obj);

    if (isValid.error){
        return res.status(400).send({ error: isValid.error.details[0].message });
    }

    await Staff_Member.updateOne({ ID: ID, type: type }, obj);
    res.send("profile Updated Successfully!");
}


const viewMissingDays = async (req, res) => {
    const { ID, type } = req.header.user;
    const staff_member = await Staff_Member.findOne({ ID: ID, type: type });


    const accidentalLeaves = await Accidental_Leave_Request.find();
    const annualLeaves = await Annual_Leave_Request.find();

    const compensationLeaves = await Compensation_Leave_Request.find();

    const maternalityLeaves = await Maternity_Leave_Request.find();
    const sickLeaves = await Sick_Leave_Request.find();

    const missingHours = await extraUtils.getMissingDays(staff_member, accidentalLeaves, annualLeaves, compensationLeaves, maternalityLeaves, sickLeaves);


    res.send(missingHours);
}


module.exports = {

    login, logout,
    signIn, signOut,
    viewProfile, resetPassword,
    viewAttendance, viewMissingHours, updateMyProfile, viewMissingDays
}