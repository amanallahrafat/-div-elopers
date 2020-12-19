const Staff_Member = require("./Models/Users/Staff_Member")
let monthNum = 0;
const loop_year = async ()=>{
    setInterval(()=>{
        if(monthNum%12==0)
            setAccidentalLeaveBalance();
    // }, 26_298_000_00)
    }, 10*1000);
}

const loop_month = async (monthNum)=>{
    await setInterval(async()=>{
        await setAnnualLeaveBalance();
        if(monthNum%12==0){
            await setAccidentalLeaveBalance();
        }
        monthNum++;
        console.log(monthNum);
//    }, 26_298_000_00)
  }, 10*1000);

}

const setAccidentalLeaveBalance = async ()=>{
    const staffTable  = await Staff_Member.find();
    for(const staff  of staffTable)
        await Staff_Member.updateOne({ID: staff.ID},{accidentalLeaveBalance: 6});
}

const setAnnualLeaveBalance = async ()=>{
    const staffTable  = await Staff_Member.find();
    for(const staff  of staffTable){
        await Staff_Member.updateOne({ID: staff.ID},{annualBalance: staff.annualBalance +2.5});
    }
}

module.exports = {
    loop_year,
    loop_month,
}