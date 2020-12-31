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
import axios from 'axios';
import React from 'react';

export default function EditLocationForm(props) {
    const [newType, setNewType] = React.useState(-1);

    const handleClickOpen = () => {
        props.handleOpenEdit();
    };

    const handleClose = () => {
        props.handleCloseEdit();
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
            props.setComponentInMain("location");
        } catch (err) {
            alert("please enter valid data.");
        }
        handleClose();
    }
    return (
        <div>

            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Location </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editName"
                        label="Name"
                        type="text"
                        defaultValue={props.location.name}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="editCapacity"
                        label="Capacity"
                        type="number"
                        defaultValue={props.location.capacity}
                        InputProps={{
                            inputProps: {
                                min: 0
                            }
                        }} fullWidth
                    />
                    <RadioGroup name="locationType" id="editType" defaultValue={props.location.type + ""}>
                        <FormControlLabel onClick={() => { setNewType(0) }}
                            value="0" control={<Radio />} label="Hall" />
                        <FormControlLabel onClick={() => { setNewType(1) }}
                            value="1" control={<Radio />} label="Tutorial room" />
                        <FormControlLabel onClick={() => { setNewType(2) }}
                            value="2" control={<Radio />} label="Office" />
                        <FormControlLabel onClick={() => { setNewType(3) }}
                            value="3" control={<Radio />} label="Lab" />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Update
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}