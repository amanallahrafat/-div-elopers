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

const validator = require('../Validations/hrValidations.js');
const mongoValidator = require('mongoose-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = "jkanbvakljbefjkawkfew";



const viewCourseCoverage = async(req, res) => {
    const courseID = parseInt(req.params.courseID);
    if (!await checkings.courseIDExists(courseID)) {
        return res.status(400).send("Course does not exist");
    }

    const instructorID = req.header.user.ID;
    if (!await checkings.isInstructorOfCourse(instructorID, courseID)) {
        return res.status(400).send("The member is not the instructor of the given course");
    }

    const course = await Course.findOne({ ID: courseID });
    const courseSchedule = await Course_Schedule.findOne({ ID: course.scheduleID });
    if (courseSchedule == null)
        return res.status(400).send("No schedule is set yet for the course");
    if (courseSchedule.slots.length == 0)
        return res.status(400).send("Course schedule has no slot entries yet");
    const filteredSlots = courseSchedule.slots.filter((s) => s.instructor != null);
    const coverage = filteredSlots.length / courseSchedule.slots.length;
    return res.send(JSON.stringify(coverage));
}

// const viewSlotAssignment = async(req, res) => {
//     const instructorID = req.header.user.ID;
//     const CourseScheduleTable = await Course_Schedule.find();
//     const slots = [];
//     for (const schedule of CourseScheduleTable) {
//         for (const slot of schedule.slots) {
//             if (slot.instructor == instructorID) {
//                 slots.push(slot);
//             }
//         }
//     }
//     return res.send(JSON.stringify(slots));
// }

const viewSlotAssignment = async(req, res) => {
    const instructorID = req.header.user.ID;
    const courseTable = await Course.find();
    const slots = [];
    for (const course of courseTable) {
        if (course.instructor && course.instructor.includes(instructorID)) {
            const schedule = await Course_Schedule.findOne({ ID: course.ID });
            if (schedule) {
                slots.push(schedule);
            }
        }

    }
    return res.send(JSON.stringify(slots));
}

//salma 
const viewSlotAssignmentLocal = async (req, res) => {
    console.log("in view course TA local start ");
    const { ID, type } = req.header.user;
    const hod = await Academic_Member.findOne({ ID: ID });
    const staffMembers=await Staff_Member.find({type:0});
    //const deptID = hod.departmentID;
    const courses = await Course.find();
    const course_schedules = await Course_Schedule.find();
    const allCourseSlots = []
    for (const curCourse of courses) {

        if (!curCourse.instructor.includes(ID))
            continue;

        curEntry = {
            courseID: curCourse.ID,
            courseName: curCourse.name,
            courseCode: curCourse.code,
            courseSlots: [],
            courseCoverage:""
          
        }
        const scheduleID = curCourse.scheduleID;
        const curSchedule = course_schedules.find((cs) => { return (cs.ID == scheduleID) });
        const courseCoverage = viewCourseCoverageLocal(curSchedule);
        curEntry.courseCoverage = courseCoverage;
        if (!scheduleID || !curSchedule) {
            allCourseSlots.push(curEntry);
            continue;
        }
        if (!curSchedule.slots) {
            allCourseSlots.push(curEntry);
            continue;
        }
        console.log("in view course TA local 1 ");
   
        let slotsArray = [];
        const locations=await Location.find();
        for (const curSlot of curSchedule.slots) {
            const slotEntry={
                instructor:"Not yet assigned",
                instructorID:"",
                locationName:"",
                slotNumber:0,
                day:0,
                courseID:curCourse.ID,
                slotID:curSlot.ID
            }
            let slotInst = "Not yet assigned";
            if (curSlot && curSlot.instructor) {
                const curInst = staffMembers.find((mem)=>{return (mem.ID== curSlot.instructor) });
                slotInst = curInst.name
                slotEntry.instructor=slotInst;
                slotEntry.instructorID="ac-"+curSlot.instructor;
            }
            if(curSlot && curSlot.locationID){
               const loc=locations.find((loc)=>{return (loc.ID==curSlot.locationID)});
               if(loc && loc.name)
                slotEntry.locationName=loc.name;
            }

            slotEntry.slotNumber=curSlot.slotNumber;
            slotEntry.day=curSlot.day;


            slotsArray.push(slotEntry);
        }
        console.log("in view course TA local 2 ");
   
        curEntry.courseSlots=slotsArray;
        allCourseSlots.push(curEntry);
    }
    return res.send(allCourseSlots);
}


const viewCourseCoverageLocal = (courseSchedule) => {

    if (!courseSchedule)
        return ("No schedule is set yet for the course");
    if (courseSchedule.slots.length == 0)
        return ("Course schedule has no slot entries yet");
    const filteredSlots = courseSchedule.slots.filter((s) => s.instructor != null);
    const coverage = filteredSlots.length / courseSchedule.slots.length;
    return (parseInt(coverage * 100*100)/100)+"%";
}

const requestInstructorCoursesLocal = async(req, res)=>{
    const allCourses = await Course.find();
    const ans = []
    const ID = req.header.user.ID;
    return res.send( allCourses.filter((c)=>{
        if(c.instructor){
            return c.instructor.includes(ID);
        }
        return false;
    }))
    
}





const assignAcademicMemberToSlot = async(req, res) => {
    const instructorID = req.header.user.ID;
    const slotID = req.body.slotID;
    const courseID = req.body.courseID;
    const academicMemberID = req.body.academicMemberID;
    // if (!await checkings.isAcademicMember(academicMemberID))
    //     res.status(400).send("The provided ID does not an acadmic memeber");
    if (!await checkings.isAcademicMember(academicMemberID))
        return res.status(400).send("The provided ID is not an acadmic memeber");
    if (!await checkings.courseIDExists(courseID))
        return res.status(400).send("The provided ID does not belong to a valid course");
    if (!await checkings.isInstructorOfCourse(instructorID, courseID))
        return res.status(400).send("You are not an instructor of the given course");
    const course = await Course.findOne({ ID: courseID });
    const schedule = await Course_Schedule.findOne({ ID: courseID });
    if (schedule.slots == null || schedule.slots.length == 0) {
        return res.status(400).send("No slots are assigned for the given course yet");
    }
    const slot = schedule.slots.filter(x => x.ID == slotID);
    if (slot[0] == null)
        return res.status(400).send("No slot is assigned for the given course with the provided slotID");
    if (slot[0].instructor != null)
        return res.status(400).send("The slot is already assigned to another instructor");
    // Q1: Could a course Instructor assign another course instructor (OR it should eb only a TA) to an assigned slot?
    // Q2: What is the difference betweeh this functionalty and the functionality of the course-coordinator of assigning slot
    // After the slot linkin request is approved.
    const allCourseSchedule =await Course_Schedule.find();
    for(const cs of allCourseSchedule){
        if(cs&&cs.slots){
            for(const s of cs.slots){
                console.log("course is ",cs.ID," slot is ",s," academic memberID ",academicMemberID)
                if(s.instructor==academicMemberID&&slot[0].day==s.day&&slot[0].slotNumber==s.slotNumber)
                return res.status(400).send("This instructor already teaches a slot in this time");
            }
        }
    }
    
    const slots = schedule.slots;
    slots.forEach(elm => {
        if (elm.ID == slotID) {
            if (elm.instructor)
                return res.status(400).send("The Specified slot is already assigned to an instructor !");
            elm.instructor = academicMemberID;
        }
    });
    await Course_Schedule.updateOne({ ID: course.scheduleID }, { slots: slots });
    if(course.teachingStaff==null)course.teachingStaff=[];
    if(!course.teachingStaff.includes(academicMemberID))course.teachingStaff.push(academicMemberID);
    await  Course.updateOne({ID: courseID}, course);
    res.send("Academic memeber is assigned to the slot the successfuly");
}

const removeAssignmentOfAcademicMemberToSlot = async(req, res) => {
    const instructorID = req.header.user.ID;
    const slotID = req.body.slotID;
    const courseID = req.body.courseID;
    const academicMemberID = req.body.academicMemberID;
    // if (!await checkings.isAcademicMember(academicMemberID))
    //     res.status(400).send("The provided ID does not an acadmic memeber");
    if (!await checkings.isAcademicMember(academicMemberID))
        return res.status(400).send("The provided ID does not an acadmic memeber");
    if (!await checkings.courseIDExists(courseID))
        return res.status(400).send("The provided ID does not belong to a valid course");
    if (!await checkings.isInstructorOfCourse(instructorID, courseID))
        return res.status(400).send("You are not an instructor of the given course");

    const course = await Course.findOne({ ID: courseID });
    const schedule = await Course_Schedule.findOne({ ID: course.scheduleID });
    if (schedule.slots == null || schedule.slots.length == 0) {
        return res.status(400).send("No slots are assigned for the given course yet");
    }
    const slot = schedule.slots.filter(x => x.ID == slotID);
    if (slot[0] == null)
        return res.status(400).send("No slot is assigned for the given course with the provided slotID");
    if (slot[0].instructor != academicMemberID)
        return res.status(400).send("The given academic member was not assigned to the provided slot");
    // Q1: Could a course Instructor assign another course instructor (OR it should eb only a TA) to an assigned slot?
    // Q2: What is the difference betweeh this functionalty and the functionality of the course-coordinator of assigning slot
    // After the slot linkin request is approved.
    const slots = schedule.slots;
    slots.forEach(elm => {
        if (elm.ID == slotID) {
            elm.instructor = undefined;
            delete(elm.instructor);
        }
    });
    await Course_Schedule.updateOne({ ID: course.scheduleID }, { slots: slots });
    res.send("Academic memeber assignment to the slot is removed successfuly");
}

const updateAcademicMemberslotAssignment = async(req, res) => {
    const instructorID = req.header.user.ID;
    const newSlotID = req.body.newSlotID;
    const oldSlotID = req.body.oldSlotID;
    const courseID = req.body.courseID;
    const academicMemberID = req.body.academicMemberID;
    // if (!await checkings.isAcademicMember(academicMemberID))
    //     res.status(400).send("The provided ID does not an acadmic memeber");
    if (!await checkings.isAcademicMember(academicMemberID))
        return res.status(400).send("The provided ID does not an acadmic memeber");
    if (!await checkings.courseIDExists(courseID))
        return res.status(400).send("The provided ID does not belong to a valid course");
    if (!await checkings.isInstructorOfCourse(instructorID, courseID))
        return res.status(400).send("You are not an instructor of the given course");

    const course = await Course.findOne({ ID: courseID });
    const schedule = await Course_Schedule.findOne({ ID: course.scheduleID });
    if (schedule.slots == null || schedule.slots.length == 0) {
        return res.status(400).send("No slots are assigned for the given course yet");
    }
    const oldSlot = schedule.slots.filter(x => x.ID == oldSlotID);
    if (oldSlot[0] == null)
        return res.status(400).send("No oldSlot is assigned for the given course with the provided slotID");
    if (oldSlot[0].instructor != academicMemberID)
        return res.status(400).send("The given academic member was not assigned to the provided oldSlot");

    const newSlot = schedule.slots.filter(x => x.ID == newSlotID);
    if (newSlot[0] == null)
        return res.status(400).send("No newSlot is assigned for the given course with the provided slotID");
    if (newSlot[0].instructor != null)
        return res.status(400).send("The slot is already assigned to another academic member");

    const allCourseSchedule =await Course_Schedule.find();
    for(const cs of allCourseSchedule){
        if(cs&&cs.slots){
            for(const slot of cs.slots){
                console.log("course is ",cs.ID," slot is ",slot," academic memberID ",academicMemberID,newSlot[0].slotNumber,newSlot[0].day)
          
                if(parseInt(slot.instructor)==parseInt(academicMemberID) &&slot.day==newSlot[0].day&&parseInt(slot.slotNumber)==parseInt(newSlot[0].slotNumber))
                return res.status(400).send("This instructor already teaches a slot in this time");
            }
        }
    }

    // Q1: Could a course Instructor assign another course instructor (OR it should eb only a TA) to an assigned slot?
    // Q2: What is the difference betweeh this functionalty and the functionality of the course-coordinator of assigning slot
    // After the slot linkin request is approved.

    oldSlot[0].instructor = undefined;
    delete(oldSlot[0].instructor);

    newSlot[0].instructor = academicMemberID;

    const slots = schedule.slots;
    slots.forEach(elm => {
        if (elm.ID == oldSlotID) {
            elm.instructor = undefined;
            delete(elm.instructor);
        }
        if (elm.ID == newSlotID) {
            elm.instructor = academicMemberID;
        }
    });

    await Course_Schedule.updateOne({ ID: course.scheduleID }, { slots: slots });
    await Course_Schedule.updateOne({ ID: course.scheduleID }, { slots: schedule.slots });
    res.send("Academic memeber assignment to the slot is updated successfuly");
}

const removeAcademicMemberFromCourse = async(req, res) => {
    const instructorID = req.header.user.ID;
    const courseID = req.body.courseID;
    const academicMemberID = req.body.academicMemberID;
    if (!await checkings.isAcademicMember(academicMemberID))
        return res.status(400).send("The provided ID is not an acadmic memeber");
    if (!await checkings.courseIDExists(courseID))
        return res.status(400).send("The provided ID does not belong to a valid course");
    if (!await checkings.isInstructorOfCourse(instructorID, courseID))
        return res.status(400).send("You are not an instructor of the given course");

    const course = await Course.findOne({ ID: courseID });
    // Remove the TA from the course's teaching staff.
    if (!course.teachingStaff.includes(academicMemberID)) {
        return res.status(400).send("The given acadmic memebr does not teach the given course");
    } else {
        course.teachingStaff = course.teachingStaff.filter(x => x != academicMemberID);
        await Course.updateOne({ ID: courseID }, { teachingStaff: course.teachingStaff });
    }

    // Check if the academic member is the course coordinator.
    if (course.coordinatorID == academicMemberID) {
        delete(course['_doc'].coordinatorID);
        await Course.updateOne({ ID: courseID }, { $unset: { coordinatorID: 1 } });

        let stillCoordinator = false;
        const courseTable = await Course.find();
        for (const course of courseTable) {
            if (course.coordinatorID == academicMemberID && course.ID != courseID)
                stillCoordinator = true;
        }

        if (!stillCoordinator) {
            await Academic_Member.updateOne({ ID: academicMemberID }, { type: 3 });
        }
    }


    // Remove the TA from all assigned slots to him/her.
    const schedule = await Course_Schedule.findOne({ ID: course.scheduleID });
    if (schedule && schedule.slots) {
        const slots = schedule.slots;
        slots.forEach(elm => {
            if (elm.instructor == academicMemberID) {
                elm.instructor = undefined;
                delete(elm.instructor);
            }
        });
        await Course_Schedule.updateOne({ ID: course.scheduleID }, { slots: slots });
    }
    res.send("Academic memeber removed successfully");
}

const assignCourseCoordinator = async(req, res) => {
    console.log(req.body.academicMemberID)
    const instructorID = req.header.user.ID;
    const courseID = req.body.courseID;
    const academicMemberID = req.body.academicMemberID;
    if (!await checkings.isTA(academicMemberID))
        return res.status(400).send("The provided ID is not an acadmic memeber");
    if (!await checkings.courseIDExists(courseID))
        return res.status(400).send("The provided ID does not belong to a valid course");
    if (!await checkings.isInstructorOfCourse(instructorID, courseID))
        return res.status(400).send("You are not an instructor of the given course");

    const course = await Course.findOne({ ID: courseID });
    if (course.coordinatorID != null) {
        // Check if the course.coordinator is still a coordinator (in another course)
        const oldCoordinator = course.coordinatorID;
        let stillCoordinator = false;
        const courseTable = await Course.find();
        for (const course of courseTable) {
            if (course.coordinatorID == oldCoordinator && course.ID != courseID) {
                stillCoordinator = true;
            }
        }

        if (!stillCoordinator) {
            await Academic_Member.updateOne({ ID: oldCoordinator }, { type: 3 });
        }
    }
    await Academic_Member.updateOne({ ID: academicMemberID }, { type: 2 });

    course.coordinatorID = academicMemberID;
    if (!course.teachingStaff) course.teachingStaff = [];
    if (!course.teachingStaff.includes(academicMemberID)) {
        course.teachingStaff.push(academicMemberID);
    }

    await Course.updateOne({ ID: courseID }, course);
    res.send("Course coordinator is assigned successfully");
}

const viewStaffProfilesInDepartment = async(req, res)=>{
    const instructorID = req.header.user.ID;
    const instructor = await Academic_Member.findOne({ID: instructorID});
    const staffProfiles = [];
    if(instructor.departmentID !=null){
    const staffInDep = await Academic_Member.find({departmentID: instructor.departmentID});
      for(const mem of staffInDep){
        const s = await Staff_Member.findOne({ID: mem.ID, type: 0});
       const a = await Academic_Member.findOne({ID: mem.ID});
        staffProfiles.push({
          "name": s.name,
          "email": s.email,
          "ID": `ac-${s.ID}`,
          "type": a.type,
          "dayOff": s.dayOff,
          "gender": s.gender,
          "officeID": s.officeID,
          "departmentID": mem.departmentID,
          "extra info": s.extraInfo
        });
      }
    }
    
    res.send(JSON.stringify(staffProfiles));
}

const viewStaffProfilesInCourse = async(req, res)=>{
    const instructorID = req.header.user.ID;
    const courseID = parseInt(req.params.courseID);
    if(!await checkings.isInstructorOfCourse(instructorID, courseID)){
      return req.status(400).send("You are not authorized to view the provided course")
    }
    const instructor = await Academic_Member.findOne({ID: instructorID});
    const staffProfiles = [];
    if(instructor.departmentID !=null){
    const CourseTable = await Course.find();
      for(const course of CourseTable){
        if(!course.department || !course.department.includes(instructor.departmentID))
          continue;
        const staff = (course.teachingStaff || [] ).concat(course.instructor || []);
        for(const mem of staff){
        const s = await Staff_Member.findOne({ID: mem, type:0});
        const a = await Academic_Member.findOne({ID: mem});
        staffProfiles.push({
          "name": s.name,
          "email": s.email,
          "ID": `ac-${s.ID}`,
          "type": a.type,
          "dayOff": s.dayOff,
          "gender": s.gender,
          "officeID": s.officeID,
          "departmentID": a.departmentID,
          "extra info": s.extraInfo
        });
      }

      }
    }
    
    res.send(JSON.stringify(staffProfiles));
}



const viewDepartmentMembersByCourse = async (req, res) => {
    const { ID, type } = req.header.user;
    const hod = await Academic_Member.findOne({ ID: ID });
    const deptID = hod.departmentID;
    let totalArray = [];
    const course = await Course.findOne({ ID: req.params.courseID });

    if (!course)
        res.status(400).send("This course doesn't exist")
    if (!(course.department && course.department.includes(deptID))) {
        return res.status(400).send("This course is not in your department");
    }


    const staffMembers = await Staff_Member.find();
    const Locations = await Location.find()
    const Departments = await Department.find()
    const academicMembers = await Academic_Member.find();
    if (course.teachingStaff)
        for (const curMemID of course.teachingStaff) {
            //const curMem = await Academic_Member.findOne({ID:curMemID});
            const curMem = academicMembers.find((mem) => { return mem.ID == curMemID });
            const curEntry = createMemEntry(curMem, staffMembers, Locations, Departments);
            totalArray.push(curEntry);
        }
    if (course.instructor)
        for (const curMemID of course.instructor) {
            //const curMem = await Academic_Member.findOne({ID:curMemID});
            const curMem = academicMembers.find((mem) => { return mem.ID == curMemID });
            const curEntry = createMemEntry(curMem, staffMembers, Locations, Departments);
            totalArray.push(curEntry);
        }

    //The coordinator is already inside the teaching staff    

    // if(course.coordinatorID){
    //     //const curMem = await Academic_Member.findOne({ID:course.coordinatorID});
    //     const curMem = academicMembers.find((mem)=>{return mem.ID == curMemID});
    //     const curEntry =  createMemEntry(curMem,staffMembers,Locations,Departments);
    //     totalArray.push(curEntry);
    // }

    return res.send(totalArray)
}


const createMemEntry = (curMem, staffMembers, Locations, Departments) => {
    const curStaff = staffMembers.find((mem => { return mem.ID == curMem.ID && mem.type == 0 }));
    const office = Locations.find((loc) => { return (loc.ID == curStaff.officeID && loc.type == 2) });
    const dept = Departments.find((curDept) => { return (curDept.ID == curMem.departmentID) });

    const curEntry = {
        name: curStaff.name,
        email: curStaff.email,
        ID: "ac-" + curStaff.ID,
        type: curStaff.type,
        dayOff: curStaff.dayOff,
        gender: curStaff.gender,
        officeID: office ? office.name : "Not yet assigned",
        departmentID: dept.name,
        extraInfo: curStaff.extraInfo ? curStaff.extraInfo : "None",
    }
    return curEntry;
}










//Use this in remove an assigned academic member in course and in assign course coordinator only 
// Because you can only view TAs but not instructors
const viewMembersByCourse = async (req, res) => {
    console.log("The course ID is  ", req.params.courseID)
    const { ID, type } = req.header.user;
    const hod = await Academic_Member.findOne({ ID: ID });
    //const deptID = hod.departmentID;
    let totalArray = [];
    const course = await Course.findOne({ ID: req.params.courseID });

    if (!course)
        res.status(400).send("This course doesn't exist")
    // if (!(course.department && course.department.includes(deptID))) {
    //     return res.status(400).send("This course is not in your department");
    // }
    if(!course.instructor.includes(ID)){
        return res.status(400).send("You are not an instructor in this course!!!");
    }

    const staffMembers = await Staff_Member.find();
    const Locations = await Location.find()
    const Departments = await Department.find()
    const academicMembers = await Academic_Member.find();
    if (course.teachingStaff)
        for (const curMemID of course.teachingStaff) {
            //const curMem = await Academic_Member.findOne({ID:curMemID});
            const curMem = academicMembers.find((mem) => { return mem.ID == curMemID });
            const curEntry = createMemEntry(curMem, staffMembers, Locations, Departments);
            totalArray.push(curEntry);
        }
    // if (course.instructor)
    //     for (const curMemID of course.instructor) {
    //         //const curMem = await Academic_Member.findOne({ID:curMemID});
    //         const curMem = academicMembers.find((mem) => { return mem.ID == curMemID });
    //         const curEntry = createMemEntry(curMem, staffMembers, Locations, Departments);
    //         totalArray.push(curEntry);
    //     }

    //The coordinator is already inside the teaching staff    

    // if(course.coordinatorID){
    //     //const curMem = await Academic_Member.findOne({ID:course.coordinatorID});
    //     const curMem = academicMembers.find((mem)=>{return mem.ID == curMemID});
    //     const curEntry =  createMemEntry(curMem,staffMembers,Locations,Departments);
    //     totalArray.push(curEntry);
    // }

    return res.send(totalArray)
}






module.exports = {
    viewCourseCoverage,
    assignAcademicMemberToSlot,
    removeAssignmentOfAcademicMemberToSlot,
    updateAcademicMemberslotAssignment,
    viewSlotAssignment,
    removeAcademicMemberFromCourse,
    assignCourseCoordinator,
    viewStaffProfilesInDepartment,
    viewStaffProfilesInCourse,
    viewSlotAssignmentLocal,
    requestInstructorCoursesLocal,
    viewMembersByCourse,
    viewDepartmentMembersByCourse
}