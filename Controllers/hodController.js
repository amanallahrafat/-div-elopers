const Course_Schedule = require('../Models/Academic/Course_Schedule.js');
const Course = require('../Models/Academic/Course.js');
const Department = require('../Models/Academic/Department.js');
const Faculty = require('../Models/Academic/Faculty.js');
const Location = require('../Models/Others/Location.js');
const Notification = require('../Models/Others/Notification.js');
const Accidental_Leave_Request = require('../Models/Requests/Accidental_Leave_Request.js');
const Annual_Leave_Request = require('../Models/Requests/Annual_Leave_Request.js');
const Change_Day_Off_Request = require('../Models/Requests/Change_Day_Off_Request.js');
const Compensation_Leave_Request = require('../Models/Requests/Compensation_Leave_Request.js');
const Maternity_Leave_Request = require('../Models/Requests/Maternity_Leave_Request.js');
const Sick_Leave_Request = require('../Models/Requests/Sick_Leave_Request.js');
const Academic_Member = require('../Models/Users/Academic_Member.js');
const Staff_Member = require('../Models/Users/Staff_Member.js');
const checkings = require('../utils/checkings.js');
const removeCascade = require('../utils/removeCascade.js');
const createCascade = require('../utils/createCascade.js');
const mongoose = require('mongoose');

const validator = require('../Validations/hodValidations.js');
const mongoValidator = require('mongoose-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findOne } = require('../Models/Academic/Course_Schedule.js');
//const { delete } = require('../Routes/hod.js');
//const { updateOne } = require('../Models/Academic/Course_Schedule.js');
const key = "jkanbvakljbefjkawkfew";

const assignCourseInstructor = async(req, res)=>{ // ADD check that the course doesn't exit and that it has no departments
    const isValid = validator.assignInstructorValidator(req.body);
    if(isValid.error)
        return res.status(400).send({error : isValid.error.details[0].message});
    
    if(!await checkings.isAcademicMember(req.body.instructorID)){
        return res.status(400).send("Course instructor has to be an academic member");
    }
    //Check that the course is in the department of this HOD 
    //Get the id of the HOD from the token
    const {ID, type} = req.header.user;
    if(!await checkings.isHOD(ID)){
        return res.status(400).send("You have to be a head of department to do this");
    }
    const academic_member = await Academic_Member.findOne({ID:ID});
    //Get the departmentID of the HOD
    const hodDept = academic_member.departmentID; 
    const course = await Course.findOne({ID: req.body.courseID}); // Course to assign the instructor for
    if(!course)
        return res.status(400).send("This course doesn't exit");
    if(!course.department.includes(hodDept)){
        return res.status(400).send("You can't assign an instructor for a course that it's not in your department");
    }    
    //Change this member to be an instructor (type = 1)
    const courseInstructor = await Academic_Member.findOne({ID: req.body.instructorID});
    if(courseInstructor.type != 0) // Don't change it if this academic member is a hod
        courseInstructor.type = 1;
    await Academic_Member.updateOne({ID: req.body.instructorID}, courseInstructor);
    // Change the instructor of the course
    if(!course.instructor)
        course.instructor = [];    
    course.instructor.push(req.body.instructorID);       
    await Course.updateOne({ID:req.body.courseID}, course);
    return res.send("Course instructor assigned successfully");
}

//Bayzaaaaaaa
const updateCourseInstructor = async(req, res)=>{
    // Check that the input array only contains academic members 
    if(!await checkings.isAcademicMember(req.body.instructorID)){
        return res.status(400).send("Course instructor has to be an academic member");
    }
    //Check that the course is in the department of this HOD 
    //Get the id of the HOD from the token
    const {ID, type} = req.header.user;
    if(!await checkings.isHOD(ID)){
        return res.status(400).send("You have to be a head of department to do this");
    }
    const academic_member = await Academic_Member.findOne({ID:ID});
    //Get the departmentID of the HOD
    const hodDept = academic_member.departmentID; 
    const course = await Course.findOne({ID: req.body.courseID}); // Course to assign the instructor for
    if(!course)
        return res.status(400).send("This course doesn't exit");
    if(!course.department.includes(hodDept)){
        return res.status(400).send("You can't assign an instructor for a course that it's not in your department");
    }  
    //Remove the instructor from the instructors of the course
    course.instructor = course.instructor.filter(function(value){return value != req.body.instructorID});   
    
    //insert the new one in the array of instructors of the course and set its type to be 1
    if(!course.instructor.includes(req.body.instructorID)){
        const courseSchedule = await Course_Schedule.findOne({ID: course.scheduleID});
        if(courseSchedule && courseSchedule.slots){
            for(const curSlot of courseSchedule.slots){
                if(curSlot.instructor == req.body.instructorID){
                    curSlot.instructor = undefined;
                    delete(curSlot.instructor);
                }
            }
        }
        await Course_Schedule.updateOne({ID:course.scheduleID}, courseSchedule)
        course.instructor.push(req.body.instructorID);
        //Set the type of the new instructor to be 1
        const academic_member2 = await Academic_Member.findOne({ID:req.body.instructorID})
        //Change its type if he is not the head of department
        if(academic_member2.type != 0)
            academic_member2.type = 1; // course instructor
        console.log(academic_member2)
        // console.log(curInstructorID)
        await Academic_Member.updateOne({ID: req.body.instructorID}, academic_member2);
    }
    await Course.updateOne({ID:req.body.courseID}, course);
    return res.send("Update was successfull");
}


const deleteCourseInstructor = async(req, res)=>{
    // Check that the input array only contains academic members 
    if(!await checkings.isAcademicMember(req.body.instructorID)){
        return res.status(400).send("Course instructor has to be an academic member");
    }
    //Check that the course is in the department of this HOD 
    //Get the id of the HOD from the token
    const {ID, type} = req.header.user;
    if(!await checkings.isHOD(ID)){
        return res.status(400).send("You have to be a head of department to do this");
    }
    const academic_member = await Academic_Member.findOne({ID:ID});
    //Get the departmentID of the HOD
    const hodDept = academic_member.departmentID; 
    const course = await Course.findOne({ID: req.body.courseID}); // Course to assign the instructor for
    if(!course)
        return res.status(400).send("This course doesn't exit");
    if(!course.department.includes(hodDept)){
        return res.status(400).send("You can't delete an instructor for a course that it's not in your department");
    }  

    course.instructor = course.instructor.filter(function(value){return value != req.body.instructorID})
    const courseSchedule = await Course_Schedule.findOne({ID: course.scheduleID});
    if(courseSchedule && courseSchedule.slots){
        for(const curSlot of courseSchedule.slots){
            if(curSlot.instructor == req.body.instructorID){
                curSlot.instructor = undefined;
                delete(curSlot.instructor);
            }
        }
    }
    await Course_Schedule.updateOne({ID:course.scheduleID}, courseSchedule);
    await Course.updateOne({ID:req.body.courseID}, course);
    return res.send("Course instructor was deleted successfully")
}

const viewDepartmentMembers = async(req, res)=>{
    const {ID, type} = req.header.user;
    if(!await checkings.isHOD(ID)){
        return res.status(400).send("You have to be a head of department to do this");
    }
    const hod = await Academic_Member.findOne({ID:ID});
    const deptID = hod.departmentID;
    let totalArray = [];
    const departmentAcademicMembers = await Academic_Member.find({departmentID:deptID});
    for(const curMem of departmentAcademicMembers){
        curEntry = await createMemEntry(curMem)
        totalArray.push(curEntry)
    }
    return res.send(totalArray)
}

const viewDepartmentMembersByCourse = async(req, res)=>{
    const {ID, type} = req.header.user;
    if(!await checkings.isHOD(ID)){
        return res.status(400).send("You have to be a head of department to do this");
    }
    const hod = await Academic_Member.findOne({ID:ID});
    const deptID = hod.departmentID;
    let totalArray = [];
    const course = await Course.findOne({ID: req.params.courseID});
    if(!course)
        res.status(400).send("This course doesn't exist")
    if(!(course.department && course.department.includes(deptID))){
        return res.status(400).send("This course is not in your department");
    }
    if(course.teachingStaff)
        for(const curMemID of course.teachingStaff){
            const curMem = await Academic_Member.findOne({ID:curMemID});
            const curEntry = await createMemEntry(curMem);
            totalArray.push(curEntry);
        }
    if(course.instructor)
        for(const curMemID of course.instructor){
            const curMem = await Academic_Member.findOne({ID:curMemID});
            const curEntry = await createMemEntry(curMem);
            totalArray.push(curEntry);
        }    
    if(course.coordinatorID){
        const curMem = await Academic_Member.findOne({ID:course.coordinatorID});
        const curEntry = await createMemEntry(curMem);
        totalArray.push(curEntry);
    }
    return res.send(totalArray)    
}

const viewAllStaffDayOff = async(req, res)=>{
    const {ID, type} = req.header.user;
    if(!await checkings.isHOD(ID)){
        return res.status(400).send("You have to be a head of department to do this");
    }
    const hod = await Academic_Member.findOne({ID:ID});
    const deptID = hod.departmentID;
    let totalArray = [];
    const dept = await Department.findOne({ID:deptID})
    if(dept.members){
        for(const curMem of dept.members){
            console.log("the curMem is ")
            console.log(curMem)
            const curStaff = await Staff_Member.findOne({ID: curMem})
            const curEntry = {
                "name": curStaff.name,
                "id": "ac_" + curStaff.ID,
                "dayOff" : curStaff.dayOff
            }
            totalArray.push(curEntry)
        }
    }
    return res.send(totalArray)
}

const viewSingleStaffDayOff = async(req, res)=>{
    const {ID, type} = req.header.user;
    if(!await checkings.isHOD(ID)){
        return res.status(400).send("You have to be a head of department to do this");
    }
    const hod = await Academic_Member.findOne({ID:ID});
    const deptID = hod.departmentID;
    const dept = await Department.findOne({ID:deptID})
    if(!(dept.members && dept.members.includes(req.params.ID))){
        return res.status(400).send("This staff member is not in your department")
    }
    const curStaff = await Staff_Member.findOne({ID:req.params.ID});
    const entry = {"name": curStaff.name, "id": "ac_"+curStaff.ID, "day off": curStaff.dayOff}
    return res.send(entry)
}

const viewCourseTeachingAssignments = async(req, res)=>{
    const {ID, type} = req.header.user;
    if(!await checkings.isHOD(ID)){
        return res.status(400).send("You have to be a head of department to do this");
    }
    const hod = await Academic_Member.findOne({ID:ID});
    const deptID = hod.departmentID;
    const curCourse = await Course.findOne({ID:req.params.ID});
    if(!curCourse)
        return res.status(400).send("This course doesn't exist")

    if(!(curCourse.department && curCourse.department.includes(deptID)))
        return res.status(400).send("This course is not in your department")   
    
    const scheduleID = curCourse.scheduleID;
    if(!scheduleID)
        return res.status(400).send("This course doesn't have a schedule yet!")

    const curSchedule = await Course_Schedule.findOne({ID:scheduleID});
    if(!curSchedule.slots)
        return res.status(400).send("This schedule doesn't have any slots yet!")
    let slotsArray = [];
    for(const curSlot of curSchedule.slots){
        let slotInst = "Not yet assigned";
        if(curSlot.instructor){
            const curInst = await Staff_Member.findOne({ID:curSlot.instructor});
            slotInst = curInst.name
        }
        const curSubEntry = {"slot":curSlot, "staff member name": slotInst}
        slotsArray.push(curSubEntry)        
    }
    curEntry = {
        "course name" : curCourse.name,
        "course code": curCourse.code,
        "course slots": slotsArray
        } 
    return res.send(curEntry)
}

const viewCourseCoverage = async(req, res) => {
    const {ID, type} = req.header.user;
    if(!await checkings.isHOD(ID)){
        return res.status(400).send("You have to be a head of department to do this");
    }
    const hod = await Academic_Member.findOne({ID:ID});
    const deptID = hod.departmentID;
    const courseID = parseInt(req.params.ID);
    if (!await checkings.courseIDExists(courseID)) {
        return res.status(400).send("Course does not exist");
    }
    const course = await Course.findOne({ ID: courseID });
    if(!(course.department && course.department.includes(deptID)))
        return res.status(400).send("This course is not in your department") 
        
    const courseSchedule = await Course_Schedule.findOne({ ID: course.scheduleID });
    if (courseSchedule == null)
        return res.status(400).send("No schedule is set yet for the course");
    if (courseSchedule.slots.length == 0)
        return res.status(400).send("Course schedule has no slot entries yet");
    const filteredSlots = courseSchedule.slots.filter((s) => s.instructor != null);
    const coverage = filteredSlots.length / courseSchedule.slots.length;
    return res.send(JSON.stringify(coverage));
}


const createMemEntry = async(curMem)=>{
    const curStaff = await Staff_Member.findOne({ID: curMem.ID});
    const office = await Location.findOne({ID:curStaff.officeID, type:2})
    const dept = await Department.findOne({ID: curMem.departmentID})
    const curEntry = {
    "name": curStaff.name,
    "email": curStaff.email,
    "ID":"ac_"+curStaff.ID,
    "type": curStaff.type,
    "dayOff": curStaff.dayOff, 
    "gender": curStaff.gender, 
    "officeID": office? office.name: "Not yet assigned",
    "departmentID": dept.name,
    "extra info": curStaff.extraInfo? curStaff.extraInfo: "None",
    }    
    return curEntry;
}
module.exports = 
{assignCourseInstructor,
updateCourseInstructor, 
deleteCourseInstructor, 
viewDepartmentMembers,
viewDepartmentMembersByCourse,
viewAllStaffDayOff,
viewSingleStaffDayOff,
viewCourseTeachingAssignments,
viewCourseCoverage}