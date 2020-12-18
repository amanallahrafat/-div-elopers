const Academic_Member = require('../Models/Users/Academic_Member.js');

const createDepartment = async (departmentID,members)=>{
    if(members)
        for(const member of members){
            await Academic_Member.updateOne({ID : member} , {departmentID : departmentID});
        }
}

module.exports = {
    createDepartment,
}