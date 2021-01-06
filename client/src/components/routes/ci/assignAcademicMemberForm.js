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

        console.log(props.courseID, props.slotID, "in handle add form")
        const courseID = parseInt((props.courseID));
        const slotID = parseInt((props.slotID));
        try {
            const req = {
                courseID: courseID,
                slotID: slotID,
                academicMemberID: parseInt(instructorID)
            };
            const res = await axios.post('/ci/assignAcademicMemberToSlot', req);
            console.log("before call update")
            const departmentCourses = await props.updateDepartmentCourses();

            if (props.selectedCourse.courseID != "loading ID") {
                const sc = departmentCourses.find((c) => {
                    return c.courseID == props.selectedCourseID
                });
                props.setSelectedCourse(sc);

                props.mapToScheduleObj(sc?.courseSlots, props.setCurrentSlot, props.setCurrentCourse,
                    props.setOpenAssignAcademicMemberForm, props.setCurrentInstructorID, props.setOpenUpdateAcademicMemberForm,
                    props.handleDeleteAssignMemberToSlot,props.openAlert)
            } else {
                console.log("initially")
            }


            props.setComponentInMain("instructorCourses");
        } catch (err) {
            console.log(err);
            props.openAlert(err.response.data);
        }
        handleClose();
    }
    return (
        <div>

            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Assign academic member to this slot </DialogTitle>
                <DialogContent>
                    <Autocomplete
                        id="AddCourseInstructorComboBox"
                        // options={(props.academicMembers).filter((mem)=>{
                        //     if(!props.course)return true;
                        //     return !props.course.instructor.map(x=>x.ID).includes(mem.ID)})}
                        options={(props.academicMembers)}

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
                    <Button disabled={chosenInstructor == null} onClick={handleAdd} color="primary">
                        Add
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}