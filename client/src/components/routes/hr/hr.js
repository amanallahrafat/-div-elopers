import axios from "axios";
import { Component } from "react";
import { Redirect } from 'react-router-dom';
import setAuthToken from "../../../actions/setAuthToken";
import Attendance from '../../Attendance';
import Navigation_Bar from '../../Navigation_Bar.js';
import Profile from '../../Profile';
import Location_Card from './Location_Handler/Location_Card';
import Faculty_Card from './Faculty_Handler/Faculty_Card';
import Deparment_Card  from './Department_Handler/Department_Card';

const requestUserProfile = async () => {
    const userProfile = await axios.get('/viewProfile');
    return userProfile.data;
}

const requestAttendanceRecods = async () => {
    const attendanceRecords = await axios.get('/viewAttendance');
    return attendanceRecords.data;
}

const requestAllLocations = async () => {
    const locations = await axios.get('/hr/viewAllLocations');
    return locations.data;
}

const requestAllFacutlies = async () => {
    let faculties = (await axios.get('/hr/viewAllFaculties')).data;
    faculties = faculties.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    return faculties;
}

const requestAllDepartments = async () => {
    const departments = await axios.get('/hr/viewAllDepartments');
    return departments.data;
}

const requestAllAcademicMembers = async () =>{
    const members = await axios.get('/hr/viewAllStaffMembers');
    return members.data.filter(elm => elm.type == 0 );
}

class HR extends Component {
    state = {
        isLoggedIn: 0,
        'componentInMain': <div />
    }

    setComponentInMain = async (event) => {
        console.log(event)

        if (event == "profile") {
            this.setState({
                'componentInMain': <Profile
                    profile={await requestUserProfile()}
                    setComponentInMain={this.setComponentInMain} />
            });
        }
        else if (event == "location") {
            this.setState({
                'componentInMain': <Location_Card
                    locations={await requestAllLocations()}
                    setComponentInMain={this.setComponentInMain} />
            });
        }
        else if (event == "attendance") {
            this.setState({
                componentInMain: <Attendance
                    attendanceRecords={await requestAttendanceRecods()}
                    setComponentInMain={this.setComponentInMain} />
            });
        }
        else if (event == "faculty") {
            this.setState({
                componentInMain: <Faculty_Card
                faculties={await requestAllFacutlies()}
                departments = {await requestAllDepartments()}
                setComponentInMain={this.setComponentInMain} />
            });
        }
        else if( event == "department") {
            this.setState({
                componentInMain: <Deparment_Card
                departments={await requestAllDepartments()}
                setComponentInMain={this.setComponentInMain} />
            });
        }
    }

    async componentDidMount() {
        if (!localStorage.getItem('auth-token')) {
            this.setState({ isLoggedIn: 1 });
            return;
        }
        try {
            setAuthToken(localStorage.getItem('auth-token'));
            await axios.get('/authStaffMember');
            await axios.get('/authHr');

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
                <Navigation_Bar fromParent={this.setComponentInMain} />
                {this.state.componentInMain}
            </div>
        )
    }
}

export default HR;