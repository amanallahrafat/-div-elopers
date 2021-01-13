import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React, { useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';

export default function RequestForm(props) {
    const [msg, setMsg] = React.useState(" ");
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const [selectedDate, handleDateChange] = React.useState(tomorrow);

    const handleClose = () => {
        setMsg(" ");
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        handleDateChange(tomorrow);
        props.handleCloseForm();
    };

    const handleSubmitRequest = async () => {
        try {
            const res = await axios.post("ac/sendAnnualLeaveRequest",
                { "requestedDate": (new Date(selectedDate)).getTime(), "msg": msg });
            handleClose();
            console.log("props",props)
            await props.setComponentInMain("ac_annualLeaveRequest");
            props.openAlert('Request has been submitted successfully!',"success");
        } catch (err) {
            console.log(err);
            props.openAlert(err.response.data);
        }
    }

    function disablePast(date) {
        return date.getTime() <= new Date(Date.now());
    }
    return (
        <div>

            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Annual Leave Request </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="requestFormMessage"
                        label="Write an optional message"
                        fullWidth
                        onChange={(event) => { setMsg(event.target.value + " ") }}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <br /><br /><label> <div style={{ fontSize: "18px" }}>Requested Date:</div> </label>
                        <DatePicker
                            value={selectedDate}
                            shouldDisableDate={disablePast}
                            onChange={handleDateChange}
                        />
                    </MuiPickersUtilsProvider>
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