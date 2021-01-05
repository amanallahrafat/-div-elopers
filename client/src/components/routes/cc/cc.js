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
        locations : [],
        academicMembers : [],
        slots : [],
        isAppBarShift: false,
    };

    // decision 0 for add , 1 for update, 2 for delete
    handleSlots = async (obj , decision) =>{
        if(this.state.firstTime){
            this.setState({firstTime : false});
            let locations = await requestAllLocations();
            locations = locations.filter(elm => elm.type != 2);
            console.log("first time slots");
            const academicMembers = await requestAllAcademicMembers();
            const res = await requestAllSlots();
            this.setState({
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

        this.handleSlots();


        if (event == "profile") {
            this.setState({
                componentInMain: <Profile
                    profile={await requestUserProfile()}
                    setComponentInMain={this.setComponentInMain} />
            });
        } else if (event == "attendance") {
            this.setState({
                componentInMain: <Attendance
                    attendanceRecords={await requestAttendanceRecods()}
                    setComponentInMain={this.setComponentInMain}
                />
            });
        } else if (event == "schedule") {
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
            console.log("slot");
            console.log(this.state.slots);
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
        else if(event == "slotLinkingRequest"){

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
