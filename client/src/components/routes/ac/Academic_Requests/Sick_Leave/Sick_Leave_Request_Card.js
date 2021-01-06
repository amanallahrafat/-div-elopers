import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import {
    DatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';
import axios from 'axios';
import React from 'react';

export default function RequestForm(props) {
    const [msg, setMsg] = React.useState(" ");
    const [document, setDocument] = React.useState("");

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const [selectedRequestedDate, handleRequestedDateChange] = React.useState(tomorrow);

    const handleClose = () => {
        setMsg(" ");
        setDocument("");
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        handleRequestedDateChange(tomorrow);
        props.handleCloseForm();
    };

    const handleSubmitRequest = async () => {
        try {
            handleClose();
            const res = await axios.post("ac/sendSickLeaveRequest",
                {
                    "requestedDate": (new Date(selectedRequestedDate)).getTime(),
                    "msg": msg,
                    "documents": document,
                });
            await props.setComponentInMain("ac_sickLeaveRequest");
            alert('Request has been submitted successfully.')
        } catch (err) {
            console.log(err.response.data)
            alert(err.response.data);
        }
    }

    function disablePast(date) {
        const today = new Date()
        const threeDaysBefore = new Date(today)
        threeDaysBefore.setDate(tomorrow.getDate() - 4)
        return date.getTime() <= new Date(threeDaysBefore);
    }

    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Write an optional message </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="requestFormMessage"
                        label="Write an optional message"
                        fullWidth
                        onChange={(event) => { setMsg(event.target.value + " ") }}
                    />
                    <TextField
                        required
                        type="url"
                        margin="dense"
                        id="requestFormDocument"
                        label="Document URL"
                        fullWidth
                        onChange={(event) => { setDocument(event.target.value + " ") }}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <br /><br /><label> <div style={{ fontSize: "18px" }}>Start Date:</div> </label>
                        <DatePicker
                            value={selectedRequestedDate}
                            shouldDisableDate={disablePast}
                            onChange={handleRequestedDateChange}
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