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
    const [selectedStartDate, handleStartDateChange] = React.useState(tomorrow);
    const [selectedEndDate, handleEndDateChange] = React.useState(tomorrow);

    const handleClose = () => {
        setMsg(" ");
        setDocument("");
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        handleStartDateChange(tomorrow);
        handleEndDateChange(tomorrow);
        props.handleCloseForm();
    };

    const handleSubmitRequest = async () => {
        try {
            const res = await axios.post("ac/sendMaternityLeaveRequest",
                {
                    "startDate": (new Date(selectedStartDate)).getTime(),
                    "endDate": (new Date(selectedEndDate)).getTime(),
                    "msg": msg,
                    "documents": document,
                });
            handleClose();
            await props.setComponentInMain("ac_maternityLeaveRequest");
            props.openAlert('Request has been submitted successfully!',"success");
        } catch (err) {
            props.openAlert(err.response.data);
        }
    }

    function disablePast(date) {
        return date.getTime() <= new Date(Date.now());
    }
    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Maternity Leave Request</DialogTitle>
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
                            value={selectedStartDate}
                            shouldDisableDate={disablePast}
                            onChange={handleStartDateChange}
                        />
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <br /><br /><label> <div style={{ fontSize: "18px" }}>End Date:</div> </label>
                        <DatePicker
                            value={selectedEndDate}
                            shouldDisableDate={disablePast}
                            onChange={handleEndDateChange}
                        />
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Back
          </Button>
                    <Button onClick={handleSubmitRequest} color="primary"
                     disabled = {document == " " || document == ""}>
                        Submit request
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}