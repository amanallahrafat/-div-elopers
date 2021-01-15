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
import { useState, useEffect } from 'react';

export default function RequestForm(props) {
    const [dayOff, setDayOff] = React.useState("");
    const [msg, setMsg] = React.useState(" ");

    const handleClose = () => {
        setDayOff("");
        setMsg(" ");
        props.handleCloseForm();
    };

    useEffect(() => {
        if (!dayOff) {
            setDayOff(props.dayOff);
        }
    });

    const handleSubmitRequest = async () => {
        try {
            handleClose();
            const res = await axios.post("ac/sendChangeDayOffRequest", { "newDayOff": dayOff, "msg": msg });
            props.setComponentInMain("ac_changeDayOffRequest");
            props.openAlert("Request has been submitted Successfully!","success");
        } catch (err) {
            props.openAlert(err.response.data);
        }
    }
    return (
        <div>

            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Change Day Off Request </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="requestFormMessage"
                        label="Write an optional message"
                        fullWidth
                        onChange={(event) => { setMsg(event.target.value + " ") }}
                    />
                    <label><b>Day Off</b></label>
                    <RadioGroup row aria-label="position" name="dayOff" id="editDayOff" defaultValue={props.dayOff} >
                        <FormControlLabel onClick={() => { setDayOff("saturday") }}
                            value="saturday" control={<Radio />} label="Saturday" />
                        <FormControlLabel onClick={() => { setDayOff("sunday") }}
                            value="sunday" control={<Radio />} label="Sunday" />
                        <FormControlLabel onClick={() => { setDayOff("monday") }}
                            value="monday" control={<Radio />} label="Monday" />
                        <FormControlLabel onClick={() => { setDayOff("tuesday") }}
                            value="tuesday" control={<Radio />} label="Tuesday" />
                        <FormControlLabel onClick={() => { setDayOff("wednesday") }}
                            value="wednesday" control={<Radio />} label="Wednesday" />
                        <FormControlLabel onClick={() => { setDayOff("thursday") }}
                            value="thursday" control={<Radio />} label="Thursday" />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Back
          </Button>
                    <Button onClick={handleSubmitRequest} color="primary">
                        Submit request
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}