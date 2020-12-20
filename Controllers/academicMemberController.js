const Annual_Leave_Request = require('../Models/Requests/Annual_Leave_Request.js');
const Slot_Linking_Request = require('../Models/Requests/Slot_Linking_Request.js');
const Change_Day_Off_Request = require("../Models/Requests/Change_Day_Off_Request.js");
const Accidental_Leave_Request = require('../Models/Requests/Accidental_Leave_Request.js');
const Compensation_Leave_Request = require('../Models/Requests/Compensation_Leave_Request.js');
const Maternity_Leave_Request = require('../Models/Requests/Maternity_Leave_Request.js');
const Replacement_Request = require('../Models/Requests/Replacement_Request.js');
const Sick_Leave_Request = require('../Models/Requests/Sick_Leave_Request');
const Course_Schedule = require('../Models/Academic/Course_Schedule.js');
const Academic_Member = require('../Models/Users/Academic_Member.js');
const Course = require('../Models/Academic/Course.js');
const Department = require('../Models/Academic/Department.js');
const validator = require('../Validations/academicMemberValidations');
const extraUtils = require('../utils/extraUtils.js');
const Notification = require('../Models/Others/Notification.js');

// {replacementID, courseID, slotID , requestedDate}
// UNCOMPLETED TESTING
const sendReplacementRequest = async (req, res) =>{
    const {ID, type}  = req.header.user;
    const courseID = req.body.courseID;
    const replacementID = req.body.replacementID;
    const slotID = req.body.slotID;
    if( requestedDate == null )
        return res.status(400).send("Requested date is required !");
    const replacedCourse = (await Course_Schedule.find({ID: courseID}));
    if(replacedCourse == null)
        return res.status(404).send("The requested course was not found");
    const replacedSlot = replacedCourse.slots.filter((elm) => elm.ID == slotID);
    if(replacedSlot == null)
        return res.status(404).send("The requested slot was not found");
    if((await Academic_Member.find({ID : replacementID})) == null)
        return res.status(404).send("The replacement member was not found");
    if((await Academic_Member.findOne({ID : ID})).departmentID != (await Academic_Member.findOne({ID : replacementID})).departmentID)
        return res.status(400).send("you cannot be replaced by a member does not belong to your department");
    const course = await Course.findOne({ID : courseID});
    if((course.teachingStaff.includes(ID) ^ course.instructor.includes(ID)) &&
         (course.teachingStaff.includes(replacementID) ^ course.instructor.includes(replacementID)))
         return res.status(400).send("you canot be replaced by a member does not teach the same course");
    if(extraUtils.getDifferenceInDays(requestedDate,Date.now()) <= 0)
        return res.status(400).send("The requested date already passed !");
    const coursesSchedules = await Course_Schedule.find();
    for(const coursesSchedule of coursesSchedules){
        const slots = coursesSchedule.slots;
        for(const slot of slots){
            if(slot.slotNumber == replacedSlot.slotNumber && slot.instructor == replacedSlot.instructor &&
                replacedSlot.day == slot.day)
                return res.status(403).send("The request is not allowed as the replacement member has a slot in the same time");
        }
    }
    const requests = await Replacement_Request.find();
    const replacement_request = new Replacement_Request({
        ID : getMaxSlotID(requests) + 1,
        senderID : ID,
        receiverID : replacementID,
        submissionDate : Date.now(),
        requestedDate : requestedDate,
        slotID : slotID,
        courseID: courseID,
        status: "pending"
    });
    await replacement_request.save();
    res.send("The replacement request has been sent sucessfully !");
}
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

//{slotID , CourseID}
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
const getAllNotifications = async (req, res) =>{
    const {ID, type} = req.header.user;
    res.send(await Notification.find({receiverID : ID}));
}
//{view : 0}
//all : 0 , accepted : 1, rejected : 2, pending : 3.
const viewAllRequests = async(req, res) => {
const {ID, type} = req.header.user;
let result = [];
if(req.params.view == 0){
    result.push(await Accidental_Leave_Request.find({senderID : ID}));
    result.push(await Annual_Leave_Request.find({senderID : ID}));
    result.push(await Change_Day_Off_Request.find({senderID : ID}));
    result.push(await Compensation_Leave_Request.find({senderID : ID}));
    result.push(await Maternity_Leave_Request.find({senderID : ID}));
    result.push(await Replacement_Request.find({senderID : ID}));
    result.push(await Sick_Leave_Request.find({senderID : ID}));
    result.push(await Slot_Linking_Request.find({senderID : ID}));
    return res.send(result);
}else if(req.params.view == 1){
    result.push(await Accidental_Leave_Request.find({senderID : ID, status : "accepted"}));
    result.push(await Annual_Leave_Request.find({senderID : ID, status : "accepted"}));
    result.push(await Change_Day_Off_Request.find({senderID : ID, status : "accepted"}));
    result.push(await Compensation_Leave_Request.find({senderID : ID, status : "accepted"}));
    result.push(await Maternity_Leave_Request.find({senderID : ID, status : "accepted"}));
    result.push(await Replacement_Request.find({senderID : ID, status : "accepted"}));
    result.push(await Sick_Leave_Request.find({senderID : ID, status : "accepted"}));
    result.push(await Slot_Linking_Request.find({senderID : ID, status : "accepted"}));
    return res.send(result);
}else if(req.params.view == 2){
    result.push(await Accidental_Leave_Request.find({senderID : ID, status : "rejected"}));
    result.push(await Annual_Leave_Request.find({senderID : ID, status : "rejected"}));
    result.push(await Change_Day_Off_Request.find({senderID : ID, status : "rejected"}));
    result.push(await Compensation_Leave_Request.find({senderID : ID, status : "rejected"}));
    result.push(await Maternity_Leave_Request.find({senderID : ID, status : "rejected"}));
    result.push(await Replacement_Request.find({senderID : ID, status : "rejected"}));
    result.push(await Sick_Leave_Request.find({senderID : ID, status : "rejected"}));
    result.push(await Slot_Linking_Request.find({senderID : ID, status : "rejected"}));
    return res.send(result);
}else if(req.params.view == 3){
    result.push(await Accidental_Leave_Request.find({senderID : ID, status : "pending"}));
    result.push(await Annual_Leave_Request.find({senderID : ID, status : "pending"}));
    result.push(await Change_Day_Off_Request.find({senderID : ID, status : "pending"}));
    result.push(await Compensation_Leave_Request.find({senderID : ID, status : "pending"}));
    result.push(await Maternity_Leave_Request.find({senderID : ID, status : "pending"}));
    result.push(await Replacement_Request.find({senderID : ID, status : "pending"}));
    result.push(await Sick_Leave_Request.find({senderID : ID, status : "pending"}));
    result.push(await Slot_Linking_Request.find({senderID : ID, status : "pending"}));
    return res.send(result);
}
    res.status(403).send("The required filer is not a valid one");
}



//This whole part was not tested
//parameters of the request is the ID of the request to be cancelled
//We only change if it's still pending 
const cancelChangeDayOffRequest=async(req, res)=>{
    const {ID,type} = req.header.user;
    const reqID = parseInt(req.params.ID);
    const request = await Change_Day_Off_Request.findOne({ID:reqID});
    if(request == null)
        return res.status(400).send("This request doesn't exist");
    if(ID != request.senderID){
        return res.status(400).send("You didn't send this request");
    }     
    if(request.status != "pending"){
        return res.status(400).send("This request can't be cancelled");
    }
    //Delete from the database 
    await Change_Day_Off_Request.deleteOne({ID:reqID});
    return res.send("The change day off request was cancelled successfully");
}
const cancelCompensationLeaveRequest = async(req, res)=>{
    const {ID,type} = req.header.user;    
    const reqID = parseInt(req.params.ID);
    const request = await Compensation_Leave_Request.findOne({ID:reqID});
    if(request == null)
        return res.status(400).send("This request doesn't exist");
    if(ID != request.senderID){
        return res.status(400).send("You didn't send this request");
    }    
    if(request.status == "rejected"){
        return res.send("This request was rejected");
    }
    if(request.status == "pending"){
        await Compensation_Leave_Request.deleteOne({ID:reqID});
        return res.send("Compensation leave was deleted successfully");
    }
    //request is still pending
    if(new Date(Date.now()) > new Date(request.requestedDate)){
        return res.send("You can't cancel this request");
    }
    await Compensation_Leave_Request.deleteOne({ID:reqID});
    return res.send("Compensation leave was deleted successfully");
    
}
const cancelMaternityLeaveRequest = async(req, res)=>{
    const {ID,type} = req.header.user;    
    const reqID = parseInt(req.params.ID);
    const request = await Maternity_Leave_Request.findOne({ID:reqID});
    if(request == null)
        return res.status(400).send("This request doesn't exist");
    if(ID != request.senderID){
        return res.status(400).send("You didn't send this request");
    }    
    if(request.status == "rejected"){
        return res.send("This request was rejected");
    }
    if(request.status == "pending"){
        await Maternity_Leave_Request.deleteOne({ID:reqID});
        return res.send("Maternity leave was deleted successfully");
    }
    //request is still pending
    if(new Date() > request.startDate){
        return res.send("You can't cancel this request");
    }
    await Maternity_Leave_Request.deleteOne({ID:reqID});
    return res.send("Maternity leave was deleted successfully");

}
const cancelSickLeaveRequest = async(req, res)=>{
    const {ID,type} = req.header.user;    
    const reqID = parseInt(req.params.ID);
    const request = await Sick_Leave_Request.findOne({ID:reqID});
    if(request == null)
        return res.status(400).send("This request doesn't exist");
    if(ID != request.senderID){
        return res.status(400).send("You didn't send this request");
    }    
    if(request.status == "rejected"){
        return res.send("This request was rejected");
    }
    if(request.status == "pending"){
        await Sick_Leave_Request.deleteOne({ID:reqID});
        return res.send("Sick leave was deleted successfully");
    }
    //request is still pending
    if(new Date() > request.requestedDate){
        return res.send("You can't cancel this request");
    }
    await Sick_Leave_Request.deleteOne({ID:reqID});
    return res.send("Sick leave was deleted successfully");
}
const cancelReplacementRequest = async(req, res)=>{
    const {ID,type} = req.header.user;    
    const reqID = parseInt(req.params.ID);
    const request = await Replacement_Request.findOne({ID:reqID});
    if(request == null)
        return res.status(400).send("This request doesn't exist");
    if(ID != request.senderID){
        return res.status(400).send("You didn't send this request");
    }    
    if(request.status == "rejected"){
        return res.send("This request was rejected");
    }
    if(request.status == "pending"){
        await Replacement_Request.deleteOne({ID:reqID});
        return res.send("Replacement request was deleted successfully");
    }
    //request is still pending
    if(new Date() > request.requestedDate){
        return res.send("You can't cancel this request");
    }
    await Replacement_Request.deleteOne({ID:reqID});
    return res.send("Replacement request was deleted successfully");

}
module.exports = {
    sendSlotLinkingRequest,sendChangeDayOffRequest,
    getAllNotifications, viewAllRequests,
    sendReplacementRequest,
    cancelChangeDayOffRequest,
    cancelCompensationLeaveRequest,
    cancelMaternityLeaveRequest,
    cancelSickLeaveRequest,
    cancelReplacementRequest
}