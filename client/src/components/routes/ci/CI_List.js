import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DateRangeIcon from '@material-ui/icons/DateRange';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

import axios from "axios";
import { Component } from "react";
import { Redirect } from 'react-router-dom';
import setAuthToken from "../../../actions/setAuthToken";
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';

const requestUserProfile = async () => {
    const userProfile = await axios.get('/viewProfile');
    return userProfile.data;
}

const requestAttendanceRecods = async () => {
    const attendanceRecords = await axios.get('/viewAttendance');
    return attendanceRecords.data;
}

class Course_Instructor_List extends Component {
    state = {
        isLoggedIn: 0,
        componentInMain: <div />
    }

    handleInstructorCourses = async (event) => {
        console.log("clicked on instructor courses")

        this.props.setComponentInMain("instructorCourses")
    }
    
   handleViewStaffProfiles = () => {
    console.log("clicked on view staff profile")
        this.props.updateRequestStaffProfile();
    this.props.setComponentInMain("viewStaffProfiles");
  }
  handleManageCourseStaff = async () => {
    console.log("clicked on mange course staff")
   await  this.props.updateRequestCourseStaff();
    this.props.setComponentInMain("manageCourseStaff");
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
    }

    render() {
        if (this.state.isLoggedIn === 0)
            return <div />;
        if (this.state.isLoggedIn === 1) {
            return <Redirect to='/' />;
        }
        return (
            <div >
                <List>
                    <ListItem button>
                        <ListItemIcon><MenuBookIcon /></ListItemIcon>
                        <ListItemText primary="Instructor courses" onClick={this.handleInstructorCourses} />
                    </ListItem>
                    <ListItem button key="View Staff Profiles">
            <ListItemIcon> <SupervisorAccountIcon /></ListItemIcon>
            <ListItemText primary={"View Staff Profiles"} onClick={this.handleViewStaffProfiles} />
          </ListItem>
          <ListItem button key="Manage Course Staff">
            <ListItemIcon> <SupervisedUserCircleIcon /></ListItemIcon>
            <ListItemText primary={"Manage Course Staff"} onClick={this.handleManageCourseStaff} />
          </ListItem>
            
                </List>
            </div>
        )
    }
}

export default Course_Instructor_List;