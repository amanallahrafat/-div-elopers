# milestone-1-team-9
milestone-1-SarAhmed created by GitHub Classroom



## HR Functionalities

<b>Functionality: </b> Add a new location <br>
<b>Route: </b> /hr/createLocation <br>
<b>Request Type: </b> POST <br>
<b>Request Body: </b> `
{"name" : "H12", "capacity" : 120, "type" : 0}
`
<br>
<b>Note: </b> Type denotes whether the location is a hall, tutorial room, lab or office. 0 -->hall, 1--> tut room, 2--> office, 3-->lab <br>


<b>Functionality: </b> Update a location <br>
<b>Route: </b> hr/updateLocation/:ID <br>
<b>Request Type: </b> PUT <br>
<b>Request Parameter: </b> The ID of the location to be updated<br>
<b>Request body : </b> `
{"name" : "H30","type" : 200}
`
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



<b>Functionality:</b> Delete a location <br>
<b>Route: </b> /hr/deleteLocation/:ID <br>
<b>Request type: </b> DELETE <br>
<b>Request parameters : </b> The ID of the location to be deleted


<b>Functionality:</b> Add a staff member <br>
<b>Route: </b> /hr/addStaffMember<br>
<b>Request type: </b> POST <br>
<b>Request bosy : </b>`
{ "name" :"Ashry", "email" : "ahmed@guc.com","type" :0,"dayOff" :"sunday","gender" : "male", "officeID" : 1,"salary" :7000}
`
<br>
<b>Note: </b> The officeID must be an ID of a location of type office (type = 2).  



## Staff Member Functionality

<b>Functionality: </b> Login with a unique email and password. <br>
<b>Route: </b>/login<br>
<b>Request type: </b>POST<br> 
<b>Request Body : </b> `
{"email": "ahmed@guc.edu.eg","password":"team9111"}
`
<br>

