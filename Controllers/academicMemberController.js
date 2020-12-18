const Annual_Leave_Request = require('../Models/Requests/Accidental_Leave_Request.js')
const Course_Schedule = require('../Models/Academic/Course_Schedule.js');
const Replacement_Request = require('../Models/Requests/Replacement_Request.js');
const Academic_Member = require('../Models/Users/Academic_Member.js');
const Slot_Linking_Request = require('../Models/Requests/Slot_Linking_Request');
const Course = require('../Models/Academic/Course.js');
const Department = require('../Models/Academic/Department.js');
const Change_Day_Off_Request = require("../Models/Requests/Change_Day_Off_Request.js");
const validator = require('../Validations/academicMemberValidations');


// {replacementID, courseID, slotID}
// const sendReplacementRequest = async (req, res) =>{
//     const {ID, type}  = req.header.user;
//     const courseID = req.body.courseID;
//     const replacementID = req.body.replacementID;
//     const slotID = req.body.slotID;
//     const replacedCourse = (await Course_Schedule.find({ID: courseID}));
//     if(replacedCourse == null)
//         return res.status(404).send("The requested course was not found");
//     const replacedSlot = replacedCourse.slots.filter((elm) => elm.ID == slotID);
//     if(replacedSlot == null)
//         return res.status(404).send("The requested slot was not found");
//     if((await Academic_Member.find({ID : replacementID})) == null)
//         return res.status(404).send("The replacement member was not found");
//     const coursesSchedules = await Course_Schedule.find();
//     for(const coursesSchedule of coursesSchedules){
//         const slots = coursesSchedule.slots;
//         for(const slot of slots){
//             if(slot.slotNumber == replacedSlot.slotNumber && slot.instructor == replacedSlot.instructor &&
//                 replacedSlot.day == slot.day)
//                 return res.status(403).send("The request is not allowed as the replacement member has a slot in the same time");
//         }
//     }
//     const replacement_requests = await Replacement_Request.find({}) 

// }
//{slotID , CourseID}
const getMaxSlotID = (requests) => {
    let max = 0;
    if (requests.length != 0) {
        max = Math.max.apply(Math, requests.map(obj => obj.ID));
    }
    return max;
}
const getMaxChangeDayOffRequest = (req) =>{
    max = 0;
    if(req.length != 0){
        max = Math.max.apply(Math, req.map(obj => obj.ID));
    }
    return max;
}
const sendSlotLinkingRequest = async (req, res) =>{
    const {ID, type} = req.header.user;
    const courseID = req.body.courseID;
    const slotID = req.body.slotID;
    const course = await Course.findOne({ID: courseID});
    if(course  == null)
        return res.status(404).send("The requested course was not found");
    if(!course.instructor.includes(ID) && !course.teachingStaff.includes(ID))
        res.status(403).send("You are not part of the course teaching staff")
    const course_schedule = await Course_Schedule.findOne({ID : courseID})
    if(course_schedule == null)
        res.status(404).send("The requested course does not exist");
    const slot = course_schedule.slots.filter((elm) => elm.ID == slotID);
    if(slot == null)
        return res.status(404).send("The requested slot was not found");
    if(slot.instructor != null)
        return res.status(400).send("The requested slot is already assigned to another academic member");
    const requests = await Slot_Linking_Request.find();
    const slotLinkingRequest = new Slot_Linking_Request({
        ID : getMaxSlotID(requests) + 1,
        senderID : ID,
        receiverID : course.coordinatorID,
        courseID : courseID,
        slotID : slotID,
        status : "pending"
    });
    await slotLinkingRequest.save();
    res.send("The request has been sent sucessfully");
}
// {newdayoff , msg}
const sendChangeDayOffRequest = async (req, res) =>{
    const {ID, type} = req.header.user;
    const departmentID = (await Academic_Member.findOne({ID : ID})).departmentID;
    const department = await Department.findOne({ID:departmentID});
    const newDayOff = req.body.newDayOff;
    let message = req.body.msg;
    if(department == null)
        return res.status(403).send("The user does not belong to a department yet");
    const hodID = department.hodID;
    if(hodID == null)
        return res.status(404).send("The department does not have a head yet, you can't send this request");
    if(message == null) 
        message = "";
    const isValid = validator.validateDayOff(req.body);
    console.log(req.body);
    if(isValid.error)
        return res.status(400).send({ error: isValid.error.details[0].message });
    const request = await Change_Day_Off_Request.find();
    const changeDayOffRequest = new Change_Day_Off_Request({
        ID : getMaxChangeDayOffRequest(request) + 1,
        senderID : ID,
        receiverID : hodID,
        msg : message,
        targetDayOff : newDayOff,
        submissionDate : Date.now(),
        status: "pending"
    });
    await changeDayOffRequest.save();
    return res.send("The change day request is added successfully.");
}



module.exports = {
    sendSlotLinkingRequest,sendChangeDayOffRequest,
}