import { Container } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from '@material-ui/lab';
import axios from "axios";
import clsx from 'clsx';
import { Component } from "react";
import { Redirect } from 'react-router-dom';
import setAuthToken from "../../../actions/setAuthToken";
import Attendance from '../../Attendance';
import Navigation_Bar from '../../Navigation_Bar.js';
import Profile from '../../Profile';
import ViewMissingDaysForm from '../../ViewMissingDaysForm.js';
import Accidental_Leave_Request from "../ac/Academic_Requests/Accidental_Leave/Accidental_Leave_List";
import Annual_Leave_Request from "../ac/Academic_Requests/Annual_Leave/Annual_Leave_List";
import Change_Day_Off_Request from "../ac/Academic_Requests/Change_Day_Off/Change_Day_Off_List";
import Compensation_Leave_Request from "../ac/Academic_Requests/Compensation_Leave/Compensation_Leave_List";
import Maternity_Leave_Request from "../ac/Academic_Requests/Maternity_leave/Maternity_Leave_List";
import Sick_Leave_Request from "../ac/Academic_Requests/Sick_Leave/Sick_Leave_List";
import {
    getAllCoursesInstructorsNames,
    getAllMissingDays, getAllSentRequests,
    getReplacementRequests, requestSchedule,
    viewAllCourseSchedules
} from '../ac/ac_helper.js';
import Course_Schedule from "../ac/All_Course_Schedule/Course_Schedule";
import Schedule from '../ac/Schedule_Handler/Schedule';
import CICourses from './CICourses';
import ViewStaffProfiles from './CIViewStaffProfiles.js';
import ManageCourseStaff from './manageCourseStaff.js';

const requestMissingDays = async () => {
    const res = await axios.get('/viewMissingDays');
    const dates = res.data;
    const mappedDates = [];
    for (const date of dates) {
        mappedDates.push({ date: (new Date(date)).toLocaleString() + "" })
    }
    console.log(mappedDates);
    return mappedDates;
}

const requestUserProfile = async (openAlert) => {
    try{
    console.log("start CI request user profile")
    const userProfile = await axios.get('/viewProfile');
    console.log("end CI request user profile") 
    return userProfile.data;
    }catch(err){
       openAlert(err.response.data);
        return {};
    }
}

const requestDepartmentCourses = async (openAlert) => {
    try {
        console.log("start CI request department courses")
  
        const departmentCourses = await axios.get('/ci/getDepartmentCourses');
        console.log("end CI request department courses")
  
        return departmentCourses.data;
    }
    catch (err) {
        openAlert(err.response.data);
        return [];
    }
}
const requestAttendanceRecods = async (openAlert) => {
    try {
        console.log("start CI request attendance records")
  
        const attendanceRecords = await axios.get('/viewAttendance');
        console.log("end CI request attendance records")
        
        return attendanceRecords.data;
    } catch (err) {
        openAlert(err.response.data);

    }
}

const requestAllInstructorCourses = async (openAlert) => {

    console.log("begin in request all instructor courses");
    try {
        const res = await axios.get('/ci/viewSlotAssignmentLocal');

        console.log("end of  request all instructor courses", res.data);
        return res.data;
    } catch (err) {
        openAlert(err.response.data);
        return undefined;
    }
}

const requestInstructorCourses = async (openAlert) => {

    console.log("begin in request instructor  courses");
    try {
        const departmentCourses = await axios.get('/ci/requestInstructorCoursesLocal');

        console.log("end in request instructor  courses");

        return departmentCourses.data;
    }
    catch (err) {
        openAlert(err.response.data);
        return [];
    }
}



const requestStaffProfiles = async (filter = "none", obj = {},openAlert) => {
    try{
        console.log("start CI request staff profiles")
  
        if (filter == "none") {
            const res = await axios.get('/ci/viewDepartmentMembers');
            return res.data;

        } else if (filter == "course") {
            const res = await axios.get(`/ci/viewDepartmentMembersByCourse/${obj.courseID}`);
            return res.data;

        } else if (filter == "staffMember") {
            const res = await axios.get('/ci/viewDepartmentMembers');
            const out = res.data.filter((mem) => { return mem.ID.split("-")[1] == obj.ID });
            return out;

        }
        console.log("end CI request staff profiles")
  
    }catch(err){
        openAlert(err.response.data);
    }

}

const requestCourseStaffProfiles = async (obj,openAlert) => {
        if (obj.courseID == -1) {
            console.log("obj ID is -1")
            return [];
        }
        try{
            console.log("start CI request course staff profiles")
  
        const res = await axios.get(`/ci/viewMembersByCourse/${obj.courseID}`);
        console.log("end CI request course staff profiles")
  
        return res.data;
    } catch (err) {
        openAlert(err.response.data);

    }
}

const getAcademicMembersTable = async (openAlert) => {
    try {
        console.log("start CI get academic members table")
  
        const res = await axios.get('/ci/getAcademicMembersTable');
        console.log("end CI get academic members table")
  
        return res.data;
    } catch (err) {
        openAlert(err.response.data);
        return []
    }
}

const drawerWidth = 240;
 
const styles = (theme) => ({
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
});

class CI extends Component {
    state = {
        isLoggedIn: 0,
        componentInMain: <div />,
        isAppBarShift: false,
        ciProfile: {},
        staffProfiles: [],
        departmentCourses: undefined,
        manageCourseStaff: [],
        showAlert: false,
        alertMessage: "testing"
    }
    openAlert = (message) => {
        
        this.setState({ showAlert: true, alertMessage: message })
    }

    uniqBy(a, key) {
        var seen = {};
        return a.filter(function (item) {
            var k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        })
    }

    updateRequestStaffProfile = async (filter = "none", obj = {}) => {
        const profiles = await requestStaffProfiles(filter, obj, this.openAlert);
        //let uniqueProfiles = [];
        let uniqueProfiles = this.uniqBy(profiles, JSON.stringify)
        // uniqueProfiles = profiles.filter(function(item, pos) {
        //     return profiles.indexOf(item,(i)=>{return i.ID==item.ID}) == pos;
        // })
        console.log("before unique", profiles)

        console.log("after unique", uniqueProfiles)
        this.setState({ staffProfiles: uniqueProfiles });
        return uniqueProfiles;

    }
    updateRequestCourseStaff = async (obj = { courseID: -1 }) => {

        if (obj.courseID == -1) {
            this.setState({ manageCourseStaff: [] });

            return [];
        }
        const manageCourseStaff = await requestCourseStaffProfiles(obj, this.openAlert);
        this.setState({ manageCourseStaff: manageCourseStaff });
        return manageCourseStaff;
    }
    updateDepartmentCourses = async () => {
        console.log("begin in update department course");
        const departmentCourses = await requestAllInstructorCourses(this.openAlert);
        this.setState({ departmentCourses: departmentCourses });
        console.log("end update department courses")
        return departmentCourses;
    }

    updateCIProfile = async () => {
        this.setState({ ciProfile: await requestUserProfile(this.openAlert) });

    }

    setComponentInMain = async (event) => {
        if (event == "profile") {
            console.log("set comp in main with profile")
            this.setState({
                componentInMain: <Profile
                    profile={await requestUserProfile(this.openAlert)}
                    setComponentInMain={this.setComponentInMain}
                    openAlert={this.openAlert}
                />
            });
        } else if (event == "attendance") {
            this.setState({
                componentInMain: <Attendance
                    attendanceRecords={await requestAttendanceRecods(this.openAlert)}
                    setComponentInMain={this.setComponentInMain}
                    openAlert={this.openAlert}
                />
            });

        } else if (event == "viewMissingDays") {
            this.setState({
                componentInMain: (
                    <ViewMissingDaysForm
                        missedDays={await requestMissingDays()}
                    />
                )
            })
        }
        else if (event == "instructorCourses") {
            console.log("instructorCourses")
            this.setState({
                componentInMain: <CICourses
                    departmentCourses={await requestAllInstructorCourses(this.openAlert)}
                    allCourses={await requestInstructorCourses(this.openAlert)}
                    academicMembers={await getAcademicMembersTable(this.openAlert)}
                    setComponentInMain={this.setComponentInMain}
                    updateDepartmentCourses={this.updateDepartmentCourses}
                    openAlert={this.openAlert}

                />
            });
        }
        else if (event == "viewStaffProfiles") {
            console.log("I am in event profiles")
            this.setState({
                componentInMain: <ViewStaffProfiles
                    allCourses={await requestDepartmentCourses(this.openAlert)}
                    setComponentInMain={this.setComponentInMain}
                    academicMembers={await getAcademicMembersTable(this.openAlert)}
                    staffProfiles={this.state.staffProfiles}
                    hodProfile={this.state.ciProfile}
                    updateProfiles={this.updateRequestStaffProfile}
                    openAlert={this.openAlert}
                />
            });
        }
        else if (event == "manageCourseStaff") {
            console.log("I am in event of manage course staff")
            this.setState({
                componentInMain: <ManageCourseStaff
                    allCourses={await requestInstructorCourses(this.openAlert)}
                    setComponentInMain={this.setComponentInMain}
                    academicMembers={await getAcademicMembersTable(this.openAlert)}
                    staffProfiles={this.state.manageCourseStaff}
                    hodProfile={this.state.ciProfile}
                    updateProfiles={this.updateRequestCourseStaff}
                    openAlert={this.openAlert}
                />
            });
        } else if (event == "personalSchedule") {
            console.log("personalSchedule")
            const requestsArr = (await getAllSentRequests());
            console.log(requestsArr)
            this.setState({
                componentInMain: <Schedule
                    schedule={await requestSchedule()}
                    replacementRequests={await getReplacementRequests()}
                    sentReplacementRequests={requestsArr.requests[5]}
                    senderObj={requestsArr.senderObj}
                    setComponentInMain={this.setComponentInMain}

                />
            });
        }
        else if (event == "allCourseSchedule") {
            console.log("allCourseSchedule")
            const requestsArr = (await getAllSentRequests());
            this.setState({
                componentInMain: <Course_Schedule
                    departmentCourses={await viewAllCourseSchedules()}
                    allCourses={await getAllCoursesInstructorsNames()}
                    requests={requestsArr.requests[7]}
                    senderObj={requestsArr.senderObj}
                    
                />
            });
        }
        else if (event == "ac_changeDayOffRequest") {
            console.log("ac_changeDayOffRequest")
            const requestsArr = (await getAllSentRequests());
            this.setState({
                componentInMain: <Change_Day_Off_Request
                    setComponentInMain={this.setComponentInMain}
                    requests={requestsArr.requests[2]}
                    senderObj={requestsArr.senderObj}
                />
            });
        }
        else if (event == "ac_annualLeaveRequest") {
            console.log("ac_annualLeaveRequest")
            const requestsArr = (await getAllSentRequests());
            console.log(requestsArr);
            this.setState({
                componentInMain: <Annual_Leave_Request
                    setComponentInMain={this.setComponentInMain}
                    requests={requestsArr.requests[1]}
                    senderObj={requestsArr.senderObj}
                />
            });
        }
        else if (event == "ac_accidentalLeaveRequest") {
            console.log("ac_accidentalLeaveRequest")
            const requestsArr = (await getAllSentRequests());
            console.log(requestsArr);
            this.setState({
                componentInMain: <Accidental_Leave_Request
                    setComponentInMain={this.setComponentInMain}
                    requests={requestsArr.requests[0]}
                    senderObj={requestsArr.senderObj}
                />
            });
        }
        else if (event == "ac_maternityLeaveRequest") {
            console.log("ac_maternityLeaveRequest")
            const requestsArr = (await getAllSentRequests());
            this.setState({
                componentInMain: <Maternity_Leave_Request
                    setComponentInMain={this.setComponentInMain}
                    requests={requestsArr.requests[4]}
                    senderObj={requestsArr.senderObj}
                />
            });
        }
        else if (event == "ac_sickLeaveRequest") {
            console.log("ac_sickLeaveRequest")
            const requestsArr = (await getAllSentRequests());
            this.setState({
                componentInMain: <Sick_Leave_Request
                    setComponentInMain={this.setComponentInMain}
                    requests={requestsArr.requests[6]}
                    senderObj={requestsArr.senderObj}
                />
            });
        }
        else if (event == "ac_compensationLeaveRequest") {
            console.log("ac_compensationLeaveRequest")
            const requestsArr = (await getAllSentRequests());
            this.setState({
                componentInMain: <Compensation_Leave_Request
                    setComponentInMain={this.setComponentInMain}
                    requests={requestsArr.requests[3]}
                    senderObj={requestsArr.senderObj}
                    missingDays={await getAllMissingDays()}
                />
            });
        }
    }

    handleAppBarShift = (event) => {
        this.setState({ isAppBarShift: event });
        console.log(this.state.isAppBarShift)
    }

    async componentDidMount() {
        if (!localStorage.getItem('auth-token')) {
            this.setState({ isLoggedIn: 1 });
            return;
        }
        try {
            setAuthToken(localStorage.getItem('auth-token'));
            await axios.get('/authStaffMember');
            await axios.get('/authCourseInstructor');
            this.setState({ isLoggedIn: 2 });

        }
        catch (err) {
            this.setState({ isLoggedIn: 1 });
        }

        await this.updateCIProfile();
    }

    render() {
        const { classes } = this.props;

        if (this.state.isLoggedIn === 0)
            return <div />;
        if (this.state.isLoggedIn === 1) {
            return <Redirect to='/' />;
        }
        return (
            <div >

                <Navigation_Bar fromParent={this.setComponentInMain}
                    requestAllDepartmentCourses={requestInstructorCourses}

                    updateRequestStaffProfile={this.updateRequestStaffProfile}
                    updateRequestCourseStaff={this.updateRequestCourseStaff}
                    handleAppBarShift={this.handleAppBarShift}
                />
                <Alert style={(!this.state.showAlert) ? { display: 'none' } : {}} severity="error" onClose={() => { this.setState({ showAlert: false }) }}>
                    <AlertTitle>Error</AlertTitle>
                    <strong>{this.state.alertMessage}</strong>
                </Alert>


                <Container maxWidth="lg" style={{ marginTop: "100px" }} className={clsx({
                    [classes.appBarShift]: this.state.isAppBarShift,
                })}>

                    {this.state.componentInMain}
                </Container>

            </div>
        )
    }
}

export default withStyles(styles)(CI);