const Staff_Member = require("./Models/Users/Staff_Member.js")

const loop_month = (halfMonthNum) => {
    setInterval(async() => {
        if (halfMonthNum % 24 == 0) {
            await setAccidentalLeaveBalance();
        }
        if (halfMonthNum % 2 == 0) {
            await setAnnualLeaveBalance();
        }
        halfMonthNum++;
        //console.log(monthNum);
    }, 1314900000);
    //}, 10 * 1000); // Testing
}

const setAccidentalLeaveBalance = async() => {
    const staffTable = await Staff_Member.find();
    for (const staff of staffTable) {
        await Staff_Member.updateOne({ "ID": staff.ID, "type": staff.type }, { accidentalLeaveBalance: 6 });
    }
}

const setAnnualLeaveBalance = async() => {
    const staffTable = await Staff_Member.find();
    for (const staff of staffTable) {
        await Staff_Member.update({ "ID": staff.ID, "type": staff.type }, { annualBalance: staff.annualBalance + 2.5 });
        console.log({ annualBalance: staff.annualBalance + 2.5 });
    }
}

module.exports = {
    loop_month,
}