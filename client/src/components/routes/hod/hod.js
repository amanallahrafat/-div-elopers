import { Container } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from '@material-ui/lab';
import axios from "axios";
import clsx from "clsx";
import { Component } from "react";
import { Redirect } from "react-router-dom";
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
import AccidentalLeaveRequest from './accidentalLeaveRequest.js';
import AnnualLeaveRequest from './annualLeaveRequest.js';
import ChangeDayOffRequest from './changeDayOffRequest.js';
import CompensationLeaveRequest from './compensationLeaveRequest.js';
import DepartmentCourses from './departmentCourses.js';
import ManageCourseInstructors from './ManageCourseInstructors.js';
import MaternityLeaveRequest from './maternityLeaveRequest.js';
import SickLeaveRequest from './sickLeaveRequest.js';
import ViewStaffProfiles from './viewStaffProfiles.js';
import AlertMessage from '../../Alert_Message.js';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const requestUserProfile = async (openAlert) => {
    try {
        const userProfile = await axios.get('/viewProfile');
        return userProfile.data;
    } catch (err) {
        openAlert(err.response.data);
        return {}
    }
}


const requestAttendanceRecods = async (openAlert) => {
    try {
        const attendanceRecords = await axios.get('/viewAttendance');
        return attendanceRecords.data;
    } catch (err) {
        openAlert(err.response.data);
        return []
    }
}

const requestDepartmentCourses = async (openAlert) => {
    try {
        const departmentCourses = await axios.get('/hod/getDepartmentCourses');
        return departmentCourses.data;
    } catch (err) {
        openAlert(err.response.data);
        return []
    }
}

const getAllAcademicMembers = async (openAlert) => {
    try {
        const res = await axios.get('/hod/getAllAcademicMembers');
        return res.data;
    } catch (err) {
        openAlert(err.response.data);
        return []
    }
}


const getAcademicMembersTable = async (openAlert) => {
    try {
        const res = await axios.get('/hod/getAcademicMembersTable');
        return res.data;
    } catch (err) {
        openAlert(err.response.data);
        return []
    }
}

const requestStaffProfiles = async (filter = "none", obj = {}, openAlert) => {
    try {
        if (filter == "none") {
            const res = await axios.get("/hod/viewDepartmentMembers");
            return res.data;
        } else if (filter == "course") {
            const res = await axios.get(
                `/hod/viewDepartmentMembersByCourse/${obj.courseID}`
            );
            return res.data;
        } else if (filter == "staffMember") {
            const res = await axios.get("/hod/viewDepartmentMembers");
            const out = res.data.filter((mem) => {
                return mem.ID.split("-")[1] == obj.ID;
            });
            return out;
        }

    } catch (err) {
        openAlert(err.response.data);
        return []
    }
}

const drawerWidth = 240;

const requestAllRequests = async (openAlert) => {
    try {
        const res = await axios.get('/hod/viewAllRequests');
        return res.data;
    } catch (err) {
        openAlert(err.response.data);
        return []
    }

}


const requestAllDepartmentCourses = async (openAlert) => {
    try {
        console.log("begin in request all department courses");
        const res = await axios.get('/hod/viewCourseTeachingAssignmentsLocal');
        console.log("end of  request all department courses", res.data);
        return res.data;

    } catch (err) {
        openAlert(err.response.data);
        return []
    }

}


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

const styles = (theme) => ({
    appBar: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
});

class HOD extends Component {
    state = {
        isLoggedIn: 0,
        componentInMain: <div />,
        staffProfiles: [],
        hodProfile: {},
        requests: [],
        requestsFirstTime: true,
        isAppBarShift: false,
        showAlert: false,
        alertMessage: "",
        errorType : "",
        backdropIsOpen: true,
    }
    openAlert = (message , type = "error") => {
        console.log("here*********************");
        this.setState({ showAlert: true, alertMessage: message, errorType : type });
    }
        setBackdropIsOpen=(val)=>{
        this.setState({backdropIsOpen:val})
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
        let uniqueProfiles = this.uniqBy(profiles, JSON.stringify)

        await this.setState({ staffProfiles: uniqueProfiles });

        return uniqueProfiles;
    }

    updateRequests = async (type = "", requestID = -1, newStatus = "") => {
        this.setBackdropIsOpen(true);
        console.log("2na hna")
        if (this.state.requestsFirstTime || requestID == -1) {
            const requests = await requestAllRequests(this.openAlert);
            this.setState({ requests: requests });

            this.setState({ requestsFirstTime: false });
            return requests;
        } else {
            const allRequests = this.state.requests;
            if (
                !allRequests.find((req) => {
                    return req.type == type;
                })
            )
                return [];
            let typeRequests = allRequests.find((req) => {
                return req.type == type;
            }).requests;
            for (const request of typeRequests) {
                if (request.ID == requestID) {
                    request.status = newStatus;
                }
            }
            this.setState({ requests: allRequests });
            return allRequests;
        }
        this.setBackdropIsOpen(false);
   
    }

    updateHODProfile = async () => {
        this.setState({ hodProfile: await requestUserProfile(this.openAlert) });
    }

    setComponentInMain = async (event) => {
        this.setState({ backdropIsOpen: true });

        if (event == "viewMissingDays") {
            await this.setState({
                componentInMain: (
                    <ViewMissingDaysForm
                        missedDays={await requestMissingDays()}
                    />
                )
            })
        }
        else if (event == "profile") {
            await this.setState({
                componentInMain: <Profile
                    profile={await requestUserProfile(this.openAlert)}
                    setComponentInMain={this.setComponentInMain}
                    openAlert={this.openAlert}
                />
            });
        } else if (event == "attendance") {
            await this.setState({
                componentInMain: <Attendance
                    attendanceRecords={await requestAttendanceRecods(this.openAlert)}
                    setComponentInMain={this.setComponentInMain}
                />
            });
        }
      else if (event == "manageCourseInstructors") {
            console.log("I am in event course")
            await this.setState({
                componentInMain: <ManageCourseInstructors
                    courses={await requestDepartmentCourses(this.openAlert)}
                    setComponentInMain={this.setComponentInMain}
                    academicMembers={await getAllAcademicMembers(this.openAlert)}
                    openAlert={this.openAlert}
                    setBackdropIsOpen={this.setBackdropIsOpen}
                  
                />
            });

        }
        else if (event == "viewStaffProfiles") {
            console.log("I am in event profiles")
            await this.setState({
                componentInMain: <ViewStaffProfiles
                    allCourses={await requestDepartmentCourses(this.openAlert)}
                    setComponentInMain={this.setComponentInMain}
                    academicMembers={await getAcademicMembersTable(this.openAlert)}
                    staffProfiles={this.state.staffProfiles}
                    hodProfile={this.state.hodProfile}
                    updateProfiles={this.updateRequestStaffProfile}
                    openAlert={this.openAlert}
                />
            });
        } else if (event == "changeDayOffRequest") {
            console.log(this.state.requests);
            await this.setState({
                componentInMain: <ChangeDayOffRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "change day off requests" }).requests}
                    openAlert={this.openAlert}
                />
            });

        } else if (event == "annualLeaveRequest") {
            await this.setState({
                componentInMain: <AnnualLeaveRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "annual leave requests" }).requests}
                    openAlert={this.openAlert}
                />
            });

        } else if (event == "accidentalLeaveRequest") {
            await this.setState({
                componentInMain: <AccidentalLeaveRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "accidental leave requests" }).requests}
                    openAlert={this.openAlert}
                />
            });


        } else if (event == "sickLeaveRequest") {
            await this.setState({
                componentInMain: <SickLeaveRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "sick leave requests" }).requests}
                    openAlert={this.openAlert}
                />
            });

        } else if (event == "maternityLeaveRequest") {
            await this.setState({
                componentInMain: <MaternityLeaveRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "maternity leave requests" }).requests}
                    openAlert={this.openAlert}
                />
            });

        } else if (event == "compensationLeaveRequest") {
            await this.setState({
                componentInMain: <CompensationLeaveRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "compensation leave requests" }).requests}
                    openAlert={this.openAlert}
                />
            });

        } else if (event == "departmentCourses") {
            await this.setState({
                componentInMain: <DepartmentCourses
                    setComponentInMain={this.setComponentInMain}
                    departmentCourses={await requestAllDepartmentCourses(this.openAlert)}
                    allCourses={await requestDepartmentCourses(this.openAlert)}
                    openAlert={this.openAlert}
                />
            });
        }
        else if (event == "personalSchedule") {
            console.log("personalSchedule")
            const requestsArr = (await getAllSentRequests());
            console.log(requestsArr)
            await this.setState({
                componentInMain: <Schedule
                    schedule={await requestSchedule()}
                    replacementRequests={await getReplacementRequests()}
                    sentReplacementRequests={requestsArr.requests[5]}
                    senderObj={requestsArr.senderObj}
                    setComponentInMain={this.setComponentInMain}
                    openAlert={this.openAlert}
                />
            });
        }
        else if (event == "allCourseSchedule") {
            console.log("allCourseSchedule")
            const requestsArr = (await getAllSentRequests());
            await this.setState({
                componentInMain: <Course_Schedule
                    departmentCourses={await viewAllCourseSchedules()}
                    allCourses={await getAllCoursesInstructorsNames()}
                    requests={requestsArr.requests[7]}
                    senderObj={requestsArr.senderObj}
                    openAlert={this.openAlert}
                />
            });
        }
        else if (event == "ac_changeDayOffRequest") {
            console.log("ac_changeDayOffRequest")
            const requestsArr = (await getAllSentRequests());
            await this.setState({
                componentInMain: <Change_Day_Off_Request
                    setComponentInMain={this.setComponentInMain}
                    requests={requestsArr.requests[2]}
                    senderObj={requestsArr.senderObj}
                    openAlert={this.openAlert}
                />
            });
        }
        else if (event == "ac_annualLeaveRequest") {
            console.log("ac_annualLeaveRequest")
            const requestsArr = (await getAllSentRequests());
            console.log(requestsArr);
            await this.setState({
                componentInMain: <Annual_Leave_Request
                    setComponentInMain={this.setComponentInMain}
                    requests={requestsArr.requests[1]}
                    senderObj={requestsArr.senderObj}
                    openAlert={this.openAlert}
                />
            });
        }
        else if (event == "ac_accidentalLeaveRequest") {
            console.log("ac_accidentalLeaveRequest")
            const requestsArr = (await getAllSentRequests());
            console.log(requestsArr);
            await this.setState({
                componentInMain: <Accidental_Leave_Request
                    setComponentInMain={this.setComponentInMain}
                    requests={requestsArr.requests[0]}
                    senderObj={requestsArr.senderObj}
                    openAlert={this.openAlert}
                />
            });
        }
        else if (event == "ac_maternityLeaveRequest") {
            console.log("ac_maternityLeaveRequest")
            const requestsArr = (await getAllSentRequests());
            await this.setState({
                componentInMain: <Maternity_Leave_Request
                    setComponentInMain={this.setComponentInMain}
                    requests={requestsArr.requests[4]}
                    senderObj={requestsArr.senderObj}
                    openAlert={this.openAlert}
                />
            });
        }
        else if (event == "ac_sickLeaveRequest") {
            console.log("ac_sickLeaveRequest")
            const requestsArr = (await getAllSentRequests());
            await this.setState({
                componentInMain: <Sick_Leave_Request
                    setComponentInMain={this.setComponentInMain}
                    requests={requestsArr.requests[6]}
                    senderObj={requestsArr.senderObj}
                    openAlert={this.openAlert}
                />
            });
        }
        else if (event == "ac_compensationLeaveRequest") {
            console.log("ac_compensationLeaveRequest")
            const requestsArr = (await getAllSentRequests());
            await this.setState({
                componentInMain: <Compensation_Leave_Request
                    setComponentInMain={this.setComponentInMain}
                    requests={requestsArr.requests[3]}
                    senderObj={requestsArr.senderObj}
                    missingDays={await getAllMissingDays()}
                    openAlert={this.openAlert}
                />
            });
        }
        this.setState({ backdropIsOpen: false });
    }
    handleAppBarShift = (event) => {
        this.setState({ isAppBarShift: event });
        console.log(this.state.isAppBarShift);
    };

    async componentDidMount() {
        this.setState({ backdropIsOpen: true });
        if (!localStorage.getItem("auth-token")) {
            this.setState({ isLoggedIn: 1 });
            return;
        }
        try {
            setAuthToken(localStorage.getItem("auth-token"));
            await axios.get("/authStaffMember");
            await axios.get("/authHOD");
            this.setState({ isLoggedIn: 2 });
        } catch (err) {
            this.setState({ isLoggedIn: 1 });
        }

        await this.updateRequestStaffProfile();
        await this.updateHODProfile();
        this.setState({ backdropIsOpen: false })
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
                    updateRequestStaffProfile={this.updateRequestStaffProfile}
                    updateRequests={this.updateRequests}
                    requestAllDepartmentCourses={requestAllDepartmentCourses}
                    handleAppBarShift={this.handleAppBarShift}
                    openAlert = {this.openAlert}
                />

                <Container maxWidth="lg" style={{ marginTop: "100px" }} className={clsx({
                    [classes.appBarShift]: this.state.isAppBarShift,
                })}>
                    {this.state.componentInMain}
                </Container>
                <AlertMessage open={this.state.showAlert} type={this.state.errorType} onClose={() => { this.setState({ showAlert: false }) }}
                    msg={this.state.alertMessage}
                />
                <Backdrop className={classes.backdrop} open={this.state.backdropIsOpen}
                    style={{ zIndex: 600000000 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        )
    }
}

export default withStyles(styles)(HOD);
