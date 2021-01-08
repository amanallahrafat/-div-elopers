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
import Slot_Card from './Slot_Handler/Slot_Card.js';
import Schedule_Requests_Card from './Slot_Linking_Request/Schedule_Requests_Card.js';
import ViewMissingDaysForm from '../../ViewMissingDaysForm.js';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const requestUserProfile = async () => {
    const userProfile = await axios.get("/viewProfile");
    return userProfile.data;
};

const requestAttendanceRecods = async () => {
    const attendanceRecords = await axios.get("/viewAttendance");
    return attendanceRecords.data;
};

const drawerWidth = 240;

const requestAllSlots = async () =>{
    return (await axios.get("cc/viewAllSlots")).data;
}

const requestAllLocations = async () =>{
    return (await axios.get('cc//viewAllLocations')).data;
}

const requestAllAcademicMembers = async () =>{
    return (await axios.get('cc/viewAllMembersProfiles')).data;
}

const requestAllSlotLinkingRequests = async () => {
    return (await axios.get('/cc/viewSlotLinkingRequests')).data;
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

class CC extends Component {
    state = {
        isLoggedIn: 0,
        componentInMain: <div />,
        firstTime : true,
        firstTimeRequests : true,
        locations : [],
        academicMembers : [],
        slots : [],
        slotLinkingRequests : [],
        isAppBarShift: false,
    };

    // decision 0 for rejected, 1 for accepted
    handleSlotLinkingRequest = async (requestID,decision) => {
        if(this.state.firstTimeRequests){
            const requests = await requestAllSlotLinkingRequests();
            this.setState({
                firstTimeRequests : false,
                slotLinkingRequests : requests
            })
        }
        else if(decision == 0){
            const requests = this.state.slotLinkingRequests.filter(elm => elm.ID != requestID);
            const request = (this.state.slotLinkingRequests.filter(elm => elm.ID == requestID))[0];
            request.status = "rejected";
            console.log(request);
            requests.push(request);
            this.setState({slotLinkingRequests : requests});
        }
        else if(decision == 1){
            const requests = this.state.slotLinkingRequests.filter(elm => elm.ID != requestID);
            const request = (this.state.slotLinkingRequests.filter(elm => elm.ID == requestID))[0];
            request.status = "accepted";
            requests.push(request);
            const slots = this.state.slots.filter(elm => elm.ID != request.slotID);
            const updatedSlot = (this.state.slots.filter(elm => elm.ID == request.slotID))[0];
            updatedSlot.instructor = request.senderID;
            slots.push(updatedSlot);
            console.log(updatedSlot);
            console.log(request);
            this.setState({
                slots : slots,
                slotLinkingRequests : requests
            });
        }
    }

    // decision 0 for add , 1 for update, 2 for delete
    handleSlots = async (obj , decision) =>{
        if(this.state.firstTime){
            let locations = await requestAllLocations();
            locations = locations.filter(elm => elm.type != 2);
            console.log("first time slots");
            const academicMembers = await requestAllAcademicMembers();
            const res = await requestAllSlots();
            this.setState({
                firstTime : false,
                courseID : res.ID,
                slots : res.slots,
                locations : locations,
                academicMembers : academicMembers
            });
        }
        else if (decision == 0){
            const slots = this.state.slots;
            slots.push(obj);
            this.setState({slots : slots});
        }
        else if (decision == 1){
            console.log("update");
            const slots = this.state.slots.filter(elm => elm.ID != obj.ID);
            slots.push(obj);
            this.setState({slots : slots});
        }
        else if( decision == 2){
            const slots = this.state.slots.filter(elm => elm.ID != obj.slotID);
            this.setState({slots : slots});
        }
    }

    setComponentInMain = async (event) => {
        this.setState({ backdropIsOpen: true });

        console.log("Triggered");
        console.log(event);
        await this.handleSlots();
        await this.handleSlotLinkingRequest();

        if (event == "profile") {
            console.log("profile")
            await this.setState({
                componentInMain: <Profile
                    profile={await requestUserProfile()}
                    setComponentInMain={this.setComponentInMain} />
            });
        } else if (event == "attendance") {
            console.log("attendance")
            await this.setState({
                componentInMain: <Attendance
                    attendanceRecords={await requestAttendanceRecods()}
                    setComponentInMain={this.setComponentInMain}
                />
            });
         } 
         else if (event == "viewMissingDays") {
            await this.setState({
                componentInMain: (
                    <ViewMissingDaysForm
                        missedDays={await requestMissingDays()}
                    />
                )
            })
        }
        else if(event == "slot"){
            console.log("slot")
            await this.setState({
                componentInMain: <Slot_Card
                    schedule={this.state.slots}
                    courseID = {this.state.courseID}
                    locations = {this.state.locations}
                    academicMembers = {this.state.academicMembers}
                    handleSlots = {this.handleSlots}
                    setComponentInMain={this.setComponentInMain}
                />
            });
        }
        else if(event == "slotLinkingRequest"){
            console.log("slotLinkingRequests");
            console.log(this.state.slots);
            await this.setState({
                componentInMain: <Schedule_Requests_Card
                    requests = {this.state.slotLinkingRequests}
                    slots = {this.state.slots}
                    courseID = {this.state.courseID}
                    locations = {this.state.locations}
                    academicMembers = {this.state.academicMembers}
                    handleSlotLinkingRequest = {this.handleSlotLinkingRequest}
                    handleSlots = {this.handleSlots}
                    setComponentInMain={this.setComponentInMain}
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
                />
            });
        }

        this.setState({ backdropIsOpen: false });
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
            await axios.get('/authCourseCoordinator');
            console.log("here");
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
                <Backdrop className={classes.backdrop} open={this.state.backdropIsOpen}
                    style={{ zIndex: 600000000 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        )
    }
  }
  
export default withStyles(styles)(CC);
