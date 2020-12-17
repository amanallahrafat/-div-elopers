# milestone-1-team-9
milestone-1-SarAhmed created by GitHub Classroom



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
<b>Route: </b> hr/updateLocation/:ID <br>
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
<b>Note: </b> The request body contains any of the attributes of the location except for the body



### <b>Functionality:</b> Delete a location <br>
<b>Route: </b> /hr/deleteLocation/:ID <br>
<b>Request type: </b> DELETE <br>
<b>Request parameters : </b> The ID of the location to be deleted
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
<b>Resposne: </b>`Registeration Completed!`
<b>Notes: </b> 1- The officeID must be an ID of a location of type office (type = 2). </b><br>
2- type denotes whether this staff member is an HR or an academic member (0-> academic member, 1-> hr) <br>
3- memberType denotes whether this academic member is a HOD or an academic member <br>
### <b>Functionality:</b> Update a staff member <br>
<b>Route: </b> /hr/updateStaffMember/:ID/:type<br>
<b>Request Type: </b> POST <br>
<b>Request Body : </b>
`
{"salary": 10000}
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
<b>Resposne: </b>`Staff member Updated Successfully!`
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



### <b>Functionality: </b> Add a new faculty <br>
<b>Route: </b> /hr/createFaculty <br>
<b>Request Type: </b> POST <br>
<b>Request Body: </b> `
{"name" : "MET","departments" : [2,3]}
`
<br>
<b>Note: </b> Departments array contains the ids of departments.  

<b>Functionality: </b> Update a faculty <br>
<b>Route: </b> hr/updateFaculty/:name <br>
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
{"name" : "MET","members" : [17], "hodID" : 17}
`
<br>
<b>Note: </b> Members array contains the ids of members that should be added to the new department.  

### <b>Functionality:</b> Delete a department <br>
<b>Route: </b> /hr/deleteDepartment/:ID <br>
<b>Request type: </b> DELETE <br>
<b>Request parameters : </b> The name of the department to be deleted
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
<b> Request body : </b> `
{"name":"COMPUTER PROGRAMMING"}
`
<br>
<b>Response :</b> Course has been updated successfully <br>

### <b>Functionality: </b> Delete a course <br>
<b>Route: </b> /hr/deleteCourse/:ID <br>
<b> Request type : </b> DELETE <br>
<b>Response :</b> Course has been deleted successfully <br>





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
<b>Request Type: </b> POST <br>	
<b>Request Body: </b> The Route has two options for the request body to view The whole Attendance Record or by month and the input requested body for the second should be like the following `{"month":12}`	
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
<b>Route: </b> /hod/deleteCourseInstructor <br>	
<b>Request Type: </b> DELETE <br>	
<b>Request Body: </b> `
{"courseID":3, "instructorID": 1}
`
<br>
<b>Response: </b>Course instructor was deleted successfully
<br>	


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


