import axios from "axios";
import { Component } from "react";
import { Redirect } from 'react-router-dom';
import setAuthToken from "../../../actions/setAuthToken";
import Attendance from '../../Attendance';
import Navigation_Bar from '../../Navigation_Bar.js';
import Profile from '../../Profile';
import ManageCourseInstructors from './ManageCourseInstructors.js';
import ViewStaffProfiles from './viewStaffProfiles.js';
import ChangeDayOffRequest from './changeDayOffRequest.js'
import Schedule from '../ac/Schedule_Handler/Schedule'

import AnnualLeaveRequest from './annualLeaveRequest.js'
import AccidentalLeaveRequest from './accidentalLeaveRequest.js'
import SickLeaveRequest from './sickLeaveRequest.js'
import MaternityLeaveRequest from './maternityLeaveRequest.js'
import CompensationLeaveRequest from './compensationLeaveRequest.js'
   

import DepartmentCourses from'./departmentCourses.js';
const requestUserProfile = async () => {
    const userProfile = await axios.get('/viewProfile');
    return userProfile.data;
}


const requestAttendanceRecods = async () => {
    const attendanceRecords = await axios.get('/viewAttendance');
    return attendanceRecords.data;
}

const requestDepartmentCourses = async()=>{
    const departmentCourses = await axios.get('/hod/getDepartmentCourses');
    return departmentCourses.data;
}

const getAllAcademicMembers =  async ()=>{
    const res = await axios.get('/hod/getAllAcademicMembers');
    return res.data;
}


const getAcademicMembersTable =  async ()=>{
    const res = await axios.get('/hod/getAcademicMembersTable');
    return res.data;
}

const requestStaffProfiles = async(filter = "none",obj={} )=>{
    console.log("I am in request staff profiles")
    console.log("***",filter,obj)
if(filter=="none"){
    const res = await axios.get('/hod/viewDepartmentMembers');
    return res.data;
    
}else if(filter=="course"){
    const res = await axios.get(`/hod/viewDepartmentMembersByCourse/${obj.courseID}`);
    console.log("out from course filter",res.data);
    return res.data;
 
}else if(filter=="staffMember"){
    const res = await axios.get('/hod/viewDepartmentMembers');
    const out =res.data.filter((mem)=>{return mem.ID.split("-")[1]==obj.ID});
    console.log("out form staff member",out)
    return out;
  
}
}


const requestAllRequests = async ()=>{
    const res = await axios.get('/hod/viewAllRequests');
    return res.data;

} 


const requestAllDepartmentCourses = async ()=>{
    console.log("begin in request all department courses");
    const res = await axios.get('/hod/viewCourseTeachingAssignmentsLocal');
   
    console.log("end of  request all department courses" ,res.data);
    return res.data;

} 

// const getAllAcademicMembers = async()=>{
//     const res = await axios.get('/hod/getAllAcademicMembers');
//     return res.data;
// }

const requestSchedule = async () => {
    const schedule = await axios.get('ac/viewSchedule');
    console.log(schedule);
    return schedule.data;
}

class HOD extends Component {
    state = {
        isLoggedIn: 0,
        componentInMain: <div /> ,
        staffProfiles: [],
        hodProfile:{},
        requests: [],
        requestsFirstTime:true

    }
     updateRequestStaffProfile=async (filter = "none",obj={})=>{
         console.log("I am updating the staff profiles");
         console.log("The request state is ********", this.state.requests);
         
         const profiles=await requestStaffProfiles(filter,obj);
         console.log("I finished updating the staff profiles")
        this.setState({staffProfiles:profiles});
        return profiles;
    }

    updateRequests=async (type="",requestID=-1,newStatus="")=>{
        console.log("I am in updating requests requests requests")
        if(this.state.requestsFirstTime||requestID==-1){
        console.log("in update requests from database");
       const requests =await requestAllRequests();
       this.setState({requests:requests});
       
       console.log("after exec update requests ",requests);
       this.setState({requestsFirstTime:false})
       return requests;
        }else{
            console.log("in update requests on front end ",newStatus)
            const allRequests=this.state.requests;
            if(!allRequests.find((req)=>{return req.type == type}))return[];
            let typeRequests=allRequests.find((req)=>{return req.type == type}).requests;
            for(const request of typeRequests){
                if(request.ID==requestID){
                    request.status=newStatus;
                }
                
            }
            this.setState({requests:allRequests});
            return allRequests;
        }

   }

    updateHODProfile= async ()=>{
        console.log("I am in update hod profile")
        this.setState({hodProfile:await requestUserProfile()});
        console.log("I finished update hod profile")

    }
    setComponentInMain = async (event) => {
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
                />
            });
        }
        else if (event == "manageCourseInstructors"){
            console.log("I am in event course")

            this.setState({
                componentInMain: <ManageCourseInstructors
                    courses={await requestDepartmentCourses()}
                    setComponentInMain={this.setComponentInMain} 
                    academicMembers = {await getAllAcademicMembers()}
                    />
            });
        
        }
        else if(event == "viewStaffProfiles"){
            console.log("I am in event profiles")
            this.setState({
                componentInMain: <ViewStaffProfiles
                    allCourses={await requestDepartmentCourses()}
                    setComponentInMain={this.setComponentInMain} 
                    academicMembers = {await getAcademicMembersTable()}
                    staffProfiles={this.state.staffProfiles}
                    hodProfile={this.state.hodProfile}
                    updateProfiles={this.updateRequestStaffProfile}
                    />
            });
        } else if(event=="changeDayOffRequest"){
            
            console.log(this.state.requests);
            this.setState({
                componentInMain: <ChangeDayOffRequest
                    setComponentInMain={this.setComponentInMain} 
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req)=>{return req.type == "change day off requests"}).requests}
                    />
            });
     
        }else if (event=="annualLeaveRequest"){
            this.setState({
                componentInMain: <AnnualLeaveRequest
                    setComponentInMain={this.setComponentInMain} 
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req)=>{return req.type == "annual leave requests"}).requests}
                    />
            });
     
        }else if(event=="accidentalLeaveRequest"){
            this.setState({
                componentInMain: <AccidentalLeaveRequest
                    setComponentInMain={this.setComponentInMain} 
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req)=>{return req.type == "accidental leave requests"}).requests}
                    />
            });
     
            
        }else if(event=="sickLeaveRequest"){
            this.setState({
                componentInMain: <SickLeaveRequest
                    setComponentInMain={this.setComponentInMain} 
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req)=>{return req.type == "sick leave requests"}).requests}
                    />
            });
     
        }else if(event=="maternityLeaveRequest"){
            this.setState({
                componentInMain: <MaternityLeaveRequest
                    setComponentInMain={this.setComponentInMain} 
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req)=>{return req.type == "maternity leave requests"}).requests}
                    />
            });
            
        }else if(event=="compensationLeaveRequest"){
            this.setState({
                componentInMain: <CompensationLeaveRequest
                    setComponentInMain={this.setComponentInMain} 
                    updateRequests={this.updateRequests}
                    requests={this.state.requests.find((req)=>{return req.type == "compensation leave requests"}).requests}
                    />
            });
         
        }else if (event=="departmentCourses"){
            this.setState({
                componentInMain: <DepartmentCourses
                    setComponentInMain={this.setComponentInMain} 
                    departmentCourses={await requestAllDepartmentCourses()}
                    allCourses={await requestDepartmentCourses()}
                  
                    />
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
            this.setState({ isLoggedIn: 2 });
            
        }
        catch (err) {
            this.setState({ isLoggedIn: 1 });
        }

        await this.updateRequestStaffProfile();
        await this.updateHODProfile();

    }

    render() {
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
                />
                {this.state.componentInMain}
            </div>
        )
    }
}

export default HOD;