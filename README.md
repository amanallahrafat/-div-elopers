# milestone-1-team-9
- 


## HR Functionalities

### <b>Functionality: </b> Add a new location <br>
<b>Route: </b> /hr/createLocation <br>
<b>Request Type: </b> POST <br>
<b>Request Body: </b> `
{"name" : "H12", "capacity" : 120, "type" : 0}
`
<br>
<b>Note: </b> Type denotes whether the location is a hall, tutorial room, lab or office. 0 -->hall, 1--> tut room, 2--> office, 3-->lab <br>


### <b>Functionality: </b> Update a location <br>
<b>Route: </b> /hr/updateLocation/:ID <br>
<b>Request Type: </b> PUT <br>
<b>Request Parameter: </b> The ID of the location to be updated<br>
<b>Request body : </b> `
{"name" : "H30","type" : 200}
`
<br>
<b>Example of how to call the route:</b> /hr/updateLocation/1
<br>
<b>Response</b>:
`
{"error": "\"type\" must be less than or equal to 3"}
`
<br>
<b>Request body : </b> `
{"name" : "H30","type" : 2}
`
<br>
<b>Response</b>:
`
Location Updated Successfully!
`
<br>
<b>Request body : </b> `
{"name" : ""}
`
<br>
<b>Response</b>:
`
{"error": "\"name\" is not allowed to be empty}
`
<br>



### <b>Functionality:</b> Delete a location <br>
<b>Route: </b> /hr/deleteLocation/:ID <br>
<b>Request type: </b> DELETE <br>
<b>Request parameters : </b> The ID of the location to be deleted <br/>
<b>Example of how to call the route:</b> /hr/deleteLocation/1
<br>

### <b>Functionality:</b> Add a staff member <br>
<b>Route: </b> /hr/addStaffMember<br>
<b>Request Type: </b> POST <br>
<b>Request Body : </b>
`
{"name": "user99", "email": "user99@guc.com", "type": 0, "dayOff": "sunday", "gender": "male", "officeID": 5, "salary": 8000,"departmentID": 1,"memberType":0}
`
<br>
<b>Resposne: </b>`Registeration Completed!` <br>

<b>Request Body : </b>
`
{"name": "user100", "email": "user100@guc.com", "type": 1, "dayOff": "saturday", "gender": "male", "officeID": 5, "salary": 8000,"departmentID": 1}
`
<br>
<b>Resposne: </b>`Registeration Completed!` <br>


<b>Notes: <br/> </b> 1- The officeID must be an ID of a location of type office (type = 2). </b><br>
2- type denotes whether this staff member is an HR or an academic member (0-> academic member, 1-> hr) <br>
3- memberType denotes whether this academic member is a HOD or an academic member (0 -> HOD, 3-> academic member)<br>
### <b>Functionality:</b> Update a staff member <br>
<b>Route: </b> /hr/updateStaffMember/:ID/:type<br>
<b>Request Type: </b> PUT <br>
<b>Request Body : </b>
`
{"memberType":0}
`
<br>
<b>Resposne: </b>`Staff member Updated Successfully!`


<b>Request Body : </b>
`
{"ID": 2}`
<br>
<b>Resposne: </b>`{
    "error": "\"ID\" is not allowed"
}`

<b>Request Body : </b>
`
{"departmentID": 4}
`
<br>
<b>Resposne: </b>`Staff member Updated Successfully!`

<b>Request Body : </b>
`
{"officeID": 9}`
<br>
<b>Resposne: </b>`Staff member Updated Successfully!` <br>
<b>Request Parameters : </b> ID is the ID of the staff member, type denotes whether it's an HR or academic member (0--> academic member, 1 --> HR) <br>
<b>Example of how to call the route :</b> /hr/updateStaffMember/1/0 <br>

### <b>Functionality:</b> Delete a staff member <br>
<b>Route: </b> /hr/deleteStaffMember/:ID/:type<br>
<b>Request Type: </b> DELETE <br>
<b>Request Body : </b>
`
`
<br>
<b>Resposne: </b>`Staff member deleted successfully`

<b>Request Body : </b>
`
`
<br>
<b>Resposne: </b>`This user doesn't exist`
<b>Request Parameters : </b> ID is the ID of the staff member, type denotes whether it's an HR or academic member (0--> academic member, 1 --> HR) <br>
<b>Example of how to call the route :</b> /hr/deleteStaffMember/1/0 <br>


### <b>Functionality: </b> Add a new faculty <br>
<b>Route: </b> /hr/createFaculty <br>
<b>Request Type: </b> POST <br>
<b>Request Body: </b> `
{"name" : "MET","departments" : [2,3]}
`
<br>
<b>Note: </b> Departments array contains the ids of departments.  

### <b>Functionality: </b> Update a faculty <br>
<b>Route: </b> /hr/updateFaculty/:name <br>
<b>Request Type: </b> PUT <br>
<b>Request Parameter: </b> The name of the faculty to be updated<br>
<b>Request body : </b> `
{"name" : "MET", "departments": [4]}
`
<br>
<b> Example of how to call the route:</b> /hr/updateFaculty/IET

### <b>Functionality:</b> Delete a faculty <br>
<b>Route: </b> /hr/deleteFaculty/:ID <br>
<b>Request type: </b> DELETE <br>
<b>Request parameters : </b> The name of the faculty to be deleted
<br>
<b>Example of how to call the route:</b> /hr/facultyLocation/MET
<br>

### <b>Functionality: </b> Add a new department <br>
<b>Route: </b> /hr/createDepartment <br>
<b>Request Type: </b> POST <br>
<b>Request Body: </b> `
{"name" : "CS","members" : [17], "hodID" : 17}
`
<br>
<b>Request Body: </b> `
{"name" : "DMET"}
`
<br>
<b>Note: </b> Members array contains the ids of members that should be added to the new department.  

### <b>Functionality:</b> Update a department <br>
<b>Route: </b> /hr/updateDepartment/:ID <br>
<b>Request type: </b> PUT <br>
<b>Request parameters : </b> The ID of the department to be updated <br>
<b>Request body: </b> `
{"hodID": 4}
`
<br>
<b>Example of how to call the route:</b> /hr/updateDepartment/2
<br>


### <b>Functionality:</b> Delete a department <br>
<b>Route: </b> /hr/deleteDepartment/:ID <br>
<b>Request type: </b> DELETE <br>
<b>Request parameters : </b> The ID of the department to be deleted
<br>
<b>Example of how to call the route:</b> /hr/deleteDepartment/1
<br>

### <b>Functionality: </b> Create a new course <br>
<b>Route: </b> /hr/createCourse <br>
<b> Request type : </b> POST <br>
<b> Request body : </b> `
{"name":"COMPUTER", "code": "CSEN111", "department": [4]}
`
<br>
<b>Response :</b> Course has been added successfully <br>

### <b>Functionality: </b> Update a course <br>
<b>Route: </b> /hr/updateCourse/:ID <br>
<b> Request type : </b> PUT <br>
<b> Request parameters : </b> ID of the course that the HR wants to update <br>
<b> Request body : </b> `
{"name":"COMPUTER PROGRAMMING"}
`
<br>
<b>Response :</b> Course has been updated successfully <br>
<b>Example of how to call the route : </b>/hr/updateCourse/2 <br>

### <b>Functionality: </b> Delete a course <br>
<b>Route: </b> /hr/deleteCourse/:ID <br>
<b> Request type : </b> DELETE <br>
<b> Request parameters : </b> ID of the course that the HR wants to delete <br>
<b>Response :</b> Course has been deleted successfully <br>
<b>Example of how to call the route : </b>/hr/deleteCourse/2 <br>


### <b>Functionality: </b> add missing sign in/ sign out session <br>
<b> add 'auth-token' of HR in the header</b><br/>

<b>Route: </b> /hr/addMissingSignInOut <br>
<b> Request type : </b> POST <br>
<b> Request body : </b> 
`
{"ID":1,"type":0,
   "signinYear":2020,
    "signinMonth":12,
     "signinDay":1,
     "signinHour":1,
     "signinMinute":0,
    "signinSec":0,
     "signoutYear":2021,
     "signoutMonth":12,
    "signoutDay":2,
     "signoutHour":1,
     "signoutMinute":0,
     "signoutSec":0}
`
<br>
<b>Response :</b>  adding login/out has done successfully <br>


### <b>Functionality: </b> view a Staff member attendance <br>
<b> add 'auth-token' of HR in the header</b><br/>

<b>Route: </b> /hr/viewStaffMemberAttendance/:ID/:type <br>
<b> for example</b> /hr/viewStaffMemberAttendance/1/1<br>
<b> Request type : </b> GET <br>
<b> Request Parameters : </b> ID is the ID of the staff member whose attendance is to be viewed. type is 0 if he is academic member and type is 1 if he is an HR <br>
<b>Response :</b>  
`[
    {
        "status": "attedant",
        "signin": "2020-12-17T12:49:25.810Z",
        "signout": "2020-12-17T12:49:32.526Z"
    }
]
`
<br>

### <b>Functionality: </b> update staff Member salary <br>
<b> add 'auth-token' of HR in the header</b><br/>

<b>Route: </b> /hr/updateStaffMemberSalary <br>
<b> Request type : </b> POST <br>
<b> Request body : </b> 
`
{"ID":1,"type":1,"salary":4000}
`
<br>
<b>Response :</b>  staff member salary has been updated successfully <br>
<b>Note: </b> 1-ID is the ID of the staff member that the HR wants to update the salary for.<br>
2- type denotes whether this staff member is an HR (type : 1) or academic member (type :0). <br>


### <b>Functionality: </b> view Staff members with missing hours <br>
<b> add 'auth-token' of HR in the header</b><br/>

<b>Route: </b> /hr/viewStaffMembersWithMissingHours <br>
<b> Request type : </b> GET <br>
<b>Response :</b>  
`
[
    {
        "attendanceRecord": [
            {
                "status": 1,
                "signin": 1608209365810,
                "signout": 1608209372526
            }
        ],
        "extraInfo": [],
        "name": "sarah",
        "ID": 1,
        "email": "sarah@guc.com",
        "type": 1,
        "dayOff": "saturday",
        "gender": "female",
        "salary": 4000,
        "annualBalance": 2.5,
        "accidentalLeaveBalance": 6
    },
    {
        "attendanceRecord": [],
        "extraInfo": [],
        "name": "aca1",
        "ID": 1,
        "email": "aca1@guc.com",
        "type": 0,
        "dayOff": "sunday",
        "gender": "male",
        "salary": 8000,
        "annualBalance": 2.5,
        "accidentalLeaveBalance": 6,
        "officeID": 5
    },
    {
        "attendanceRecord": [],
        "extraInfo": [],
        "name": "aaaaaa",
        "ID": 2,
        "email": "aca2@guc.com",
        "type": 0,
        "dayOff": "sunday",
        "gender": "male",
        "salary": 8000,
        "annualBalance": 2.5,
        "accidentalLeaveBalance": 6,
        "officeID": null
    },
    {
        "attendanceRecord": [],
        "extraInfo": [],
        "name": "User3",
        "ID": 3,
        "email": "aca3@guc.com",
        "type": 0,
        "dayOff": "saturday",
        "gender": "male",
        "salary": 8000,
        "annualBalance": 2.5,
        "accidentalLeaveBalance": 6
    }]  
`
<br> <b> note that the output depends on the data inside the database and the current day when the code runs </b>
<br>

### <b>Functionality: </b> view Staff members with missing days <br>
<b> add 'auth-token' of HR in the header</b><br/>

<b>Route: </b> /hr/viewStaffMembersWithMissingDays <br>
<b> Request type : </b> GET <br>
<b>Response :</b>  
`
[
    {
        "attendanceRecord": [
            {
                "status": 1,
                "signin": "2020-12-17T12:49:25.810Z",
                "signout": "2020-12-17T12:49:32.526Z"
            }
        ],
        "extraInfo": [],
        "name": "sarah",
        "ID": 1,
        "email": "ssarah@guc.edu.eg",
        "type": 1,
        "dayOff": "saturday",
        "gender": "female",
        "salary": 6000,
        "annualBalance": 2.5,
        "accidentalLeaveBalance": 6,
        "officeID": null
    },
    {
        "attendanceRecord": [],
        "extraInfo": [],
        "name": "aaaaaa",
        "ID": 2,
        "email": "aca2@guc.com",
        "type": 0,
        "dayOff": "sunday",
        "gender": "male",
        "salary": 8000,
        "annualBalance": 2.5,
        "accidentalLeaveBalance": 6,
        "officeID": null
    },
    {
        "attendanceRecord": [],
        "extraInfo": [],
        "name": "User3",
        "ID": 3,
        "email": "aca3@guc.com",
        "type": 0,
        "dayOff": "saturday",
        "gender": "male",
        "salary": 8000,
        "annualBalance": 2.5,
        "accidentalLeaveBalance": 6
    },
    {
        "attendanceRecord": [],
        "extraInfo": [],
        "name": "aca4",
        "ID": 4,
        "email": "aca4@guc.com",
        "type": 0,
        "dayOff": "saturday",
        "gender": "female",
        "salary": 8000,
        "annualBalance": 2.5,
        "accidentalLeaveBalance": 6
    },
    {
        "attendanceRecord": [],
        "extraInfo": [],
        "name": "aca5",
        "ID": 5,
        "email": "aca5@guc.com",
        "type": 0,
        "dayOff": "sunday",
        "gender": "female",
        "salary": 8000,
        "annualBalance": 2.5,
        "accidentalLeaveBalance": 6
    },
    {
        "attendanceRecord": [],
        "extraInfo": [],
        "name": "aca6",
        "ID": 6,
        "email": "aca6@guc.com",
        "type": 0,
        "dayOff": "sunday",
        "gender": "male",
        "salary": 8000,
        "annualBalance": 2.5,
        "accidentalLeaveBalance": 6
    },
    {
        "attendanceRecord": [],
        "extraInfo": [],
        "name": "aca7",
        "ID": 7,
        "email": "aca7@guc.com",
        "type": 0,
        "dayOff": "sunday",
        "gender": "male",
        "salary": 8000,
        "annualBalance": 2.5,
        "accidentalLeaveBalance": 6
    },
    {
        "attendanceRecord": [],
        "extraInfo": [],
        "name": "user99",
        "ID": 8,
        "email": "user99@guc.com",
        "type": 0,
        "dayOff": "sunday",
        "gender": "male",
        "officeID": 5,
        "salary": 8000,
        "annualBalance": 2.5,
        "accidentalLeaveBalance": 6
    },
    {
        "attendanceRecord": [],
        "extraInfo": [],
        "name": "user100",
        "ID": 2,
        "email": "user100@guc.com",
        "type": 1,
        "dayOff": "saturday",
        "gender": "male",
        "officeID": 5,
        "salary": 8000,
        "annualBalance": 2.5,
        "accidentalLeaveBalance": 6
    }
]
`
<br> <b> note that the output depends on the data inside the database and the current day when the code runs <br>
since it starts from the beginning of the academic month till the current day</b>
<br>







## Staff Member Functionality

### <b>Functionality: </b> Login with a unique email and password. <br>
<b>Route: </b>/login<br>
<b>Request type: </b>POST<br> 
<b>Request Body : </b> `
{"email": "ahmed@guc.edu.eg","password":"team9111"}
`
<br>

### <b>Functionality: </b> Logout an already loged in user<br>
<b>Route: </b>/logout<br>
<b>Request type: </b>POST<br> 
<br>

### <b>Functionality: </b> sign in <br>
<b> add the 'auth-token' of a staff member</b><br/>

<b>Route: </b>/signIn<br>
<b>Request type: </b>POST<br> 
<br>
### <b>Functionality: </b> sign out <br>
<b> add the 'auth-token' of a staff member</b><br/>

<b>Route: </b>/signOut<br>
<b>Request type: </b>POST<br> 
<br>

### <b>Functionality: </b> View Profile <br>	
<b>Route: </b> /viewProfile <br>	
<b>Request Type: </b> GET <br>	
<b>Response: </b> ` {"extraInfo": [],"name": "mohamed","ID": 14,"email": "mk@guc.com","type": 0,"dayOff": "sunday",	
"gender": "male","officeID": 9,"salary": 5001,"annualBalance": 2.5,"accidentalLeaveBalance": 6}`	
<br>	

### <b>Functionality: </b> Reset Password <br>	
<b>Route: </b>/resetPassword<br>	
<b>Request type: </b>POST<br> 	
<b>Request Body : </b> `	
{"oldPassword":"123456","newPassword":"123457"}	
`	
<br>

### <b>Functionality: </b> View Attendance <br>	
<b>Route: </b> /viewAttendance <br>	
<b>Request Type: </b> GET <br>	
<b>Request Body: </b> The Route has two options for the request body to view The whole Attendance Record or by month and the input requested body for the second should be like the following `{"month":12}`	
<br>	

### <b>Functionality: </b> update staff Member profile <br>
<b> add 'auth-token' of the staff member in the header</b><br/>

<b>Route: </b> /updateMyProfile <br>
<b> Request type : </b> POST <br>
<b> Request body : </b> 
`
{"email":"ssarah@guc.edu.eg"}
`
<br>
<b>Response :</b> profile Updated Successfully! <br>

### <b>Functionality: </b> View Missing Days <br>	
<b> add 'auth-token' of the staff member in the header</b><br/>

<b>Route: </b> /viewMissingDays <br>	
<b>Request Type: </b> GET <br>	
<b>Response: </b> ` 
[
    "2020-12-13T00:00:00.000Z",
    "2020-12-14T00:00:00.000Z",
    "2020-12-15T00:00:00.000Z",
    "2020-12-16T00:00:00.000Z"
]`
<br>	
<br> <b> note that the output depends on the data inside the database and the current day when the code runs <br>
since it starts from the beginning of the academic month till the current day</b>
<br>


## HOD functionality 
 
 ### <b>Functionality: </b> Assign course instructor <br>	
<b>Route: </b> /hod/assignCourseInstructor <br>	
<b>Request Type: </b> PUT <br>	
<b>Request Body: </b> `
{"courseID":3, "instructorID": 1}
`
<br>
<b>Response: </b>Course instructor assigned successfully
<br>	

 ### <b>Functionality: </b> Delete course instructor <br>	
<b>Route: </b> /hod/deleteCourseInstructor/:courseID <br>	
<b>Request Type: </b> DELETE <br>
<b>Request Parameters: </b> The ID of the course <br>
<b>Request Body: </b> `
{"instructorID":1}
`
<br>
<b>Example of how to call the route: </b> /hod/deleteCourseInstructor/1 <br>
<b>Response: </b>Course instructor was deleted successfully <br>
<b>Note: </b> instructorID is the ID of the instructor that the hod wants to delete from the course
<br>

 ### <b>Functionality: </b> Update course instructor <br>	
<b>Route: </b> /hod/updateCourseInstructor/:ID <br>	
<b>Request Type: </b> PUT <br>
<b>Request Parameters: </b> The ID of the instructor that the HOD wants to update <br>
<b>Request Body: </b> `
{"oldCourseID": 1, "newCourseID": 2}
`
<br>
<b>Response: </b>Update was successfull
<br>
<b>Example of how to call the route: </b>/hod/updateCourseInstructor/2 <br>
<b>Note: </b> newCourseID is the ID of the course that you want to assign the instructor to, oldCourseID is the ID of the course you want to remove the instructor from. <br>


 ### <b>Functionality: </b> View Staff member in department <br>	
<b>Route: </b> /hod/viewDepartmentMembers <br>	
<b>Request Type: </b> GET <br>	
<b>Response : </b>Array of staff members
`
[
    {
        "name": "aca6",
        "email": "aca6@guc.com",
        "ID": 6,
        "type": 0,
        "dayOff": "sunday",
        "gender": "male",
        "officeID": "Not yet assigned",
        "departmentID": "MNGT",
        "extra info": []
    },
    {
        "name": "aca7",
        "email": "aca7@guc.com",
        "ID": 7,
        "type": 0,
        "dayOff": "sunday",
        "gender": "male",
        "officeID": "Not yet assigned",
        "departmentID": "MNGT",
        "extra info": []
    }
]
`
<br>

 ### <b>Functionality: </b> View staff members by course <br>	
<b>Route: </b> /hod/viewDepartmentMembersByCourse/:courseID <br>	
<b>Request Type: </b> GET <br>	
<b>Request Parameters: </b>ID of the course whose teaching staff the head of the department wants to view  
<br>
<b>Response: </b>Array of staff members
`
[
    {
        "name": "sarah",
        "email": "sarah@guc.com",
        "ID": 1,
        "type": 1,
        "dayOff": "saturday",
        "gender": "female",
        "officeID": "Not yet assigned",
        "departmentID": "MET",
        "extra info": []
    },
    {
        "name": "aca2",
        "email": "aca2@guc.com",
        "ID": 2,
        "type": 0,
        "dayOff": "sunday",
        "gender": "male",
        "officeID": "Not yet assigned",
        "departmentID": "MET",
        "extra info": []
    }
]
`
<br>
<b>Example of how to call the route: </b> /hod/viewDepartmentMembersByCourse/1
	
 ### <b>Functionality: </b> View all staff day off <br>	
<b>Route: </b> /hod/viewAllStaffDayOff <br>	
<b>Request Type: </b> GET <br>	
<br>
<b>Response: </b>Array containing staff member name, ID and day off
`
[
    {
        "name": "aca6",
        "id": "ac_6",
        "dayOff": "sunday"
    },
    {
        "name": "aca7",
        "id": "ac_7",
        "dayOff": "sunday"
    }
]
`
<br>	

 ### <b>Functionality: </b> View day off of single staff member in department <br>	
<b>Route: </b> /hod/viewSingleStaffDayOff/:ID <br>	
<b>Request Type: </b> GET <br>	
<b>Request Parameters: </b> ID of the staff member the head of the department wants to view
<br>
<b>Response: </b>staff member name, ID and day off
`
{
    "name": "aca6",
    "id": "ac_6",
    "day off": "sunday"
}
`
<br>	
<b>Example of how to call the route: </b> /hod/viewSingleStaffDayOff/1  <br>
    
 ### <b>Functionality: </b> View course teaching assignments <br>	
<b>Route: </b> /hod/viewCourseTeachingAssignments/:ID <br>	
<b>Request Type: </b> GET <br>	
<b>Request Parameters: </b> ID of the course that the head of the department wants to view
<br>
<b>Response: </b> name of the course, code of the course and an array containing the slots of the course
`
{
    "course name": "Graphics",
    "course code": "DMET501",
    "course slots": [
        {
            "slot": {
                "ID": 1,
                "slotNumber": 1,
                "day": "monday",
                "locationID": 1
            },
            "staff member name": "Not yet assigned"
        },
        {
            "slot": {
                "ID": 2,
                "slotNumber": 2,
                "day": "monday",
                "locationID": 1
            },
            "staff member name": "Not yet assigned"
        },
        {
            "slot": {
                "ID": 3,
                "slotNumber": 3,
                "day": "monday",
                "locationID": 1
            },
            "staff member name": "Not yet assigned"
        }
    ]
}
`
<br>	
<b>Example of how to call the route: </b> /hod/viewCourseTeachingAssignments/1  <br>

 ### <b>Functionality: </b> View course coverage <br>	
<b>Route: </b> /hod/viewCourseCoverage/:ID <br>	
<b>Request Type: </b> GET <br>	
<b>Request parameters: </b> The ID of the course. <br>
<b>Response: </b> The coverage of the course which has the ID specified in the request parameters(in decimal)
<br>
<b>Example of how to call the route: </b> /hod/viewCourseCoverage/1  <br>

### <b>Functionality: </b> View all requests <br>	
<b>Route: </b> /hod/viewAllRequests <br>	
<b>Request Type: </b> GET <br>	
<b>Response: </b> Array of all the requests that are sent to this head of department.<br>
`
[
    {
        "type": "accidental leave requests",
        "requests": [
            {
                "_id": "5fdefc5983dc451970a8cdf3",
                "ID": 6,
                "senderID": 8,
                "receiverID": 8,
                "msg": "ali",
                "submissionDate": "2020-12-20T07:25:13.024Z",
                "requestedDate": "1970-01-01T00:00:00.123Z",
                "status": "pending",
                "__v": 0
            }
        ]
    },
    {
        "type": "annual leave requests",
        "requests": []
    },
    {
        "type": "change day off requests",
        "requests": [
            {
                "_id": "5fde58e1c78ef437c4425b93",
                "ID": 3,
                "senderID": 1,
                "receiverID": 8,
                "msg": "",
                "targetDayOff": "monday",
                "submissionDate": "2020-12-19T19:47:45.077Z",
                "status": "pending",
                "__v": 0
            },
            {
                "_id": "5fde58e4c78ef437c4425b94",
                "ID": 4,
                "senderID": 1,
                "receiverID": 8,
                "msg": "",
                "targetDayOff": "monday",
                "submissionDate": "2020-12-19T19:47:48.452Z",
                "status": "pending",
                "__v": 0
            }
        ]
    },
    {
        "type": "compensation leave requests",
        "requests": [
            {
                "_id": "5fde6190ecabe139c4220514",
                "ID": 1,
                "senderID": 1,
                "receiverID": 8,
                "submissionDate": "2020-12-19T20:24:48.822Z",
                "requestedDate": "2020-12-13T20:14:22.436Z",
                "absenceDate": "2020-12-12T20:14:51.516Z",
                "status": "pending",
                "__v": 0
            },
            {
                "_id": "5fde61b6ecabe139c4220515",
                "ID": 2,
                "senderID": 1,
                "receiverID": 8,
                "submissionDate": "2020-12-19T20:25:26.410Z",
                "requestedDate": "2020-12-06T20:25:18.099Z",
                "absenceDate": "2020-12-12T20:14:51.516Z",
                "status": "pending",
                "__v": 0
            },
            {
                "_id": "5fde61caecabe139c4220516",
                "ID": 3,
                "senderID": 1,
                "receiverID": 8,
                "submissionDate": "2020-12-19T20:25:46.172Z",
                "requestedDate": "2020-12-06T20:25:18.099Z",
                "absenceDate": "2020-12-06T20:25:18.099Z",
                "status": "pending",
                "__v": 0
            },
            {
                "_id": "5fde61dfecabe139c4220517",
                "ID": 4,
                "senderID": 1,
                "receiverID": 8,
                "submissionDate": "2020-12-19T20:26:07.983Z",
                "requestedDate": "2020-12-06T20:25:18.099Z",
                "absenceDate": "2020-12-12T20:14:51.516Z",
                "status": "pending",
                "__v": 0
            },
            {
                "_id": "5fde6229ecabe139c4220518",
                "ID": 5,
                "senderID": 1,
                "receiverID": 8,
                "submissionDate": "2020-12-19T20:27:21.913Z",
                "requestedDate": "2020-12-13T20:14:22.436Z",
                "absenceDate": "2020-12-12T20:14:51.516Z",
                "status": "pending",
                "__v": 0
            },
            {
                "_id": "5fde6276ecabe139c4220519",
                "ID": 6,
                "senderID": 1,
                "receiverID": 8,
                "submissionDate": "2020-12-19T20:28:38.203Z",
                "requestedDate": "2020-12-13T20:14:22.436Z",
                "absenceDate": "2020-12-23T20:28:29.192Z",
                "status": "pending",
                "__v": 0
            },
            {
                "_id": "5fde6b3cecabe139c422051c",
                "ID": 7,
                "senderID": 1,
                "receiverID": 8,
                "submissionDate": "2020-12-19T21:06:04.348Z",
                "requestedDate": "2020-12-06T20:25:18.099Z",
                "absenceDate": "2020-12-12T20:14:51.516Z",
                "status": "pending",
                "__v": 0
            }
        ]
    },
    {
        "type": "maternity leave requests",
        "requests": [
            {
                "_id": "5fde5876c78ef437c4425b8a",
                "ID": 1,
                "senderID": 1,
                "receiverID": 8,
                "documents": "googl/ali",
                "submissionDate": "2020-12-19T19:45:58.760Z",
                "startDate": "2020-12-24T13:51:02.056Z",
                "endDate": "2020-12-29T13:56:19.792Z",
                "msg": "",
                "status": "pending",
                "__v": 0
            },
            {
                "_id": "5fde5879c78ef437c4425b8b",
                "ID": 2,
                "senderID": 1,
                "receiverID": 8,
                "documents": "googl/ali",
                "submissionDate": "2020-12-19T19:46:01.066Z",
                "startDate": "2020-12-24T13:51:02.056Z",
                "endDate": "2020-12-29T13:56:19.792Z",
                "msg": "",
                "status": "pending",
                "__v": 0
            },
            {
                "_id": "5fde587cc78ef437c4425b8c",
                "ID": 3,
                "senderID": 1,
                "receiverID": 8,
                "documents": "googl/ali",
                "submissionDate": "2020-12-19T19:46:04.334Z",
                "startDate": "2020-12-24T13:51:02.056Z",
                "endDate": "2020-12-29T13:56:19.792Z",
                "msg": "",
                "status": "pending",
                "__v": 0
            },
            {
                "_id": "5fde587fc78ef437c4425b8d",
                "ID": 4,
                "senderID": 1,
                "receiverID": 8,
                "documents": "googl/ali",
                "submissionDate": "2020-12-19T19:46:07.478Z",
                "startDate": "2020-12-24T13:51:02.056Z",
                "endDate": "2020-12-29T13:56:19.792Z",
                "msg": "",
                "status": "pending",
                "__v": 0
            },
            {
                "_id": "5fde58a7c78ef437c4425b8e",
                "ID": 5,
                "senderID": 1,
                "receiverID": 8,
                "documents": "googl/ali",
                "submissionDate": "2020-12-19T19:46:47.988Z",
                "startDate": "2020-12-24T13:51:02.056Z",
                "endDate": "2020-12-29T13:56:19.792Z",
                "msg": "",
                "status": "pending",
                "__v": 0
            }
        ]
    },
    {
        "type": "sick leave requests",
        "requests": [
            {
                "_id": "5fde42634cc4174148983990",
                "ID": 1,
                "senderID": 4,
                "receiverID": 8,
                "documents": "jbdskjvbjas",
                "submissionDate": "2020-12-19T18:11:47.106Z",
                "requestedDate": "2020-12-18T18:11:23.669Z",
                "status": "pending",
                "msg": "We won!",
                "__v": 0
            },
            {
                "_id": "5fde42b34cc4174148983991",
                "ID": 2,
                "senderID": 4,
                "receiverID": 8,
                "documents": "jbdskjvbjas",
                "submissionDate": "2020-12-19T18:13:07.038Z",
                "requestedDate": "2020-12-18T18:11:23.669Z",
                "status": "pending",
                "msg": "We won!",
                "__v": 0
            },
            {
                "_id": "5fde42b54cc4174148983992",
                "ID": 3,
                "senderID": 4,
                "receiverID": 8,
                "documents": "jbdskjvbjas",
                "submissionDate": "2020-12-19T18:13:09.625Z",
                "requestedDate": "2020-12-18T18:11:23.669Z",
                "status": "pending",
                "msg": "We won!",
                "__v": 0
            },
            {
                "_id": "5fde42bd4cc4174148983993",
                "ID": 4,
                "senderID": 4,
                "receiverID": 8,
                "documents": "jbdskjvbjas",
                "submissionDate": "2020-12-19T18:13:17.976Z",
                "requestedDate": "2020-12-18T18:11:23.669Z",
                "status": "pending",
                "msg": "",
                "__v": 0
            },
            {
                "_id": "5fde4a1c4cc4174148983994",
                "ID": 5,
                "senderID": 4,
                "receiverID": 8,
                "documents": "jbdskjvbjas",
                "submissionDate": "2020-12-19T18:44:44.638Z",
                "requestedDate": "2020-12-18T18:11:23.669Z",
                "status": "pending",
                "msg": "",
                "__v": 0
            },
            {
                "_id": "5fde4a204cc4174148983995",
                "ID": 6,
                "senderID": 1,
                "receiverID": 8,
                "documents": "jbdskjvbjas",
                "submissionDate": "2020-12-12T18:44:48.828Z",
                "requestedDate": "2020-12-12T18:11:23.669Z",
                "status": "accepted",
                "msg": "",
                "__v": 0
            }
        ]
    }
]
`

### <b>Functionality: </b> Respond to change day off request <br>	
<b>Route: </b> /hod/respondToChangeDayOffRequest/:ID <br>	
<b>Request Type: </b> PUT <br>
<b>Request body : </b>` 
{"response": 1}
`
<br>
<b>Response: </b> Request accepted succefully <br>
<b>Request body : </b>` 
{"response":0, "msg":"You can't change it"}
`
<br>
<b>Response: </b> Request rejected succefully <br>
<b>Request Parameters : </b> The ID of the change day off request that the HOD wants to respond to. <br>
<b>Example of how to call the route: </b> /hod/respondToChangeDayOffRequest/3 <br>
<b>Note: </b>1- To accept the request response is 1, to reject the request response is 0. <br>
2- "msg" is optional if the HOD wants to state the reason for rejecting the request.<br>

### <b>Functionality: </b> Respond to annual leave request <br>	
<b>Route: </b> /hod/respondToAnnualLeaveRequests/:ID <br>	
<b>Request Type: </b> PUT <br>
<b>Request body : </b>` 
{"response": 1}
`
<br>
<b>Response: </b> Request was accepted successfully <br>
<b>Request body : </b>` 
{"response": 0,"msg": "I don't want to"}
`
<br>
<b>Response: </b> Request was rejected successfully <br>
<b>Request Parameters : </b> The ID of the annual leave request that the HOD wants to respond to. <br>
<b>Example of how to call the route: </b> /hod/respondToAnnualLeaveRequests/1 <br>
<b>Note: </b>1- To accept the request response is 1, to reject the request response is 0. <br>
2- "msg" is optional if the HOD wants to state the reason for rejecting the request.<br>


### <b>Functionality: </b> Respond to accidental leave request <br>	
<b>Route: </b> /hod/respondToAccidentalLeaveRequest/:ID <br>	
<b>Request Type: </b> PUT <br>
<b>Request body : </b>` 
{"response": 1}
`
<br>
<b>Response: </b> Request was accepted successfully <br>
<b>Request body : </b>` 
{"response": 0,"msg": "I don't want to"}
`
<br>
<b>Response: </b> Request was rejected successfully <br>
<b>Request Parameters : </b> The ID of the accidental leave request that the HOD wants to respond to. <br>
<b>Example of how to call the route: </b> /hod/respondToAccidentalLeaveRequest/3 <br>
<b>Note: </b>1- To accept the request response is 1, to reject the request response is 0. <br>
2- "msg" is optional if the HOD wants to state the reason for rejecting the request.<br>


### <b>Functionality: </b> Respond to sick leave request <br>	
<b>Route: </b> /hod/respondToSickLeaveRequests/:ID <br>	
<b>Request Type: </b> PUT <br>
<b>Request body : </b>` 
{"response": 1}
`
<br>
<b>Response: </b> Request was accepted successfully <br>
<b>Request body : </b>` 
{"response": 0,"msg": "I don't want to"}
`
<br>
<b>Response: </b> Request was rejected successfully <br>
<b>Request Parameters : </b> The ID of the sick leave request that the HOD wants to respond to. <br>
<b>Example of how to call the route: </b> /hod/respondToSickLeaveRequests/9 <br>
<b>Note: </b>- To accept the request response is 1, to reject the request response is 0. <br>
2- "msg" is optional if the HOD wants to state the reason for rejecting the request.<br>

### <b>Functionality: </b> Respond to maternity leave request <br>	
<b>Route: </b> /hod/respondToMaternityLeaveRequest/:ID <br>	
<b>Request Type: </b> PUT <br>
<b>Request body : </b>` 
{"response": 1}
`
<br>
<b>Response: </b> Request was accepted successfully <br>
<b>Request body : </b>` 
{"response": 0,"msg": "I don't want to"}
`
<br>
<b>Response: </b> Request was rejected successfully <br>
<b>Request Parameters : </b> The ID of the maternity leave request that the HOD wants to respond to. <br>
<b>Example of how to call the route: </b> /hod/respondToMaternityLeaveRequest/1 <br>
<b>Note: </b>1-To accept the request response is 1, to reject the request response is 0. <br>
2- "msg" is optional if the HOD wants to state the reason for rejecting the request.<br>


### <b>Functionality: </b> Respond to compensation leave request <br>	
<b>Route: </b> /hod/respondToCompensationLeaveRequest/:ID <br>	
<b>Request Type: </b> PUT <br>
<b>Request body : </b>` 
{"response": 1}
`
<br>
<b>Response: </b> Request was accepted successfully <br>
<b>Request body : </b>` 
{"response": 0,"msg": "I don't want to"}
`
<br>
<b>Response: </b> Request was rejected successfully <br>
<b>Request Parameters : </b> The ID of the compensation leave request that the HOD wants to respond to. <br>
<b>Example of how to call the route: </b> /hod/respondToCompensationLeaveRequest/1 <br>
<b>Note: </b>1-To accept the request response is 1, to reject the request response is 0. <br>
2- "msg" is optional if the HOD wants to state the reason for rejecting the request.<br>




## Course Instructor Functionality
 ### <b>Functionality: </b> View course coverage <br>
<b>Route Example: </b> /ci/viewCourseCoverage/:courseID <br>	
<b>Request Type: </b> GET <br>	
<b>Request parameters: </b> The ID of the course. <br>
<b>Route Example: </b> /ci/viewCourseCoverage/2 <br>	
<b>Response: </b> The coverage of the course which has the ID specified in the request parameters(in decimal)
<br>

 ### <b>Functionality: </b> View slot Assignemnts<br>	
<b>Route: </b> /ci/viewSlotAssignment <br>	
<b>Request Type: </b> GET <br>	
<b>Response: </b> Array of the course slots that the course instructor is assigned to.
<b>Response Example: </b>[{"slots":[{"ID":1,"slotNumber":3,"day":"monday","locationID":1},{"ID":2,"slotNumber":2,"day":"monday","locationID":1},{"ID":3,"slotNumber":5,"day":"monday","locationID":1},{"ID":4,"slotNumber":5,"day":"monday","locationID":1},{"ID":5,"slotNumber":2,"day":"monday","locationID":1},{"ID":6,"slotNumber":2,"day":"tuesday","locationID":1},{"ID":7,"slotNumber":2,"day":"tuesday","locationID":34},{"ID":8,"slotNumber":2,"day":"tuesday","locationID":6},{"ID":9,"slotNumber":2,"day":"friday","locationID":6}],"id":"5fdf6dda7f75c63a8cf2928e","ID":1,"_v":0}]
<br>

### <b>Functionality: </b> Get profiles of staff members in his/her department<br>	
<b>Route: </b> /ci/viewStaffProfilesInDepartment <br>	
<b>Request Type: </b> GET <br>	
<b>Response: </b> 
`
[{"name":"ac13","email":"ac13@guc.com","ID":"ac-11","type":0,"dayOff":"sunday","gender":"male","officeID":2,"departmentID":2,"extra
info":[]},{"name":"ac14","email":"ac14@guc.com","ID":"ac-12","type":3,"dayOff":"sunday","gender":"male","officeID":2,"departmentID":2,"extra
info":[]},{"name":"ac15","email":"ac15@guc.com","ID":"ac-13","type":3,"dayOff":"sunday","gender":"male","officeID":3,"departmentID":2,"extra
info":[]},{"name":"ac16","email":"ac16@guc.com","ID":"ac-14","type":3,"dayOff":"sunday","gender":"male","officeID":3,"departmentID":2,"extra
info":[]},{"name":"ac17","email":"ac17@guc.com","ID":"ac-15","type":3,"dayOff":"sunday","gender":"male","officeID":3,"departmentID":2,"extra
info":[]},{"name":"ac18","email":"ac18@guc.com","ID":"ac-16","type":3,"dayOff":"sunday","gender":"male","officeID":3,"departmentID":2,"extra
info":[]},{"name":"ac19","email":"ac19@guc.com","ID":"ac-17","type":3,"dayOff":"sunday","gender":"male","officeID":3,"departmentID":2,"extra
info":[]},{"name":"ac20","email":"ac20@guc.com","ID":"ac-18","type":1,"dayOff":"sunday","gender":"male","officeID":3,"departmentID":2,"extra
info":[]},{"name":"ac21","email":"ac21@guc.com","ID":"ac-19","type":1,"dayOff":"sunday","gender":"male","officeID":3,"departmentID":2,"extra
info":[]},{"name":"ac22","email":"ac22@guc.com","ID":"ac-20","type":1,"dayOff":"sunday","gender":"male","officeID":3,"departmentID":2,"extra
info":[]},{"name":"ac23","email":"ac23@guc.com","ID":"ac-21","type":3,"dayOff":"sunday","gender":"male","officeID":3,"departmentID":2,"extra
info":[]},{"name":"ac24","email":"ac24@guc.com","ID":"ac-22","type":3,"dayOff":"sunday","gender":"male","officeID":3,"departmentID":2,"extra
info":[]},{"name":"ac25","email":"ac25@guc.com","ID":"ac-23","type":2,"dayOff":"sunday","gender":"male","officeID":3,"departmentID":2,"extra
info":[]}]
`
<br>
### <b>Functionality: </b> Get profiles of staff members in a course under his/her department<br>	
<b>Route: </b> /ci/viewStaffProfilesInCourse/:courseID <br>
<b>Requet Parameters:</b> courseID represents an ID of existing course </br>
<b>Request Type: </b> GET <br>	
<b>Route Example: </b> /ci/viewStaffProfilesInCourse/1 <br>	
<b>Response Example: </b> 
`
[{"name":"ac25","email":"ac25@guc.com","ID":"ac-23","type":2,"dayOff":"sunday","gender":"male","officeID":3,"departmentID":2,"extra
info":[]},{"name":"ac22","email":"ac22@guc.com","ID":"ac-20","type":1,"dayOff":"sunday","gender":"male","officeID":3,"departmentID":2,"extra
info":[]},{"name":"ac21","email":"ac21@guc.com","ID":"ac-19","type":1,"dayOff":"sunday","gender":"male","officeID":3,"departmentID":2,"extra
info":[]},{"name":"ac20","email":"ac20@guc.com","ID":"ac-18","type":1,"dayOff":"sunday","gender":"male","officeID":3,"departmentID":2,"extra
info":[]}]
`
<br>

### <b>Functionality: </b> Assign academic member to a slot<br>	
<b>Route: </b> /ci/assignAcademicMemberToSlot <br>	
<b>Request Type: </b> POST <br>	
<b>Request Body: </b> `{
    "slotID": 1,
    "courseID": 2,
    "academicMemberID": 3
}` <br>	
<b>Response: </b> Academic memeber is assigned to the slot the successfuly or Error if invalid body
<br>

### <b>Functionality: </b> Remove academic member assignment from a slot<br>	
<b>Route: </b> /ci/removeAcademicMemberToSlot <br>	
<b>Request Type: </b> DELETE <br>	
<b>Request Body: </b> `{
    "slotID": 1,
    "courseID": 2,
    "academicMemberID": 3
}` <br>	
<b>Response: </b> Academic memeber assignment to the slot is removed successfuly or Error if invalid body
<br>

### <b>Functionality: </b> Update academic member slot assignment<br>	
<b>Route: </b> /ci/updateAcademicMemberslotAssignment <br>	
<b>Request Type: </b> PUT <br>	
<b>Request Body: </b> `{
    "oldSlotID": 2,
    "newSlotID": 1,
    "courseID": 2,
    "academicMemberID": 3
}` <br>	
<b>Response: </b> Academic memeber assignment to the slot is updated successfuly
<br>

### <b>Functionality: </b> Remove academic member from a course<br>	
<b>Route: </b> /ci/removeAcademicMemberFromCourse <br>	
<b>Request Type: </b> DELETE <br>	
<b>Request Body: </b> `{"courseID": 1, "academicMemberID": 3 }` <br>	
<b>Response: </b> Academic memeber removed successfully

### <b>Functionality: </b> Assign academic as a coordinator<br>	
<b>Route: </b> /ci/assignCourseCoordinator <br>	
<b>Request Type: </b> PUT <br>	
<b>Request Body: </b> `{
    "courseID": 2,
    "academicMemberID": 3
}` <br>	
<b>Response: </b> Course coordinator is assigned successfully
<br>

## Course Coordinator functionality
### <b>Functionality: </b> View Slot Linking Requests <br>	
<b>Route: </b> /cc/viewSlotLinkingRequests <br>	
<b>Request Type: </b> GET <br>	
<b>Response: </b> `[
    {
        "_id": "5fdcbc693f1a9333a81f075e",
        "ID": 1,
        "senderID": 4,
        "receiverID": 3,
        "courseID": 2,
        "slotID": 1,
        "status": "accepted",
        "__v": 0
    },
    {
        "_id": "5fdceeae4cad453d6467fc06",
        "ID": 2,
        "senderID": 4,
        "receiverID": 3,
        "courseID": 2,
        "slotID": 2,
        "status": "pending",
        "__v": 0
    }
]`
<br>

### <b>Functionality: </b> Accept or Reject Slot Linking Request<br>	
<b>Route: </b> /cc/handleSlotLinkingRequest <br>	
<b>Request Type: </b> POST <br>	
<b>Request Body: </b> `{
    "requestID": 1,
    "decision": 1 
} //  0 for rejected and 1 for accepted` <br>	
<b>Response: </b> The Request is accepted sucessfully !
<br>

### <b>Functionality: </b> Create Slot <br>	
<b>Route: </b> /cc/createSlot <br>	
<b>Request Type: </b> POST <br>	
<b>Request Body: </b> `{
    "courseID": 1,
    "slot": {"slotNumber":3,"day":"monday","locationID":1}
}` <br>	
<b>Response: </b> Slot added sucessfully !
<br>

### <b>Functionality: </b> delete Slot <br>	
<b>Route: </b> /cc/deleteSlot/:courseID/:slotID <br>	
<b>Request Type: </b> DELETE <br>	
<b> Request Parameters </b> slotID : the ID of the slot to be deleted , courseID : the ID of the course that has the to-be-deletd slot <br>
<b> Example how to call the route :</b> /cc/deleteSlot/2/1 <br>
<b>Response: </b> The Slot has been deleted sucessfully
<br>

### <b>Functionality: </b> update Slot <br>	
<b>Route: </b> /cc/updateSlot/:courseID/:slotID <br>	
<b>Request Type: </b> PUT <br>
<b> Request Parameters </b> slotID : the ID of the slot to be updated , courseID : the ID of the course that has the to-be-updated slot <br>
<b> Example how to call the route :</b> /cc/updateSlot/2/1 <br>
<b>Request Body: the fields of the slot to be updated  </b> `{
    "slotNumber" : 5
}` <br>
<b>Response: </b> The slot has been updated sucessfully !
<br>

## Academic member functionality  
### <b>Functionality: </b>View Schedule<br>	
<b>Route: </b> /ac/viewSchedule <br>	
<b>Request Type: </b> GET <br>	
<b>Request Body: </b> ` ` 
<br>	
<b>Response: </b> The current week schedule of the academic member (Putting in consideration the replacement requests)
<b>Response Example: </b> `[{"courseID":2,"slot":{"ID":1,"slotNumber":1,"day":"sunday","locationID":1,"instructor":2}}]`

<br>

### <b>Functionality: </b> Send slot linking request<br>	
<b>Route: </b> /ac/sendSlotLinkingRequest <br>	
<b>Request Type: </b> POST <br>	
<b>Request Body: </b> `{
    "slotID" : 2,
    "courseID" : 2
}` <br>	
<b>Response: </b> "The request has been sent sucessfully" or an error message denoting the error.
<br>

### <b>Functionality: </b> Send change day off request<br>	
<b>Route: </b> /ac/sendChangeDayOffRequest <br>	
<b>Request Type: </b> POST <br>	
<b>Request Body: </b> `{
    "newDayOff" : "saturday",
    "msg" : "I need a vacation change"
}` <br>	
<b>Response: </b> "The request has been sent sucessfully" or an error message denoting the error.
<br>


### <b>Functionality: </b> Get Notified on requests acceptance or rejection<br>	
<b>Route: </b> /ac/getAllNotifications <br>	
<b>Request Type: </b> GET <br>	
<b>Response: </b> 
`
[
    {
        "_id": "5fdcc1431fbd6f07d46f0fc0",
        "senderID": 3,
        "receiverID": 4,
        "msg": "Your Slot Linking Request for the slot with ID 2 for the course CSEN401 is accepted",
        "date": "2020-12-18T14:48:35.008Z",
        "__v": 0
    },
    {
        "_id": "5fdcf25234ee0408843a217b",
        "senderID": 3,
        "receiverID": 4,
        "msg": "Your Slot Linking Request for the slot with ID 3 for the course CSEN401 is rejected",
        "date": "2020-12-18T18:17:54.407Z",
        "__v": 0
    }
]
`
<br>


### <b>Functionality: </b> View the status of all submitted requests and filter by accepted/rejected/pending<br>	
<b>Route: </b> /ac/viewAllRequests/:view <br>	
<b>Request Type: </b> GET <br>	
<b>Request Parameters: </b> view : parameter has values 0, 1, 2 or 3 depending on the applied filter type. The filters are namely (all : 0 , accepted : 1, rejected : 2, pending : 3).<br>	
<b> Example how to call the route: </b> /ac/viewAllRequests/1 <br>
<b>Response: </b> 
`[
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [
        {
            "_id": "5fdcbc693f1a9333a81f075e",
            "ID": 1,
            "senderID": 4,
            "receiverID": 3,
            "courseID": 2,
            "slotID": 1,
            "status": "accepted",
            "__v": 0
        }
    ]
]
`
<br>

### <b>Functionality: </b> Send replacement request<br>	
<b>Route: </b> /ac/sendReplacementRequest <br>	
<b>Request Type: </b> POST <br>	
<b>Request Body: </b> `{"replacementID" : 3, "courseID" : 2 , "slotID" : 1 , "requestedDate" : 1608807967732}` <br>
<b> Note : </b> the requested date must be in the same number format as the one returned from Data.now() in javascript and if you want to change the date to be in the future or the past you can doing the following code by adding the days you need to be added or subtracted from the cuurent day ,so the returned value from this function will be you input in the request body : 
``` js
function generateDateFormat(addedOrsubtractedDays){
  var date = new Date(Date.now());
  var newDate = new Date();
  newDate.setDate(date.getDate() + addedOrsubtractedDays);
  return newDate.getTime();
} 
``` 
<br>
<b>Response: </b> "The replacement request has been sent sucessfully !" or an error message denoting the error.
<br>

### <b>Functionality: </b> View replacement request<br>	
<b>Route: </b> /ac/viewReplacementRequests <br>	
<b>Request Type: </b> GET <br>	
<b>Request Body: </b> ` ` <br>
<b>Response: </b> Array of the replacement requests.
<br>

### <b>Functionality: </b> Respond to replacement request<br>	
<b>Route: </b> /ac/respondToReplacementRequest <br>	
<b>Request Type: </b> PUT <br>	
<b>Request Body: </b> `{"request" : 3, "response" : 1}` <br>
<b> Note : </b> repsone == 1 == "accepted", repsone == 0 == "rejected"  <br>
<b>Response: </b> "Responded to replacement request successfully" or an error message denoting the error.
<br>


### <b>Functionality: </b> Send maternity leave request<br>	
<b>Route: </b> /ac/sendMaternityLeaveRequest <br>	
<b>Request Type: </b> POST <br>	
<b>Request Body: </b> `{"documents" : "https://google.com/ali", "startDate" :1608817862056, "endDate" : 1609250179792, "msg" : "Ali"}
` <br>
<b> Note : </b> the start/end dates must be in the same number format as the one returned from Data.now() in javascript and if you want to change the date to be in the future or the past you can doing the following code by adding the days you need to be added or subtracted from the cuurent day ,so the returned value from this function will be you input in the request body : 
``` js
function generateDateFormat(addedOrsubtractedDays){
  var date = new Date(Date.now());
  var newDate = new Date();
  newDate.setDate(date.getDate() + addedOrsubtractedDays);
  return newDate.getTime();
} 
```  

<br>
<b>Response: </b> "The request has been created successfully." or an error message denoting the error.
<br>



### <b>Functionality: </b> Send sick leave request<br>	
<b>Route: </b> /ac/sendSickLeaveRequest <br>	
<b>Request Type: </b> POST <br>	
<b>Request Body: </b> `{"documents": "https://kabeel.com/doc.html", "requestedDate": 1608315083669, "msg" : "We won!" }
` <br>
<b> Note : </b> the requestedDate date must be in the same number format as the one returned from Data.now() in javascript and if you want to change the date to be in the future or the past you can doing the following code by adding the days you need to be added or subtracted from the cuurent day ,so the returned value from this function will be you input in the request body : 
``` js
function generateDateFormat(addedOrsubtractedDays){
  var date = new Date(Date.now());
  var newDate = new Date();
  newDate.setDate(date.getDate() + addedOrsubtractedDays);
  return newDate.getTime();
} 
```
<br>
<b>Response: </b> "The request has been created successfully." or an error message denoting the error.
<br>

### <b>Functionality: </b> Send compensation leave request<br>	
<b>Route: </b> /ac/sendCompensationLeaveRequest <br>	
<b>Request Type: </b> POST <br>	
<b>Request Body: </b> `{"absenceDate" : 1607804091516, "requestedDate" : 1607286318099, "msg" : "Hi I am here"}
` <br>
<b> Note : </b> the absenceDate, requestedDate dates must be in the same number format as the one returned from Data.now() in javascript and if you want to change the date to be in the future or the past you can doing the following code by adding the days you need to be added or subtracted from the cuurent day ,so the returned value from this function will be you input in the request body : 
```js
function generateDateFormat(addedOrsubtractedDays){
  var date = new Date(Date.now());
  var newDate = new Date();
  newDate.setDate(date.getDate() + addedOrsubtractedDays);
  return newDate.getTime();
} 
```
<br>
<b>Response: </b> "The compensation request is sent successfully." or an error message denoting the error.
<br>

### <b>Functionality: </b> Send Annual leave request<br>	
<b>Route: </b> /ac/sendAnnualLeaveRequest <br>	
<b>Request Type: </b> POST <br>	
<b>Request Body: </b> `{"requestedDate" : 1607286318099, "msg" : "Hi I am here"}`
<br>
<b> Note : </b>the requestedDate dates must be in the same number format as the one returned from Data.now() in javascript and if you want to change the date to be in the future or the past you can doing the following code by adding the days you need to be added or subtracted from the cuurent day ,so the returned value from this function will be you input in the request body : 
``` js
function generateDateFormat(addedOrsubtractedDays){
  var date = new Date(Date.now());
  var newDate = new Date();
  newDate.setDate(date.getDate() + addedOrsubtractedDays);
  return newDate.getTime();
}
```
<br>
<b>Response: </b> "the annual leave request has already sucessfully created !" or an error message denoting the error.
<br>


### <b>Functionality: </b> Send accidental leave request<br>	
<b>Route: </b> /ac/sendAccidentalLeaveRequest <br>	
<b>Request Type: </b> POST <br>	
<b>Request Body: </b> `{"requestedDate" : 123 , "msg" : "Please accept my request"}
` <br>
<b> Note : </b> the requestedDate date must be in the same number format as the one returned from Data.now() in javascript and if you want to change the date to be in the future or the past you can doing the following code by adding the days you need to be added or subtracted from the cuurent day ,so the returned value from this function will be you input in the request body : 
``` js
function generateDateFormat(addedOrsubtractedDays){
  var date = new Date(Date.now());
  var newDate = new Date();
  newDate.setDate(date.getDate() + addedOrsubtractedDays);
  return newDate.getTime();
} 
```
<br>
<b>Response: </b> "The accidental leave request created successfully" or an error message denoting the error.
<br>

### <b>Functionality: </b> Cancel compensation leave request<br>	
<b>Route: </b> /ac/cancelCompensationLeaveRequest/:ID <br>	
<b>Request Type: </b> DELETE <br>
<b>Request Parameters: </b> The ID of the compensation leave request that the academic member wants to cancel. <br>
<b>Example of how to call the route:</b> /ac/cancelCompensationLeaveRequest/5 
<br>

### <b>Functionality: </b> Cancel sick leave request<br>	
<b>Route: </b> /ac/cancelSickLeaveRequest/:ID <br>	
<b>Request Type: </b> DELETE <br>
<b>Request Parameters: </b> The ID of the sick leave request that the academic member wants to cancel. <br>
<b>Example of how to call the route:</b> /ac/cancelSickLeaveRequest/3 
<br>

### <b>Functionality: </b> Cancel maternity leave request<br>	
<b>Route: </b> /ac/cancelMaternityLeaveRequest/:ID <br>	
<b>Request Type: </b> DELETE <br>
<b>Request Parameters: </b> The ID of the maternity leave request that the academic member wants to cancel. <br>
<b>Example of how to call the route:</b> /ac/cancelMaternityLeaveRequest/1
<br>

### <b>Functionality: </b> Cancel change day off request<br>	
<b>Route: </b> /ac/cancelChangeDayOffRequest/:ID <br>	
<b>Request Type: </b> DELETE <br>
<b>Request Parameters: </b> The ID of the change day off leave request that the academic member wants to cancel. <br>
<b>Example of how to call the route:</b> /ac/cancelChangeDayOffRequest/1
<br>

### <b>Functionality: </b> Cancel replacement request<br>	
<b>Route: </b> /ac/cancelReplacementRequest/:ID <br>	
<b>Request Type: </b> DELETE <br>
<b>Request Parameters: </b> The ID of the replacement request that the academic member wants to cancel. <br>
<b>Example of how to call the route:</b> /ac/cancelReplacementRequest/1
<br>


### <b>Functionality: </b> Cancel slot linking request<br>	
<b>Route: </b> /ac/cancelSlotLinkingRequest/:ID <br>	
<b>Request Type: </b> DELETE <br>
<b>Request Parameters: </b> The ID of the slot linking request that the academic member wants to cancel. <br>
<b>Example of how to call the route:</b> /ac/cancelSlotLinkingRequest/1
<br>
### <b>Functionality: </b> Cancel Accidental Leave request<br>	
<b> add 'auth-token' of academic member </b><br/>
<b>Route: </b> /ac/cancelAccidentalLeaveRequest <br>	
<b>Request Type: </b> DELETE <br>
<b>Request Body: </b> ID of the request <br/>
`
{"ID":2}
`
<br>
<b>Response:</b> request has been deleted succuessfully
<br>

### <b>Functionality: </b> Cancel Annual Leave request<br>	
<b> add 'auth-token' of academic member </b><br/>
<b>Route: </b> /ac/cancelAnnualLeaveRequest <br>	
<b>Request Type: </b> DELETE <br>
<b>Request Body: </b> ID of the request <br/>
`
{"ID":2}
`
<br>
<b>Response:</b> request has been deleted succuessfully
<br>











