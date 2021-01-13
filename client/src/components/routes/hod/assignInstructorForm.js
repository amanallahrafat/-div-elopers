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

export default function AssignInstructorForm(props) {
    const [chosenInstructor, setChosenInstructor] = React.useState(null);

    const handleClose = () => {
        setChosenInstructor(null);
        props.handleClose();
    };
    const handleAdd = async () => {
        const instructorID = chosenInstructor.ID;
        const courseID = parseInt(JSON.stringify(props.course.ID));
        
        props.setBackdropIsOpen(true);
        try {
            const req = {
                courseID: courseID,
                instructorID: parseInt(instructorID)
            };
            const res = await axios.put('/hod/assignCourseInstructor', req);
            props.setComponentInMain("manageCourseInstructors");
            props.openAlert("Course Instructor assigned successfully.", "success");
        } catch (err) {
            props.openAlert(err.response.data);
        }
        props.setBackdropIsOpen(false);
        handleClose();
    }
    return (
<div>

            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Course Instructor </DialogTitle>
                <DialogContent>
                <Autocomplete
                    id="AssignAcademicMemberToSlotComboBox"
                    options={(props.academicMembers).filter((mem)=>{
                        if(!props.course)return true;
                        return !props.course.instructor.map(x=>x.ID).includes(mem.ID)})}
                  //  options={(props.academicMembers)}
                   
                    getOptionLabel={(option) => option.name}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Academic Members" variant="outlined" />}
                    onChange={(event, newValue) => {
                        setChosenInstructor(newValue);
                    }}

                />
                   
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button disabled={chosenInstructor==null }onClick={handleAdd} color="primary">
                        Add
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}