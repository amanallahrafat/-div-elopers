import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React from 'react';

export default function EditLocationForm(props) {
    const [newType, setNewType] = React.useState(null);
    const [newName , setNewName] = React.useState(null);
    const [newCapacity ,  setNewCapacity] = React.useState(null);

    const handleClickOpen = () => {
        props.handleOpenAdd();
    };

    const handleClose = () => {
        setNewType(null);
        setNewName(null);
        setNewCapacity(null);
        props.handleCloseAdd();
    };

    const handleAddLocation = async () => {
        console.log("here********************");
        try {
            const req = {
                name: newName,
                capacity: newCapacity,
                type: newType
            };
            const res = await axios.post(`/hr/createLocation`, req);
            console.log(res.data);
            await props.handleLocations(res.data,0);
            props.setComponentInMain("location");
            props.openAlert("Location Added Successfully!","success");
        } catch (err) {
            props.openAlert(err.response.data);
        }
        handleClose();
    }
    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Location </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editName"
                        label="Name"
                        type="text"
                        onChange={(event) => {setNewName(event.target.value)}}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="editCapacity"
                        label="Capacity"
                        type="number"
                        onChange={(event) => {setNewCapacity(event.target.value)}}
                        InputProps={{
                            inputProps: {
                                min: 0
                            }
                        }} fullWidth
                    />
                    <RadioGroup name="locationType" id="editType">
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
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button 
                    disabled = {newName == null  || newCapacity == null || newType == null}
                    onClick={handleAddLocation}
                     color="primary">Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}