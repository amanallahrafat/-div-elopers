import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function AddSlotForm(props) {
    const classes = useStyles();

    const [day, setDay] = React.useState(null);
    const [slotNumber , setSlotNumber] = React.useState(null);
    const [location , setLocation] = React.useState(null);

    const handleClickOpen = () => {
        props.handleOpenAdd();
    };

    const handleClose = () => {
        setDay(null);setSlotNumber(null);setLocation(null);
        props.handleCloseAdd();
    };

    const handleAddSlot = async () => {
        try {
            const req = {
                courseID : props.courseID,
                slot : {
                    slotNumber : slotNumber,
                    day : day ,
                    locationID : location
                }
            };
            const res = await axios.post(`/cc/createSlot`, req);
            console.log(res.data);
            await props.handleSlots(res.data,0);
            await props.setComponentInMain("slot");
            props.openAlert("Slot has been deleted Successfully!","success");
        } catch (err) {
            props.openAlert(err.response.data);
        }
        handleClose();
    }
    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Slot </DialogTitle>
                <DialogContent>
                    <label><b>Slot Timing</b></label>
                    <RadioGroup row name="slotNumber" id="editSlotNumber">
                        <FormControlLabel onClick={() => { setSlotNumber(1) }}
                            value="1" control={<Radio />} label="First" />
                        <FormControlLabel onClick={() => { setSlotNumber(2) }}
                            value="2" control={<Radio />} label="Second" />
                        <FormControlLabel onClick={() => { setSlotNumber(3) }}
                            value="3" control={<Radio />} label="Third" />
                        <FormControlLabel onClick={() => { setSlotNumber(4) }}
                            value="4" control={<Radio />} label="Fourth" />
                        <FormControlLabel onClick={() => { setSlotNumber(5) }}
                            value="5" control={<Radio />} label="Fifth" />
                    </RadioGroup>
                </DialogContent>
                <DialogContent>
                    <label><b>Day</b></label>
                <RadioGroup row aria-label="position" name="day" id="editDay" >
                        <FormControlLabel onClick={() => { setDay("saturday") }}
                            value="saturday" control={<Radio />} label="Saturday" />
                        <FormControlLabel onClick={() => { setDay("sunday") }}
                            value="sunday" control={<Radio />} label="Sunday" />
                             <FormControlLabel onClick={() => { setDay("monday") }}
                            value="monday" control={<Radio />} label="Monday" />
                        <FormControlLabel onClick={() => { setDay("tuesday") }}
                            value="tuesday" control={<Radio />} label="Tuesday" />
                             <FormControlLabel onClick={() => { setDay("wednesday") }}
                            value="wednesday" control={<Radio />} label="Wednesday" />
                        <FormControlLabel onClick={() => { setDay("thursday") }}
                            value="thursday" control={<Radio />} label="Thursday" />
                    </RadioGroup>
                </DialogContent>
                <FormControl className={classes.formControl} style={{marginLeft : "25px"}}>
                    <InputLabel id="demo-simple-select-label" required>Location</InputLabel>
                        <Select
                            style={{width : "200px"}}
                            labelId="demo-simple-select-label"
                            id="office"
                            value={location}
                            onChange={(event) => {setLocation(event.target.value)}}
                        >
                            {
                                props.locations.map(
                                    elm => {
                                        return <MenuItem value={elm.ID}>{elm.name}</MenuItem>
                                    }
                                )
                            }
                        </Select>
                    </FormControl><br/>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button 
                    disabled = {day == null || slotNumber == null || location == null}
                    onClick={handleAddSlot} color="primary">Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}