const { request } = require("express")

const trimMonogoObj = (obj, deletedProperties) => {
    return Object.keys(obj).reduce((object, key) => {
        if (!deletedProperties.includes(key)) {
            object[key] = obj[key]
        }
        return object
    }, {})
}

const getDifferenceInDays = (date2, date1) => {
    date1 = new Date(date1);
    date2 = new Date(date2);
    const Difference_In_Time = date2.getTime() - date1.getTime();
    // To calculate the no. of days between two dates 
    return (Difference_In_Time / (1000 * 3600 * 24));
}

const isRequestInWeek = (RequestDate, date) => { // all dates are entered in normal format not in miliseconds
    const dateYear = date.getFullYear();
    const dateMonth = date.getMonth();
    const dateDay = date.getDate();

    const dateDayInWeek = date.getDay();
    const startDayOfWeek = new Date(dateYear, dateMonth, dateDay - ((dateDayInWeek + 1) % 7), 2, 0, 0, 0);
    const endDayOfWeek = new Date(dateYear, dateMonth, dateDay, dateDay - ((dateDayInWeek + 1) % 7) + 6, 2, 0, 0, 0);
    return (startDayOfWeek <= RequestDate && RequestDate <= endDayOfWeek);


}

const getMissingHours = (curStaffMember) => {
    // console.log(curStaffMember);
    // console.log("*********");
    const curDate = new Date();
    const curYear = curDate.getFullYear();
    const curMonth = curDate.getMonth();
    const curDay = curDate.getDate();
    // console.log(curDate);
    // console.log(curYear);
    // console.log(curMonth);
    // console.log(curDay);
    const startOfMonth = new Date(curYear, curMonth, 11, 2, 0, 0, 0);
    // console.log(startOfMonth);
    const endOfMonth = new Date(curYear, curMonth + 1, 10, 2, 0, 0, 0);
    if (curDay <= 10) {
        startOfMonth.setMonth(curMonth - 1);
        endOfMonth.setMonth(curMonth);
    }

    const staff_member = curStaffMember;
    const attendanceArray = staff_member.attendanceRecord;
    //console.log(attendanceArray);
    let attendedHours = 0;
    for (const record of attendanceArray) {
        if (record.signin && record.signout && startOfMonth.getTime() <= record.signin && record.signin <= endOfMonth.getTime()) {
            const signinDate = new Date(record.signin);
            const signinYear = signinDate.getFullYear();
            const signinMonth = signinDate.getMonth();
            const signinDay = signinDate.getDate();
            //   console.log(new Date(record.signin));
            //   console.log(new Date(record.signout));
            const startDate = new Date(signinYear, signinMonth, signinDay, 7, 0, 0, 0).getTime();
            const endDate = new Date(signinYear, signinMonth, signinDay, 19, 0, 0, 0).getTime();
            const startOfInterval = Math.max(startDate, record.signin);
            const endOfInterval = Math.min(endDate, record.signout);

            attendedHours += Math.max(0, (endOfInterval - startOfInterval) / (1000 * 60 * 60));
        }
    }
    // console.log(attendedHours+
    //     "**");
    const noOfDaysTillToday = getDifferenceInDays(startOfMonth, curDate);
    // console.log(noOfDaysTillToday);
    return missingHours = noOfDaysTillToday * 8.4 - attendedHours;
}

const twoDatesAreEqual = (date1, date2) => { // date entered as normal date not miliseconds
    return (date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getFullYear() == date2.getFullYear())
}

module.exports = {
    trimMonogoObj,
    getMissingHours,
    getDifferenceInDays,
    twoDatesAreEqual,
    isRequestInWeek
}