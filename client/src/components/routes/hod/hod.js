import { Component } from "react";
import Navigation_Bar from '../../Navigation_Bar.js';
import { Redirect } from 'react-router-dom';
import axios from "axios";
import setAuthToken from "../../../actions/setAuthToken";
import Profile from '../../Profile';
import Attendance from '../../Attendance';

const requestUserProfile = async()=>{
    const userProfile = await axios.get('/viewProfile');
  return userProfile.data;
}

const requestAttendanceRecods = async()=>{    
    const attendanceRecords = await axios.get('/viewAttendance');
    console.log(attendanceRecords.data);
    return attendanceRecords.data;
}

class HOD extends Component {
    state = {
        isLoggedIn: 0,
        componentInMain: <div />
    }

    setComponentInMain = async (event)=>{
        if(event=="profile"){
            this.setState({componentInMain: <Profile profile = {await requestUserProfile()} setComponentInMain={this.setComponentInMain}/>});
        }else if(event=="attendance"){
            this.setState({componentInMain: <Attendance attendanceRecords = {await requestAttendanceRecods()} setComponentInMain={this.setComponentInMain}/>});   
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
            this.setState({ isLoggedIn: 2 });
        }
        catch (err) {
            this.setState({ isLoggedIn: 1 });
        }
    }

    render() {
        console.log(this.props.location);
        if (this.state.isLoggedIn === 0)
            return <div />;
        if (this.state.isLoggedIn === 1) {
            //alert("Please Login!");
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

export default HOD;