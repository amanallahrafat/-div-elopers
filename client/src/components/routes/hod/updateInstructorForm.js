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
    const [chosenInstructor, setChosenInstructor] = React.useState(null);
    const [newCourse, setNewCourse] = React.useState(null);
    

    const handleClose = () => {
        setChosenInstructor(null);
        setNewCourse(null);
        props.handleClose();
    };
    const handleUpdate = async () => {
        const instructorID = chosenInstructor.ID;
        const oldCourseID = parseInt(JSON.stringify(props.course.ID));
        const newCourseID = newCourse.ID;
        try {
            const req = {
                oldCourseID: oldCourseID,
                newCourseID: newCourseID,
            };
            const res = await axios.put(`/hod/updateCourseInstructor/${instructorID}`, req);
            props.setComponentInMain("manageCourseInstructors");
        } catch (err) {
            props.openAlert(err.response.data);
        }
        handleClose();
    }
    return (
<div>

            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update A Course Instructor </DialogTitle>
                <DialogContent>
                <Autocomplete
                    id="UpdateCourseInstructorComboBox"
                    options={(props.academicMembers).filter((mem)=>{
                        if(!props.course)return true;
                        return props.course.instructor.map(x=>x.ID).includes(mem.ID)})}
                  //  options={(props.academicMembers)}
                   
                    getOptionLabel={(option) => option.name}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Select an academic member" variant="outlined" />}
                    onChange={(event, newValue) => {
                        setChosenInstructor(newValue);
                    }}
                />
                
                <br/>

                <Autocomplete
                    id="UpdateCourseInstructorComboBox2"
                    options={props.allCourses}
                  //  options={(props.academicMembers)}
                   
                    getOptionLabel={(option) => {return(option.name + " " + option.code)}}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Select a new course" variant="outlined" />}
                    onChange={(event, newValue) => {
                        setNewCourse(newValue);
                    }}
                />
                   
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button disabled={newCourse==null||chosenInstructor==null} onClick={handleUpdate} color="primary">
                        Update
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}