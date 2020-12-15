const Academic_Member = require("../Models/Users/Academic_Member");
const Staff_Member = require("../Models/Users/Staff_Member");

const isStaffMember = async (ID)=>{
    const exist = await Staff_Member.find({ID: ID});
    if(exist.length>1){
        console.log("ERROR: THERE IS A BUG IN UNIQUNESS OF ID");
    }
    return exist.length==1;
}
const isStaffMember_arr = async (ID_arr)=>{
    const staff = (await Staff_Member.find()).map(obj=>  obj.ID);
    for(const ID of ID_arr){
        if(!staff.includes(ID))return false;
    }
    return true;
}

const isAcademicMember = async (ID)=>{
    const exist = await Academic_Member.find({ID: ID});
    if(exist.length>1){
        console.log("ERROR: THERE IS A BUG IN UNIQUNESS OF ID");
    }
    return exist.length==1;
}

const isAcademicMember_arr = async (ID_arr)=>{
    const academic = (await Academic_Member.find()).map(obj=>  obj.ID);
    for(const ID of ID_arr){
        if(!academic.includes(ID))return false;
    }
    return true;
}


