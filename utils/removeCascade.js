const Academic_Member = require('../Models/Users/Academic_Member.js');
const Course = require('../Models/Academic/Course.js');
const Location = require('../Models/Others/Location.js');
const Staff_Member = require('../Models/Users/Staff_Member.js');
const Faculty = require('../Models/Academic/Faculty.js');

const removeLocation = async(ID)=>{
    await Staff_Member.updateMany({officeID : ID},{$unset:{officeID : 1}});
}

const removeDepartment = async(ID)=>{
    //const members = await Academic_Member.find({departmentID : ID});
    await Academic_Member.updateMany({departmentID :ID}, {$unset:{departmentID: 1}});
    const courses = await Course.find();
    for(const course of courses){
        if(course.department.includes(ID)){
            const updatedArray = course.department.filter(id=> id != ID);
            await Course.updateOne({ID : course.ID},{department : updatedArray});
        }
    }
    const faculties = await Faculty.find();
    for(const faculty of faculties){
        if(faculty.departments.includes(ID)){
            const updatedArray = faculty.departments.filter(id => id != ID);
            await Faculty.updateOne({name : faculty.name} , {departments : updatedArray});
        }
    }
}

module.exports = {
    removeLocation,
    removeDepartment,
}