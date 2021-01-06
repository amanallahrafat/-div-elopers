import { Container } from "@material-ui/core";
import axios from "axios";
import { Component } from "react";
import { Redirect } from 'react-router-dom';
import setAuthToken from "../../../actions/setAuthToken";
import Attendance from '../../Attendance';
import Navigation_Bar from '../../Navigation_Bar.js';
import Profile from '../../Profile';
import Schedule from '../ac/Schedule_Handler/Schedule';
import AccidentalLeaveRequest from './accidentalLeaveRequest.js';
import AnnualLeaveRequest from './annualLeaveRequest.js';
import ChangeDayOffRequest from './changeDayOffRequest.js';
import CompensationLeaveRequest from './compensationLeaveRequest.js';
import ManageCourseInstructors from './ManageCourseInstructors.js';
import MaternityLeaveRequest from './maternityLeaveRequest.js';
import SickLeaveRequest from './sickLeaveRequest.js';
import ViewStaffProfiles from './viewStaffProfiles.js';
import { Alert, AlertTitle } from '@material-ui/lab';
import DepartmentCourses from'./departmentCourses.js';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from 'clsx';

const requestUserProfile = async (openAlert) => {
    try{
    const userProfile = await axios.get('/viewProfile');
    return userProfile.data;
    }catch(err){
        openAlert(err.response.data);
        return {}
    }
}


const requestAttendanceRecods = async (openAlert) => {
    try{
    const attendanceRecords = await axios.get('/viewAttendance');
    return attendanceRecords.data;
    }catch(err){
        openAlert(err.response.data);
        return []
    }
}

const requestDepartmentCourses = async (openAlert) => {
    try{
    const departmentCourses = await axios.get('/hod/getDepartmentCourses');
    return departmentCourses.data;
    }catch(err){
        openAlert(err.response.data);
        return []
    }
}

const getAllAcademicMembers = async (openAlert) => {
    try{
    const res = await axios.get('/hod/getAllAcademicMembers');
    return res.data;
    }catch(err){
        openAlert(err.response.data);
        return []
    }
}


const getAcademicMembersTable = async (openAlert) => {
    try{
    const res = await axios.get('/hod/getAcademicMembersTable');
    return res.data;
    }catch(err){
        openAlert(err.response.data);
        return []
    }
}

const requestStaffProfiles = async (filter = "none", obj = {},openAlert) => {
    try{
    if (filter == "none") {
        const res = await axios.get('/hod/viewDepartmentMembers');
        return res.data;

    } else if (filter == "course") {
        const res = await axios.get(`/hod/viewDepartmentMembersByCourse/${obj.courseID}`);
        return res.data;

    } else if (filter == "staffMember") {
        const res = await axios.get('/hod/viewDepartmentMembers');
        const out = res.data.filter((mem) => { return mem.ID.split("-")[1] == obj.ID });
        return out;

    }
}catch(err){
    openAlert(err.response.data);
    return []
}
}

const drawerWidth = 240;

const requestAllRequests = async (openAlert) => {
    try{
    const res = await axios.get('/hod/viewAllRequests');
    return res.data;
    }catch(err){
        openAlert(err.response.data);
        return []
    }

} 


const requestAllDepartmentCourses = async (openAlert)=>{
    try{
    console.log("begin in request all department courses");
    const res = await axios.get('/hod/viewCourseTeachingAssignmentsLocal');
   
    console.log("end of  request all department courses" ,res.data);
    return res.data;
    }catch(err){
        openAlert(err.response.data);
        return []
    }

} 

// const getAllAcademicMembers = async()=>{
//     const res = await axios.get('/hod/getAllAcademicMembers');
//     return res.data;
// }


const requestSchedule = async (openAlert) => {
    try{
    const schedule = await axios.get('ac/viewSchedule');
    return schedule.data;
    }catch(err){
        openAlert(err.response.data);
 
    }
}

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

class HOD extends Component {
    state = {
        isLoggedIn: 0,
        componentInMain: <div />,
        staffProfiles: [],
        hodProfile: {},
        requests: [],

        requestsFirstTime: true,
        isAppBarShift: false,
        showAlert:false,
        alertMessage:"testing"
   
    }
    openAlert=(message)=>{
        this.setState({showAlert:true,alertMessage:message})
    }

    uniqBy(a, key) {
        var seen = {};
        return a.filter(function(item) {
            var k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        })
    }


    updateRequestStaffProfile = async (filter = "none", obj = {}) => {
        const profiles = await requestStaffProfiles(filter, obj,this.openAlert);
        let uniqueProfiles = this.uniqBy(profiles, JSON.stringify)

        this.setState({ staffProfiles: uniqueProfiles });
        return uniqueProfiles;
    }

    updateRequests = async (type = "", requestID = -1, newStatus = "") => {
        if (this.state.requestsFirstTime || requestID == -1) {
            const requests = await requestAllRequests(this.openAlert);
            this.setState({ requests: requests });

            this.setState({ requestsFirstTime: false })
            return requests;
        } else {
            const allRequests = this.state.requests;
            if (!allRequests.find((req) => { return req.type == type })) return [];
            let typeRequests = allRequests.find((req) => { return req.type == type }).requests;
            for (const request of typeRequests) {
                if (request.ID == requestID) {
                    request.status = newStatus;
                }

            }
            this.setState({ requests: allRequests });
            return allRequests;
        }

    }

    updateHODProfile = async () => {
        this.setState({ hodProfile: await requestUserProfile(this.openAlert) });
    }

    setComponentInMain = async (event) => {
        if (event == "profile") {
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
        } else if (event == "schedule") {
            console.log("schedule")
            this.setState({
                componentInMain: <Schedule
                    schedule={await requestSchedule(this.openAlert)}
                    openAlert={this.openAlert}
                />
            });
        }
        else if (event == "manageCourseInstructors") {
            console.log("I am in event course")

            this.setState({
                componentInMain: <ManageCourseInstructors
                    courses={await requestDepartmentCourses(this.openAlert)}
                    setComponentInMain={this.setComponentInMain}
                    academicMembers={await getAllAcademicMembers(this.openAlert)}
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
                    hodProfile={this.state.hodProfile}
                    updateProfiles={this.updateRequestStaffProfile}
                    openAlert={this.openAlert}
                />
            });
        } else if (event == "changeDayOffRequest") {
            console.log(this.state.requests);
            this.setState({
                componentInMain: <ChangeDayOffRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "change day off requests" }).requests}
                    openAlert={this.openAlert}
                />
            });

        } else if (event == "annualLeaveRequest") {
            this.setState({
                componentInMain: <AnnualLeaveRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "annual leave requests" }).requests}
                    openAlert={this.openAlert}
                />
            });

        } else if (event == "accidentalLeaveRequest") {
            this.setState({
                componentInMain: <AccidentalLeaveRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "accidental leave requests" }).requests}
                    openAlert={this.openAlert}
         
                    />
            });


        } else if (event == "sickLeaveRequest") {
            this.setState({
                componentInMain: <SickLeaveRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "sick leave requests" }).requests}
                    openAlert={this.openAlert}
         
                    />
            });

        } else if (event == "maternityLeaveRequest") {
            this.setState({
                componentInMain: <MaternityLeaveRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "maternity leave requests" }).requests}
                    openAlert={this.openAlert}
         
                    />
            });

        } else if (event == "compensationLeaveRequest") {
            this.setState({
                componentInMain: <CompensationLeaveRequest
                    setComponentInMain={this.setComponentInMain}
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req) => { return req.type == "compensation leave requests" }).requests}
                    openAlert={this.openAlert}
         
                    />
            });
        
        }else if (event=="departmentCourses"){
            this.setState({
                componentInMain: <DepartmentCourses
                    setComponentInMain={this.setComponentInMain} 
                    departmentCourses={await requestAllDepartmentCourses(this.openAlert)}
                    allCourses={await requestDepartmentCourses(this.openAlert)}
                    openAlert={this.openAlert}
         
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
            this.setState({ isLoggedIn: 2 });

        }
        catch (err) {
            this.setState({ isLoggedIn: 1 });
        }

        await this.updateRequestStaffProfile();
        await this.updateHODProfile();
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
                />
                 <Alert style={(!this.state.showAlert)?{display:'none'}:{}} severity="error"  onClose={()=> {this.setState({showAlert:false})}}>
                    <AlertTitle>Error</AlertTitle>
                  <strong>{this.state.alertMessage}</strong>
                </Alert>

                <Container maxWidth="lg" style={{ marginTop: "30px" }} className={clsx({
                    [classes.appBarShift]: this.state.isAppBarShift,
                })}>
                    {this.state.componentInMain}
                </Container>

            </div>
        )
    }
}

export default withStyles(styles)(HOD);