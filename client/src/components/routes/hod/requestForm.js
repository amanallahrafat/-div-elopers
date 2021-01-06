import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React from 'react';

export default function RequestForm(props) {

    const handleClose = () => {
        props.handleCloseForm();
    };
    const handleRejectRequest = async () => {
        const msg = document.getElementById("requestFormMessage").value+" ";
        props.handleRejectRequest(props.requestID,msg);
        handleClose();
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
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Back
          </Button>
                    <Button onClick={handleRejectRequest} color="primary">
                        Reject request
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}