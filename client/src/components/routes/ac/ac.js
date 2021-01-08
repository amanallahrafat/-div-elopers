import { Container } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import clsx from "clsx";
import { Component } from "react";
import { Redirect } from "react-router-dom";
import setAuthToken from "../../../actions/setAuthToken";
import Attendance from '../../Attendance';
import Navigation_Bar from '../../Navigation_Bar.js';
import Profile from '../../Profile';
import ViewMissingDaysForm from '../../ViewMissingDaysForm.js';
import Accidental_Leave_Request from "./Academic_Requests/Accidental_Leave/Accidental_Leave_List";
import Annual_Leave_Request from "./Academic_Requests/Annual_Leave/Annual_Leave_List";
import Change_Day_Off_Request from "./Academic_Requests/Change_Day_Off/Change_Day_Off_List";
import Compensation_Leave_Request from "./Academic_Requests/Compensation_Leave/Compensation_Leave_List";
import Maternity_Leave_Request from "./Academic_Requests/Maternity_leave/Maternity_Leave_List";
import Sick_Leave_Request from "./Academic_Requests/Sick_Leave/Sick_Leave_List";
import {
    getAllCoursesInstructorsNames,
    getAllMissingDays, getAllSentRequests,
    getReplacementRequests, requestSchedule,
    viewAllCourseSchedules
} from '../ac/ac_helper.js';
import Course_Schedule from "./All_Course_Schedule/Course_Schedule";
import Schedule from './Schedule_Handler/Schedule';


const requestUserProfile = async () => {
    const userProfile = await axios.get("/viewProfile");
    return userProfile.data;
};

const requestAttendanceRecods = async () => {
    const attendanceRecords = await axios.get("/viewAttendance");
    return attendanceRecords.data;
};

const drawerWidth = 240;

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
});

class AC extends Component {
    state = {
        isLoggedIn: 0,
        componentInMain: <div />,
        isAppBarShift: false,
    };

    setComponentInMain = async (event) => {
        console.log("Triggered");
        console.log(event);

        if (event == "profile") {
            console.log("profile")
            this.setState({
                componentInMain: <Profile
                    profile={await requestUserProfile()}
                    setComponentInMain={this.setComponentInMain} />
            });
        } else if (event == "attendance") {
            console.log("attendance")
            this.setState({
                componentInMain: <Attendance
                    attendanceRecords={await requestAttendanceRecods()}
                    setComponentInMain={this.setComponentInMain}
                />
            });
         } 
         else if (event == "viewMissingDays") {
            this.setState({
                componentInMain: (
                    <ViewMissingDaysForm
                        missedDays={await requestMissingDays()}
                    />
                )
            })
        }
        else if (event == "personalSchedule") {
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
    };
    async componentDidMount() {
        if (!localStorage.getItem("auth-token")) {
            this.setState({ isLoggedIn: 1 });
            return;
        }
        try {
            setAuthToken(localStorage.getItem("auth-token"));
            await axios.get("/authStaffMember");
            await axios.get('/authAcademicMember');
            this.setState({ isLoggedIn: 2 });
        } catch (err) {
            this.setState({ isLoggedIn: 1 });
        }
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
                    handleAppBarShift={this.handleAppBarShift}
                />
                <Container maxWidth="lg" style={{ marginTop: "100px" }} className={clsx({
                    [classes.appBarShift]: this.state.isAppBarShift,
                })}>
                    {this.state.componentInMain}
                </Container>

            </div>
        )
    }
  }
  
export default withStyles(styles)(AC);
