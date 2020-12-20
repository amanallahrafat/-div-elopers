const Staff_Member = require("./Models/Users/Staff_Member.js")

const loop_month = (monthNum) => {
    setInterval(async() => {
        if (monthNum % 12 == 0) {
            await setAccidentalLeaveBalance();
        }
        await setAnnualLeaveBalance();
        monthNum++;
        //console.log(monthNum);
    }, 2629800000);
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