import { Container } from "@material-ui/core";
import axios from "axios";
import { Component } from "react";
import { Redirect } from 'react-router-dom';
import setAuthToken from "../../../actions/setAuthToken";
import Attendance from '../../Attendance';
import Navigation_Bar from '../../Navigation_Bar.js';
import Profile from '../../Profile';
import Schedule from '../ac/Schedule_Handler/Schedule';
import CICourses from './CICourses';
import ViewStaffProfiles from './CIViewStaffProfiles.js';
import ManageCourseStaff from './manageCourseStaff.js'
import { Alert, AlertTitle } from '@material-ui/lab';


import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from 'clsx';

const requestUserProfile = async (openAlert) => {
    try{
    const userProfile = await axios.get('/viewProfile');
    return userProfile.data;
    }catch(err){
        openAlert(err.response.data);
        return {};
    }
}

const requestDepartmentCourses = async (openAlert) => {
    try {
        const departmentCourses = await axios.get('/ci/getDepartmentCourses');
        return departmentCourses.data;
    }
    catch (err) {
        openAlert(err.response.data);
        return [];
    }
}
const requestAttendanceRecods = async (openAlert) => {
    try {
        const attendanceRecords = await axios.get('/viewAttendance');
        return attendanceRecords.data;
    } catch (err) {
        openAlert(err.response.data);
  
    }
}



const requestAllInstructorCourses = async (openAlert) => {

    console.log("begin in request all instructor courses");
    try{
    const res = await axios.get('/ci/viewSlotAssignmentLocal');

        console.log("end of  request all instructor courses", res.data);
        return res.data;
    }catch(err){
        openAlert(err.response.data);
        return undefined;
    }
}

const requestInstructorCourses = async (openAlert) => {

    console.log("begin in request all  courses");
    try {
        const departmentCourses = await axios.get('/ci/requestInstructorCoursesLocal');

        console.log("end in request all  courses");

        return departmentCourses.data;
    }
    catch (err) {
        openAlert(err.response.data);
        return [];
    }
}


const requestStaffProfiles = async (filter = "none", obj = {},openAlert) => {
    try{
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
        const res = await axios.get(`/ci/viewMembersByCourse/${obj.courseID}`);
        return res.data;
        }catch(err){
            openAlert(err.response.data);
            
        }
  }

const getAcademicMembersTable = async (openAlert) => {
    try {
        const res = await axios.get('/ci/getAcademicMembersTable');
        return res.data;
    } catch (err) {
        openAlert(err.response.data);
        return []
    }
}



const drawerWidth = 240;







const requestSchedule = async (openAlert) => {
    try {
        const schedule = await axios.get('ac/viewSchedule');
        return schedule.data;
    } catch (err) {
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


class CI extends Component {
    state = {
        isLoggedIn: 0,
        componentInMain: <div />,
        isAppBarShift: false,
        ciProfile: {},
        staffProfiles: [],
        departmentCourses: undefined,
        manageCourseStaff: [],
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
        //let uniqueProfiles = [];
        let uniqueProfiles = this.uniqBy(profiles, JSON.stringify)
        // uniqueProfiles = profiles.filter(function(item, pos) {
        //     return profiles.indexOf(item,(i)=>{return i.ID==item.ID}) == pos;
        // })
        console.log("before unique",profiles)
        
        console.log("after unique",uniqueProfiles)
        this.setState({ staffProfiles: uniqueProfiles });
        return uniqueProfiles;
  
    }
    updateRequestCourseStaff = async (obj = { courseID: -1 }) => {
       
        if (obj.courseID == -1) {
            this.setState({ manageCourseStaff: [] });

            return [];
        }
        const manageCourseStaff = await requestCourseStaffProfiles(obj,this.openAlert);
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

export default withStyles(styles)(CI);