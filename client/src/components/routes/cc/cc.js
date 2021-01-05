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
import Schedule from '../ac/Schedule_Handler/Schedule';
import Slot_Card from './Slot_Handler/Slot_Card.js';
import Schedule_Requests_Card from './Slot_Linking_Request/Schedule_Requests_Card.js';

const requestUserProfile = async () => {
    const userProfile = await axios.get("/viewProfile");
    return userProfile.data;
};

const requestAttendanceRecods = async () => {
    const attendanceRecords = await axios.get("/viewAttendance");
    return attendanceRecords.data;
};

const drawerWidth = 240;

const requestSchedule = async () => {
    const schedule = await axios.get("ac/viewSchedule");
    return schedule.data;
};

const getReplacementRequests = async () => {
    let res = (await axios.get('ac/viewReplacementRequests')).data;
    const userID = localStorage.getItem('ID');
    res = res.filter(r => r.senderID != userID && new Date(r.requestedDate).getTime() >= new Date(Date.now()).getTime());
    return res;
}

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

        await this.handleSlots();
        await this.handleSlotLinkingRequest();


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
        } else if (event == "schedule") {
            this.setState({firstTime : true});
            console.log("schedule")
            this.setState({
                componentInMain: <Schedule
                    schedule={await requestSchedule()}
                    replacementRequests={await getReplacementRequests()}
                    setComponentInMain={this.setComponentInMain}
                />
            });
        }
        else if(event == "slot"){
            console.log("slot")
            this.setState({
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
        // props-to-be-send => requests,slots,setInMain,handleSlots,handleSlotLinkingRequests,academicMembers,locations
        else if(event == "slotLinkingRequest"){
            console.log("slotLinkingRequests");
            console.log(this.state.slots);
            this.setState({
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
            this.setState({ isLoggedIn: 2 });
        } catch (err) {
            this.setState({ isLoggedIn: 1 });
        }
    }

    render() {
        // ******** TO BE ADDED IN EVERY ACADEMIC MEMBER
        const { classes } = this.props;
        //********************
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
                <Container maxWidth="lg" style={{ marginTop: "30px" }} className={clsx({
                    [classes.appBarShift]: this.state.isAppBarShift,
                })}>
                    {this.state.componentInMain}
                </Container>

            </div>
        )
    }
  }
  
export default withStyles(styles)(CC);
