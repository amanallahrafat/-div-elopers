import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import React from 'react';

export default function UpdateInstructorForm(props) {
    const [chosenSlot, setChosenSlot] = React.useState(null);

    const handleClose = () => {
        setChosenSlot(null);
        props.handleClose();
    };
    const handleUpdate = async () => {

       
        console.log(props.courseID,props.slotID, "in handle add form")
        
        // old info
        console.log(props.instructorID," the instructor ID");
        
        const instructorID=parseInt((props.instructorID).split("-")[1]);
        const courseID = parseInt((props.courseID));
        const slotID = parseInt((props.slotID));
        //new info
        //const newCourseID = parseInt(chosenCourse.ID)
        const newSlotID = parseInt(chosenSlot.slotID)
        
        props.setBackdropIsOpen(true);
        

        try {
            const req = {
                courseID: courseID,
                oldSlotID:slotID,
                newSlotID:newSlotID,
                academicMemberID: parseInt(instructorID)
            };
            const res = await axios.put('/ci/updateAcademicMemberslotAssignment', req);
            console.log("before call update")
             const departmentCourses=await props.updateDepartmentCourses();
       
            if(props.selectedCourse.courseID!="loading ID"){
                const sc = departmentCourses.find((c) => {
                    return c.courseID == props.selectedCourseID
                });
                props.setSelectedCourse(sc);
                
                

                props.mapToScheduleObj(sc?.courseSlots, props.setCurrentSlot, props.setCurrentCourse
                    , props.setOpenAssignAcademicMemberForm,props.setCurrentInstructorID, props.setOpenUpdateAcademicMemberForm,
                    props.handleDeleteAssignMemberToSlot,props.openAlert)
            }else{
                console.log("initially")
            }


            props.setComponentInMain("instructorCourses");
        } catch (err) {
            console.log(err);
            props.openAlert(err.response.data);
        }
        props.setBackdropIsOpen(false)
        
        handleClose();
    }
    return (
<div>

            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update academic member slot assignment </DialogTitle>
                <DialogContent>
                <Autocomplete
                    id="UpdateAcademicMemberAssignmentComboBox"
                    // options={(props.academicMembers).filter((mem)=>{
                    //     if(!props.course)return true;
                    //     return !props.course.instructor.map(x=>x.ID).includes(mem.ID)})}
                  options={(props.selectedCourse.courseSlots).filter((slot)=>{return slot.instructorID==""}).sort((a,b)=>{
                    const getDayNumber=(day)=>{
                    if(day=="saturday")
                    return 0;
                    if(day=="sunday")
                    return 1;
                    if(day=="monday")
                    return 2;
                    if(day=="tuesday")
                    return 3;
                    if(day=="wednesday")
                    return 4;
                    if(day=="thursday")
                    return 5;
                    if(day=="friday")
                    return 6;
                return -1;    
                }
                      return (a.day==b.day)?a.slotNumber-b.slotNumber:(getDayNumber(a.day)-getDayNumber(b.day));
                  })}
                    getOptionLabel={(option) =>(" Day: "+ option.day+" Slot Number: " + option.slotNumber + " Location: "+ option.locationName )}
                    style={{ width: 400 }}
                    renderInput={(params) => <TextField {...params} label="Course Slots" variant="outlined" />}
                    onChange={(event, newValue) => {
                        setChosenSlot(newValue);
                    }}

                />
                   
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button disabled={chosenSlot==null } onClick={handleUpdate} color="primary">
                        Update
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}