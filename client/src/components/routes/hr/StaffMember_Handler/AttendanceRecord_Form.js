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
import Attendance_Card from '../../../Attendance';
import axios from 'axios';
import React from 'react';

export default function EditStaffMemberForm(props) {
    const [newType, setNewType] = React.useState(-1);

    const handleClickOpen = () => {
        props.handleOpenAttendance();
    };

    const handleClose = () => {
        props.handleCloseAttendance();
    };
    const handleUpdate = async () => {
        const newName = document.getElementById("editName").value;
        const newCapacity = document.getElementById("editCapacity").value;
        try {
            const req = {
                name: newName,
                capacity: newCapacity,
                type: newType==-1? props.location.type: newType
            };
            const res = await axios.put(`hr/updateLocation/${props.location.ID}`, req);
            props.setComponentInMain("staffMember");
        } catch (err) {
            alert("please enter valid data.");
        }
        handleClose();
    }
    
    return (
        <div>

            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <Attendance_Card
                    attendanceRecords = {props.attendanceRecords}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Ok
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}