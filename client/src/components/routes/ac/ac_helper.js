import axios from "axios";

export const getAllSentRequests = async () => {
    try {
        const res = (await axios.get("/ac/viewAllRequests/0")).data;
        return res;
    } catch (err) {
        console.log(err.response.data);
    }
}

export const requestSchedule = async () => {
    const schedule = await axios.get("ac/viewSchedule");
    return schedule.data;
};

export const getReplacementRequests = async () => {
    let res = (await axios.get('ac/viewReplacementRequests')).data;
    const userID = localStorage.getItem('ID');
    res = res.filter(r => r.senderID != userID && new Date(r.requestedDate).getTime() >= new Date(Date.now()).getTime());
    return res;
}

export const viewAllCourseSchedules = async () => {
    const courseSchedules = await axios.get("/ac/viewAllCourseSchedules");
    return courseSchedules.data;
};

export const getAllCoursesInstructorsNames = async () => {
    const coursesInstructorName = await axios.get("/ac/getAllCoursesInstructorsNames");
    return coursesInstructorName.data;
};

export const getAllMissingDays = async () => {
    const missingDays = await axios.get("/viewMissingDays");
    return missingDays.data;
};
