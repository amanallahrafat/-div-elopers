const Department = require("../Models/Academic/Department");
const Academic_Member = require("../Models/Users/Academic_Member");
const Staff_Member = require("../Models/Users/Staff_Member");
const Course = require("../Models/Academic/Course");
const Course_Schedule = require("../Models/Academic/Course_Schedule");


const isStaffMember = async(ID) => {
    const exist = await Staff_Member.find({ ID: ID });
    if (exist.length > 1) {
        console.log("ERROR: THERE IS A BUG IN UNIQUNESS OF ID");
    }
    return exist.length == 1;
}

const isStaffMember_arr = async(ID_arr) => {
    const staff = (await Staff_Member.find()).map(obj => obj.ID);
    for (const ID of ID_arr) {
        if (!staff.includes(ID)) return false;
    }
    return true;
}

const isAcademicMember = async(ID) => {
    const exist = await Academic_Member.find({ ID: ID });
    if (exist.length > 1) {
        console.log("ERROR: THERE IS A BUG IN UNIQUNESS OF ID");
    }
    return exist.length == 1;
}
const isHOD = async(ID) => {
    const exist = await Academic_Member.find({ ID: ID, type: 0 });
    if (exist.length > 1) {
        console.log("ERROR: THERE IS A BUG IN UNIQUNESS OF ID");
    }
    return exist.length == 1;
}
const courseIDExists = async(ID) => {
    const courseExists = await Course.findOne({ ID: ID });
    console.log(courseExists)
    if (courseExists)
        return true;
    return false;
}

const isTA = async(ID) => {
    const exist = await Academic_Member.find({ ID: ID });
    if (exist.length > 1) {
        console.log("ERROR: THERE IS A BUG IN UNIQUNESS OF ID");
    }
    console.log(exist);
    return exist.length == 1 && (exist[0].type == 3 || exist[0].type == 2);
}

const isAcademicMember_arr = async(ID_arr) => {
    const academic = (await Academic_Member.find()).map(obj => obj.ID);
    for (const ID of ID_arr) {
        if (!academic.includes(ID)) return false;
    }
    return true;
}

const courseCodeExists = async(code) => {
    const codeExist = await Course.findOne({ code: code });
    if (codeExist)
        return true;
    return false;
}

// const courseIDExists = async(ID) => {
//     const courseExists = await Course.findOne({ ID: ID });
//     console.log(courseExists)
//     if (courseExists)
//         return true;
//     return false;
// }

const courseIDExists = async(ID) => {
    const courseExists = await Course.findOne({ ID: ID });
    if (courseExists)
        return true;
    return false;
}

const isInstructorOfCourse = async(instructorID, courseID) => {
    const course = await Course.findOne({ ID: courseID });
    if (!course || course.instructor == null) return false;
    return course.instructor.includes(instructorID);
}

const scheduleExists = async(ID) => {
    const scheduleExist = await Course_Schedule.findOne({ ID: ID });
    if (scheduleExist)
        return true;
    return false;
}

const scheduleTaken = async(ID) => {
    const scheduleTaken = await Course.findOne({ scheduleID: ID });
    if (scheduleTaken)
        return true;
    return false;
}

const departmentExists = async(ID) => {
    const exists = await Department.findOne({ ID: ID });
    if (exists)
        return true;
    return false;
}

const departmentExists_arr = async(ID_arr) => {
    const departments = (await Department.find()).map(obj => obj.ID);;
    for (const ID of ID_arr) {
        if (!departments.includes(ID)) return false;
    }
    return true;
}

const isCourseCoordinator = async(coordinatorID, courseID) => {
    const course = await Course.findOne({ ID: courseID });
    return course.coordinatorID == coordinatorID;
}

module.exports = {
    isStaffMember,
    isStaffMember_arr,
    isAcademicMember,
    isAcademicMember_arr,
    courseCodeExists,
    scheduleExists,
    scheduleTaken,
    departmentExists,
    departmentExists_arr,
    isHOD,
    courseIDExists,
    isInstructorOfCourse,
    isTA,
    isCourseCoordinator
};