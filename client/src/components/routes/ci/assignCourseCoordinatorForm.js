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

export default function AssignCourseCoordinatorForm(props) {
    const [chosenInstructor, setChosenInstructor] = React.useState(null);

    const handleClose = () => {
        setChosenInstructor(null)
        props.handleClose();
    };
    const handleAssignCoordinator = async () => {
        const instructorID = chosenInstructor.ID;
        console.log("The instructor ID is ", instructorID)
        console.log(props.courseID, "in handle assign coordinator form")
        const courseID = parseInt((props.courseID));
        props.setBackdropIsOpen(true);
        try {
            const req = {
                courseID: courseID,
                academicMemberID: parseInt(instructorID)
            };
            const res = await axios.put('/ci/assignCourseCoordinator', req);
            console.log("before call update")
            const departmentCourses = await props.updateCourseStaff({courseID:courseID});
            props.setSelectedCourseCordinator(chosenInstructor.name)
            props.setSelectedCourseCordinatorID(chosenInstructor.ID);
            props.setComponentInMain("manageCourseStaff");
        } catch (err) {
            console.log(err);
            alert(err.response.data);
        }
        props.setBackdropIsOpen(false);
        handleClose();
    }
    return (
        <div>

            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Assign course coordinator </DialogTitle>
                <DialogContent>
                    <Autocomplete
                        id="AddCourseInstructorComboBox"
                        // options={(props.academicMembers).filter((mem)=>{
                        //     if(!props.course)return true;
                        //     return !props.course.instructor.map(x=>x.ID).includes(mem.ID)})}
                        options={(props.academicMembers).filter((mem)=>{return mem.type == 3})}

                        getOptionLabel={(option) => option.name}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Academic Members" variant="outlined" />}
                        onChange={(event, newValue) => {
                            console.log("chosenInstructor",chosenInstructor);
                            setChosenInstructor(newValue);
                        }}

                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button disabled={chosenInstructor == null} onClick={handleAssignCoordinator} color="primary">
                        Add
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}