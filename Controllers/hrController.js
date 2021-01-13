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
const extraUtils = require('../utils/extraUtils');
const mongoose = require('mongoose');

const validator = require('../Validations/hrValidations.js');
const mongoValidator = require('mongoose-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = "jkanbvakljbefjkawkfew";

//VIEWS
const viewAllLocations = async (req, res) => {
    res.send(await Location.find());
}

const viewAllFaculties = async (req, res) => {
    let faculties = await Faculty.find();
    // faculties = faculties.map(async f => {
    for (const f of faculties) {
        const departments = [];
        for (const dep of f.departments) {
            const depName = await extraUtils.getDepartmentByID(dep);
            departments.push(depName);
        }

        f['_doc'].departments = departments;
    }
    res.send(faculties);
}

const viewAllDepartments = async (req, res) => {
    const departments = await Department.find();
    const depClone = [];
    for (const dep of departments) {
        const memberNames = [];
        for (const memID of dep.members) {
            const member = await Staff_Member.findOne({ ID: memID, type: 0 });
            memberNames.push(member);
        }
        dep['_doc'].memberNames = memberNames;
        dep['_doc'].HODName = await Staff_Member.findOne({ ID: dep.hodID, type: 0 });
        depClone.push(dep);
    }
    res.send(depClone);
}

const viewAllStaffMembers = async (req, res) => {
    res.send(await Staff_Member.find());
}

const viewAllMembersProfiles = async (req,res) =>{
    const staffMembers = await Staff_Member.find();
    let data = []
    for(const staff of staffMembers){
        if(staff.type == 0){
            const ac = await Academic_Member.findOne({ID : staff.ID});
            //console.log(ac)
            staff['_doc'].departmentID = ac.departmentID;
            staff['_doc'].memberType = ac.type;
        }
        data.push(staff);
    }
    res.send(data);
}

const viewAllCourses = async (req, res) => {
    res.send(await Course.find());
}

// Start Location CRUD
const createLocation = async (req, res) => {
    const isValid = validator.validateLocation(req.body);
    if (isValid.error)
        return res.status(400).send(isValid.error.details[0].message);
    const locationTable = await Location.find();
    let max = 0;
    if (locationTable.length != 0) {
        max = Math.max.apply(Math, locationTable.map(obj => obj.ID));
    }
    const location = new Location({
        ID: max + 1,
        name: req.body.name,
        capacity: req.body.capacity,
        type: req.body.type
    })
    await location.save();
    res.send(location);
}

const updateLocation = async (req, res) => {
    const location = await Location.findOne({ ID: req.params.ID });
    if (!location)
        return res.status(404).send("Location Not Found");

    if (req.body.name == null) req.body.name = location.name;
    if (req.body.capacity == null) req.body.capacity = location.capacity;
    if (req.body.type == null) req.body.type = location.type;

    const isValid = validator.validateLocation(req.body);
    if (isValid.error)
        return res.status(400).send(isValid.error.details[0].message);

    await Location.updateOne({ ID: req.params.ID }, req.body);
    const newLocation = await Location.findOne({ID : req.params.ID});
    res.send({
        newLocation : newLocation,
        msg :"Location Updated Successfully!"
    });
}

const deleteLocation = async (req, res) => {
    const location = await Location.findOne({ ID: req.params.ID });
    if (!location)
        return res.status(404).send("Location ID Not Valid");

    await Location.deleteOne({ ID: req.params.ID });
    await removeCascade.removeLocation(req.params.ID);
    res.send("Location Deleted Successfully!");
}
// End Location CRUD

// Start Faculty CRUD
const createFaculty = async (req, res) => {
    const isValid = validator.validateFaculty(req.body);
    if (isValid.error)
        return res.status(400).send(isValid.error.details[0].message);
    const fac = await Faculty.find({ name: req.body.name });
    if (fac.length)
        return res.status(400).send("Faculty name should be unique");

    // Check that the departments exist.
    if (req.body.departments != null) {
        for (let i = 0; i < req.body.departments.length; i++) {
            let dep = await Department.find({ ID: req.body.departments[i] });
            if (dep.length == 0) return res.status(400).send("Department IDs are not valid.");
        }
    }

    // Check that no department is shared with another faculty.
    const facArray = await Faculty.find();
    for (const f of facArray) {
        if (req.body.departments != null) {
            for (const d of req.body.departments) {
                if (f.departments.includes(d))
                    return res.status(400).send("Deparments can not be shared between different faculties.");
            }
        }
    }

    const faculty = new Faculty({
        name: req.body.name,
        departments: req.body.departments
    })
    await faculty.save();
    res.send(faculty);
}

const updateFaculty = async (req, res) => {
    console.log(req.body);
    const faculty = await Faculty.findOne({ name: req.params.name });
    if (!faculty)
        return res.status(404).send("Faculty Not Found");

    const body = req.body;
    if (body.name == null) body.name = faculty.name;
    if (body.departments == null) body.departments = faculty.departments;

    const isValid = validator.validateFaculty(body);
    if (isValid.error)
        return res.status(400).send(isValid.error.details[0].message);

    // Delete the faculty using the old name.
    await Faculty.deleteOne({ name: faculty.name });

    const fac = await Faculty.find({ name: body.name });
    if (fac.length) {
        // Add the old faculty back to the DB.
        const newFaculty = new Faculty({
            name: faculty.name,
            departments: faculty.departments
        })
        await newFaculty.save();
        return res.status(400).send("Faculty name should be unique.");
    }

    // Check that the departments exist.
    for (let i = 0; i < body.departments.length; i++) {
        let dep = await Department.find({ ID: body.departments[i] });
        if (dep.length == 0) {
            // Add the old faculty back to the DB.
            const newFaculty = new Faculty({
                name: faculty.name,
                departments: faculty.departments
            })
            await newFaculty.save();
            return res.status(400).send("Department IDs are not valid.");
        }
    }

    // Check that no department is shared with another faculty.
    const facArray = await Faculty.find();
    for (const f of facArray) {
        for (const d of body.departments) {
            if (f.departments.includes(d)) {
                // Add the old faculty back to the DB.
                const newFaculty = new Faculty({
                    name: faculty.name,
                    departments: faculty.departments
                })
                await newFaculty.save();
                return res.status(400).send("Departments can not be shared between different faculties.");
            }
        }
    }

    const newFaculty = new Faculty({
        name: body.name,
        departments: body.departments
    })
    await newFaculty.save();
    // const updatedFaculty = await Faculty.findOne({name : body.name});
    // const deps = [];
    // for (const dep of updatedFaculty.departments) {
    //     const depName = await extraUtils.getDepartmentByID(dep);
    //     deps.push(depName);
    // }
    // updatedFaculty['_doc'].departments = deps;
    res.send("Faculty Updated Successfully!");
}

const deleteFaculty = async (req, res) => {
    const faculty = await Faculty.findOne({ name: req.params.name });
    if (!faculty)
        return res.status(404).send("Faculty name Not Valid");

    await Faculty.deleteOne({ name: req.params.name });
    res.send("Faculty Deleted Successfully!");
}
// End Faculty CRUD

const addStaffMember = async (req, res) => {
    console.log(req.body);
    const isValid = validator.validateAddStaffMember(req.body);
    if (isValid.error){
        console.log(isValid.error.details[0].message);
        return res.status(400).send(isValid.error.details[0].message);
    }
    if (req.body.officeID) {
        const office = await Location.find({ ID: req.body.officeID, type: 2 });
        if (office.length == 0) {
            return res.status(400).send("This location doesn't exist or it's not an office");
        } else {
            const countMembers = await Staff_Member.find({ officeID: req.body.officeID });
            if (countMembers.length >= office[0].capacity)
                return res.status(400).send("This location is full");
        }
    }
    const users = await Staff_Member.find({ email: req.body.email });
    if (users.length != 0) {
        return res.status(400).send("This email already exists. Emails have to be unique");
    }

    let max = await getMaxStaffID(req.body.type);
    if (req.body.type == 0) { //If it's an academic member 
        var department = await Department.find({ ID: req.body.departmentID });
        if (department.length == 0)
            return res.status(400).send("This department doesn't exist");
        //Adding him to the new department
        department[0].members.push(max + 1);
        if (req.body.memberType != null && req.body.memberType == 0) {
            department[0].hodID = max + 1
        }
        else {
            req.body.memberType = 3; // Set it as an academic member
        }
        await Department.updateOne({ ID: req.body.departmentID }, department[0]);
    }
    // the salt number : recommended not to go above 14.
    const salt = await bcrypt.genSalt(10);
    // always pass the body.passward as a string 
    const hashedPass = await bcrypt.hash("123456", salt);
    const u = new Staff_Member({
        name: req.body.name,
        ID: max + 1,
        email: req.body.email,
        type: req.body.type,
        password: hashedPass,
        dayOff: req.body.dayOff,
        gender: req.body.gender,
        officeID: req.body.officeID,
        extraInfo: req.body.extraInfo,
        salary: req.body.salary,
        annualBalance: 2.5,
        accidentalLeaveBalance: 6
    });
    await u.save();
    if (req.body.type == 0) { // If it's an academic member add it to academic member table
        const academic_member = new Academic_Member({
            ID: max + 1,
            //facultyName : req.body.facultyName,
            departmentID: req.body.departmentID,
            type: req.body.memberType, // { {"0" : HOD }, {"1" : course Instructor} , {"2" : Cooridnator}, {"3": Neither}}
        })
        await academic_member.save();
    }
    res.send("Registeration Completed!");
}

const updateAcademicMember = async (req, res) => {
    const academic_member = await Academic_Member.findOne({ ID: req.params.ID });
    if (!req.body.departmentID) req.body.departmentID = academic_member.departmentID;
    else {
        const dep = await Department.find({ ID: req.body.departmentID });
        if (dep.length == 0) {
            res.status(400).send("This department doesn't exist");
            return true;
        }
        var oldDepartment = await Department.findOne({ ID: academic_member.departmentID });
        oldDepartment.members = oldDepartment.members.filter(function (value) { // Removing him from old department
            return value != req.params.ID;
        })
        //Removing him from old department
        await Department.updateOne({ ID: academic_member.departmentID }, oldDepartment);
        //Adding him to the new department
        var newDepartment = await Department.findOne({ ID: req.body.departmentID });
        if (!newDepartment) { // If this department doesn't exist
            res.send("This department doesn't exist");
            return true;
        }
        newDepartment.members.push(parseInt(req.params.ID));
        await Department.updateOne({ ID: req.body.departmentID }, newDepartment);
    }
    if (req.body.departmentID != null) academic_member.departmentID = req.body.departmentID;
    if (req.body.memberType == null) req.body.memberType = academic_member.type;
    else { // If the HR is assigning the academic member to be a head of department 
        if (!(parseInt(req.body.memberType) == 0) && !(parseInt(req.body.memberType) == 3)) {
            res.send("You are not allowed to do this action");
            return true;
        }
        //If hr is assigning member to be the hod
        if (parseInt(req.body.memberType) === 0) {
            const deptID = academic_member.departmentID;
            const department = await Department.findOne({ ID: deptID })
            //Assign this member to be head of the department 
            department.hodID = academic_member.ID;
            await Department.updateOne({ ID: deptID }, department)
        }
        academic_member.type = req.body.memberType;
        await Academic_Member.updateOne({ ID: req.params.ID }, { type: req.body.memberType })
    }
    // courses are not updated here   
    await Academic_Member.updateOne({ ID: req.params.ID }, req.body);
}

const updateStaffMember = async (req, res) => {
    if (req.body.type != null) {
        return res.status(400).send("You can't update the type of the staff member");
    }
    const member = await Staff_Member.find({ ID: req.params.ID, type: req.params.type });
    const academic_member = null;
    if (req.params.type == 0) { //If it's an academic member.
        const fail = await updateAcademicMember(req, res);
        if (fail)
            return;
    }

    if (member.length == 0) {
        return res.status(400).send("This staff member doesn't exist");
    }
    if (req.body.officeID) {
        const office = await Location.find({ ID: req.body.officeID, type: 2 });
        if (office.length == 0) {
            return res.status(400).send("This location doesn't exist or it's not an office");
        } else {
            const countMembers = await Staff_Member.find({ officeID: req.body.officeID });
            if (countMembers.length >= office[0].capacity)
                return res.status(400).send("This location is full");
        }
    }

    req.body.type = req.params.type;

    if (!req.body.name) req.body.name = member[0].name;
    if (!req.body.email) {
        req.body.email = member[0].email;
    } else {
        const users = await Staff_Member.find({ email: req.body.email });
        if (users.length != 0 && users[0].ID != req.params.ID && users[0].type != req.params.type) {
            return res.status(400).send("This email already exists. Emails have to be unique");
        }
    }
    if (!req.body.dayOff) req.body.dayOff = member[0].dayOff;
    if (!req.body.gender) req.body.gender = member[0].gender;
    if (!req.body.officeID && member[0].officeID != undefined) req.body.officeID = member[0].officeID;
    if (!req.body.extraInfo) req.body.extraInfo = member[0].extraInfo;
    if (!req.body.salary) req.body.salary = member[0].salary;
    req.body = extraUtils.trimMonogoObj(req.body, ["memberType"]);
    const isValid = validator.validateAddStaffMember(req.body);
    if (isValid.error){
        console.log(isValid.error.details[0].message);
        return res.status(400).send(isValid.error.details[0].message);
    }
    await Staff_Member.updateOne({ ID: req.params.ID, type: req.params.type }, req.body);
    res.send("Staff member Updated Successfully!");
}

const deleteStaffMember = async (req, res) => {
    const member = await Staff_Member.findOne({ ID: req.params.ID, type: req.params.type });
    if (!member) {
        return res.status(400).send("This user doesn't exist");
    }
    if (req.params.type == 0) { // If it's an academic member
        const academicMember = await Academic_Member.findOne({ ID: req.params.ID });
        const depID = academicMember.departmentID;
        const department = await Department.findOne({ ID: depID });
        //Remove the academic member from the department.
        department.members = department.members.filter(function (value) {
            return value != parseInt(req.params.ID);
        })
        //If this member was the head of the department remove him
        if (department.hodID == parseInt(req.params.ID)) {
            department.hodID = undefined;
            delete (department.hodID);
        }
        //Get all courses
        const allCourses = await Course.find();
        for (let i = 0; i < allCourses.length; i++) {
            const courseID = allCourses[i].ID;
            //If this member teaches this course
            if (allCourses[i].teachingStaff.includes(parseInt(req.params.ID))) {
                //Remove his ID from slots of this course
                const courseSchedule = await Course_Schedule.findOne({ ID: courseID });
                let courseSlots = courseSchedule.slots;
                for (let j = 0; courseSlots != null && j < courseSlots.length; j++) {
                    if (courseSlots[j].instructor == parseInt(req.params.ID)) {
                        courseSlots[j].instructor = undefined;
                        delete (courseSlots[j].instructor);
                    }
                }

                //Updating the course slots in the schedule
                courseSchedule.slots = courseSlots;
                await Course_Schedule.update({ ID: courseID }, courseSchedule);

                //Remove the member from the teaching staff of this course
                allCourses[i].teachingStaff = allCourses[i].teachingStaff.filter(function (value) { return value != req.params.ID });
            }
            //If this member was the course coordinator, remove him 
            if (allCourses[i].coordinatorID == parseInt(req.params.ID)) {
                allCourses[i].coordinatorID = undefined;
                delete (allCourses[i].coordinatorID);
            }
            //If this member was a course instructor 
            if (allCourses[i].instructor.includes(parseInt(req.params.ID))) {
                allCourses[i].instructor = allCourses[i].instructor.filter(function (value) { return value != parseInt(req.params.ID) });
            }

            await Course.replaceOne({ ID: courseID }, allCourses[i]);
        }
        await Department.replaceOne({ ID: depID }, department);
        await Academic_Member.deleteOne({ ID: req.params.ID });
    }
    await Staff_Member.deleteOne({ ID: req.params.ID, type: req.params.type });
    return res.send("Staff member deleted successfully");
}

// Start Department CRUD
const createDepartment = async (req, res) => {
    const isValid = validator.validateDepartment(req.body);
    if (isValid.error)
        return res.status(400).send(isValid.error.details[0].message);

    // Check that the department members are academic members.
    if (req.body.members) {
        for (const memID of req.body.members) {
            const exist = await Academic_Member.find({ ID: memID });
            if (exist.length == 0)
                return res.status(400).send("Members must be academic members");
        }
    }

    // Check that the HOD is an academic member.
    if (req.body.hodID) {
        const existHOD = await Academic_Member.find({ ID: req.body.hodID });
        if (existHOD.length == 0)
            return res.status(400).send("HOD must be an academic member");
    }
    
    if (!req.body.members)
        req.body.members = [];
    if (req.body.hodID != null && !req.body.members.includes(req.body.hodID)) {
        req.body.members.push(req.body.hodID);
    }

    const departmentTable = await Department.find();
    let max = 0;
    if (departmentTable.length != 0) {
        max = Math.max.apply(Math, departmentTable.map(obj => obj.ID));
    }
    const department = new Department({
        ID: max + 1,
        name: req.body.name,
        members: req.body.members, //Array[memberID]
        hodID: req.body.hodID,
    });
    await createCascade.createDepartment(max + 1, req.body.members);
    if (req.body.members) {
        for (const mem of req.body.members) {
            for (const dep of departmentTable) {
                if (dep.members.includes(mem)) {
                    const index = dep.members.indexOf(mem);
                    dep.members.splice(index, 1);
                    if (dep.hodID == mem) {
                        await Department.updateOne({ ID: dep.ID }, { $unset: { hodID: 1 } })
                    }
                }
                await Department.updateOne({ ID: dep.ID }, { members: dep.members })
            }
            await Academic_Member.updateOne({ ID: mem }, { type: 1 });
        }
    }
    if (req.body.hodID) {
        await Academic_Member.updateOne({ ID: req.body.hodID }, { type: 0 });
    }
    await department.save();
    res.send(department);
}

const updateDepartment = async (req, res) => {
    // if (req.body.members != null)
    //     return res.status(400).send("You can't update the department member, you have to update the academic members themselves");

    const department = await Department.findOne({ ID: req.params.ID });
    if (!department) return res.status(400).send("This department doesn't exist");
    if (req.body.name == null) req.body.name = department.name;
    if (req.body.members == null && department.members != null) req.body.members = department.members;
    if (req.body.hodID == null && department.hodID != null) req.body.hodID = department.hodID;

    const isValid = validator.validateDepartment(req.body);
    if (isValid.error)
        return res.status(400).send(isValid.error.details[0].message);

    // Check that the department members are academic members.
    if (req.body.members) {
        for (const memID of req.body.members) {
            const exist = await Academic_Member.find({ ID: memID });
            if (exist.length == 0)
                return res.status(400).send("Members must be academic members");
        }
    }

    // Check that the HOD is an academic member.
    if (req.body.hodID) {
        const existHOD = await Academic_Member.find({ ID: req.body.hodID });
        if (existHOD.length == 0)
            return res.status(400).send("HOD must be an academic member");
    }

    if (!req.body.members)
        req.body.members = [];
    if (req.body.hodID !=null && !req.body.members.includes(req.body.hodID)) {
        req.body.members.push(req.body.hodID);
    }

    await Academic_Member.updateMany({ departmentID: req.params.ID }, { $unset: { departmentID: 1 } });

    await createCascade.createDepartment(req.params.ID, req.body.members);

    const departmentTable = await Department.find();
    if (req.body.members) {
        for (const mem of req.body.members) {
            for (const dep of departmentTable) {
                if (dep.members.includes(mem)) {
                    const index = dep.members.indexOf(mem);
                    dep.members.splice(index, 1);
                    if (dep.hodID == mem) {
                        await Department.updateOne({ ID: dep.ID }, { $unset: { hodID: 1 } })
                    }
                }
                await Department.updateOne({ ID: dep.ID }, { members: dep.members })
            }
            await Academic_Member.updateOne({ ID: mem }, { type: 1 });
        }
    }

    if (req.body.hodID) {
        await Academic_Member.updateOne({ ID: req.body.hodID }, { type: 0 });
    }
    console.log(req.body);
    await Department.update({ ID: req.params.ID }, req.body);
    res.send("Department has been updated successfully");
}

const deleteDepartment = async (req, res) => {
    const department = await Department.findOne({ ID: req.params.ID });
    if (!department)
        return res.status(404).send("Department name Not Valid");

    await Department.deleteOne({ ID: req.params.ID });
    await removeCascade.removeDepartment(req.params.ID);
    res.send("Department Deleted Successfully!");
}
// End Department CRUD

// Start Course CRUD
const createCourse = async (req, res) => {
    const isValid = validator.validateCourse_hr(req.body);
    if (isValid.error){
        console.log(isValid.error.details[0].message)
        return res.status(400).send(isValid.error.details[0].message);
    }

    if (await checkings.courseCodeExists(req.body.code))
        return res.status(400).send("Code must be unique");

    if (req.body.scheduleID) {
        if (!await checkings.scheduleExists(req.body.scheduleID))
            return res.status(400).send("Schedule with the given ID does not exist");

        if (await checkings.scheduleTaken(req.body.scheduleID))
            return res.status(400).send("Schedule belongs to another course");
    }

    // if(req.body.teachingStaff){
    //     if(!await checkings.isAcademicMember_arr(req.body.teachingStaff))
    //         return res.status(400).send("Teaching staff should be academic members");
    // }

    if (req.body.department) {
        if (!await checkings.departmentExists_arr(req.body.department))
            return res.status(400).send("Department does not exist");
    }

    const courseID = await getMaxCourseID() + 1;
    const course = new Course({
        ID: courseID,
        name: req.body.name,
        //coordinatorID : req.body.coordinatorID, // HR can not assign coordinator.
        code: req.body.code,
        scheduleID: req.body.scheduleID,
        //teachingStaff : req.body.teachingStaff,
        department: req.body.department,
        description: req.body.description,
    });

    await course.save();
    return res.send("Course has been added successfully");
}

const updateCourse = async (req, res) => {
    const courseID = parseInt(req.params.ID);
    const oldCourse = await Course.findOneAndDelete({ ID: courseID });
    if (!oldCourse)
        return res.status(400).send("Course does not exist");
    if (!req.body.name) req.body.name = oldCourse.name;
    if (!req.body.code) req.body.code = oldCourse.code;
    if (!req.body.department) req.body.department = oldCourse.department;
    if (!req.body.description) req.body.description = oldCourse.description;

    if (await checkings.courseCodeExists(req.body.code))
        return res.status(400).send("Code must be unique");

    // if (req.body.scheduleID) {
    //     if (!await checkings.scheduleExists(req.body.scheduleID)) {
    //         const course = new Course(JSON.parse(JSON.stringify(oldCourse)));
    //         await course.save();
    //         return res.status(400).send("Schedule with the given ID does not exist");
    //     }

    //     if (await checkings.scheduleTaken(req.body.scheduleID)) {
    //         const course = new Course(JSON.parse(JSON.stringify(oldCourse)));
    //         await course.save();
    //         return res.status(400).send("Schedule belongs to another course");
    //     }
    // }

    if (req.body.department) {
        if (!await checkings.departmentExists_arr(req.body.department)) {
            const course = new Course(JSON.parse(JSON.stringify(oldCourse)));
            await course.save();
            return res.status(400).send("Department does not exist");
        }
    }

    const isValid = validator.validateCourse_hr(req.body);
    if (isValid.error) {
        const course = new Course(JSON.parse(JSON.stringify(oldCourse)));
        await course.save();
        return res.status(400).send(isValid.error.details[0].message);
    }

    const courseObj = {
        ID: oldCourse.ID,
        name: req.body.name,
        //coordinatorID : req.body.coordinatorID, // HR can not assign coordinator.
        code: req.body.code,
        scheduleID: req.body.scheduleID,
        //teachingStaff : req.body.teachingStaff,
        department: req.body.department,
        description: req.body.description,
    };

    if(oldCourse.coordinatorID != null ) courseObj.coordinatorID = oldCourse.coordinatorID;
    if(oldCourse.teachingStaff != null ) courseObj.teachingStaff = oldCourse.teachingStaff;
    if(oldCourse.instructor != null ) courseObj.instructor = oldCourse.instructor;

    const course  = new Course(JSON.parse(JSON.stringify(courseObj)));

    await course.save();
    return res.send("Course has been updated successfully");
}
//delete the course schedule 
const deleteCourse = async (req, res) => {
    const courseID = parseInt(req.params.ID);
    const course = await Course.findOneAndDelete({ ID: courseID });
    if (!course)
        return res.status(400).send("Course does not exist");
    const scheduleID = course.scheduleID;
    if (scheduleID != null) {
        await Course_Schedule.deleteOne({ ID: scheduleID });
    }
    await Course.deleteOne({ ID: courseID });
    return res.send("Course has been deleted successfully");
}

// End Course CRUD

// Generate IDs
const getMaxStaffID = async (type) => {
    const staffTable = await Staff_Member.find({ type: type });
    let max = 0;
    if (staffTable.length != 0) {
        max = Math.max.apply(Math, staffTable.map(obj => obj.ID));
    }
    return max;
}

const getMaxCourseID = async () => {
    const courseTable = await Course.find();
    let max = 0;
    if (courseTable.length != 0) {
        max = Math.max.apply(Math, courseTable.map(obj => obj.ID));
    }
    return max;
}

const addMissingSignInOut = async (req, res) => {
    const { ID, type } = req.header.user;
    const signinYear = req.body.signinYear;
    const signinMonth = req.body.signinMonth;
    const signinDay = req.body.signinDay;
    const signinHour = req.body.signinHour;
    const signinMinute = req.body.signinMinute;
    const signinSec = req.body.signinSec;
    const signoutYear = req.body.signoutYear;
    const signoutMonth = req.body.signoutMonth;
    const signoutDay = req.body.signoutDay;
    const signoutHour = req.body.signoutHour;
    const signoutMinute = req.body.signoutMinute;
    const signoutSec = req.body.signoutSec;
    if (!(signinYear != undefined && signinMonth != undefined && signinDay != undefined && signinHour != undefined && signinMinute != undefined && signinSec != undefined &&
        signoutYear != undefined && signoutMonth != undefined && signoutDay != undefined && signoutHour != undefined && signoutMinute != undefined && signoutSec != undefined))
        return res.status(400).send("please enter all specified signin date info and signout info(year,month,day,hour,min,sec)");
    const staffMemberID = req.body.ID;
    const staffMemberType = req.body.type;
    if (!(staffMemberID && staffMemberType != undefined))
        return res.status(400).send("please enter the ID and the type of the staff Member");
    if (staffMemberID == ID && staffMemberType == type) {
        return res.status(400).send("you can't add sign in/out for yourself");
    }
    const staffMember = await Staff_Member.findOne({ ID: staffMemberID, type: staffMemberType });
    if (!staffMember)
        return res.status(400).send("please enter a valid ID and the type of the staff Member");
    const newSignSession = { status: 1, signin: new Date(signinYear, signinMonth - 1, signinDay, signinHour, signinMinute, signinSec, 0).getTime(), signout: new Date(signoutYear, signoutMonth - 1, signoutDay, signoutHour, signoutMinute, signoutSec, 0).getTime() };
    if (newSignSession.signin > newSignSession.signout) {
        return res.status(400).send("you can't make signout in a time before signin");
    }

    staffMember.attendanceRecord.push(newSignSession);

    await Staff_Member.updateOne({ ID: staffMemberID, type: staffMemberType }, staffMember);
    res.send("adding login/out has done successfully with signin date " + new Date(newSignSession.signin) + " and out at " + new Date(newSignSession.signout));
}

const viewStaffMemberAttendance = async (req, res) => {
    const staffMemberID = req.params.ID;
    const staffMembertype = req.params.type;
    if (staffMembertype == undefined || staffMemberID == undefined)
        return res.status(400).send("please enter both ID and type of the staff member");
    const mem = await Staff_Member.findOne({ ID: staffMemberID, type: staffMembertype });
    if (!mem)
        return res.status(400).send("there doesn't exist a member with this ID and type");
    const attendanceArray = mem.attendanceRecord;
    let responseArray = [];
    for (const record of attendanceArray) {
        record.status = (record.status == 1) ? "attedant" : "absent";
        if (record.signin && record.signout) {
            record.signin = new Date(record.signin);
            record.signout = new Date(record.signout);
            responseArray.push(record);
        }
    }
    res.send(responseArray);


}

const updateStaffMemberSalary = async (req, res) => {
    const staffMemberID = req.body.ID;
    const staffMembertype = req.body.type;
    const newSalary = req.body.salary;
    if (!newSalary || newSalary < 4000)
        return res.status(400).send("this salary is below the minimum salary");
    if (staffMembertype == undefined || staffMemberID == undefined)
        return res.status(400).send("please enter both ID and type of the staff member");
    const mem = await Staff_Member.findOne({ ID: staffMemberID, type: staffMembertype });
    if (!mem)
        return res.status(400).send("there doesn't exist a member with this ID and type");

    await Staff_Member.updateOne({ ID: staffMemberID, type: staffMembertype }, { salary: newSalary });
    res.send("staff member salary has been updated successfully");


}

const viewStaffMembersWithMissingHours = async (req, res) => {
    const allStaffMembers = await Staff_Member.find();
    if (!allStaffMembers) return res.status(400).send("there aren't any academic members yet");
    const accidentalLeaves = await Accidental_Leave_Request.find();
    const annualLeaves = await Annual_Leave_Request.find();

    const compensationLeaves = await Compensation_Leave_Request.find();

    const maternalityLeaves = await Maternity_Leave_Request.find();
    const sickLeaves = await Sick_Leave_Request.find();

    let allMissedMembers = [];
    for (const mem of allStaffMembers) {

        const missingHours = extraUtils.getMissingHours(mem, accidentalLeaves, annualLeaves, compensationLeaves, maternalityLeaves, sickLeaves);
        if (Number.isFinite(missingHours) && missingHours > 0) {
            const trimmedMem = extraUtils.trimMonogoObj(mem['_doc'], ["_id", "password", "__v"]);
            trimmedMem.attendanceRecord = trimmedMem.attendanceRecord.filter((x) => { return (x.signin && x.signout) }).map((x) => {
                x.signin = new Date(x.signin);
                x.signout = new Date(x.signout); return x;
            });

            allMissedMembers.push(trimmedMem);
        }
    }
    res.send(allMissedMembers);
}

const viewStaffMembersWithMissingDays = async (req, res) => {
    const staffMembers = await Staff_Member.find({});
    if (!staffMembers) {
        return res.send("there is no staff members in the database yet");
    }
    const accidentalLeaves = await Accidental_Leave_Request.find({});
    const annualLeaves = await Annual_Leave_Request.find();

    const compensationLeaves = await Compensation_Leave_Request.find();

    const maternalityLeaves = await Maternity_Leave_Request.find();
    const sickLeaves = await Sick_Leave_Request.find();

    let membersWithMissingDays = [];
    for (const mem of staffMembers) {
        const haveMissed = await extraUtils.haveMissingDays(mem, accidentalLeaves, annualLeaves, compensationLeaves, maternalityLeaves, sickLeaves);
        if (haveMissed) {
            const trimmedMem = extraUtils.trimMonogoObj(mem['_doc'], ["_id", "password", "__v"]);
            trimmedMem.attendanceRecord = trimmedMem.attendanceRecord.filter((x) => { return (x.signin && x.signout) }).map((x) => {
                x.signin = new Date(x.signin);
                x.signout = new Date(x.signout);
                return x;
            });

            membersWithMissingDays.push(trimmedMem);

        }
    }
    return res.send(membersWithMissingDays);
}

module.exports = {
    createLocation,
    updateLocation,
    deleteLocation,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    createCourse,
    updateCourse,
    deleteCourse,
    addMissingSignInOut,
    viewStaffMemberAttendance,
    updateStaffMemberSalary,
    viewStaffMembersWithMissingHours,
    viewStaffMembersWithMissingDays,

    viewAllLocations,
    viewAllCourses,
    viewAllFaculties,
    viewAllStaffMembers,
    viewAllDepartments,
    viewAllMembersProfiles,
}