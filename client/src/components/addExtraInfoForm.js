import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React from 'react';

export default function addExtraInfoForm(props) {
    const handleClickOpen = () => {
        props.handleOpenEdit();
    };

    const handleClose = () => {
        props.handleCloseEdit();
    };
    const handleAddExtraInfo = async () => {
        const newInfo = document.getElementById("addExtraInfo").value;
        try {
            const req = {
                extraInfo: [
                    ...props.profile.extraInfo, newInfo
                ]
            };
            const res = await axios.post('updateMyProfile', req);
            props.openAlert("Profile Updated Successfully","success");
            props.setComponentInMain("profile");
        } catch (err) {
            props.openAlert(err.response.data,"error");
        }
        handleClose();
}
    return (
        <div>

            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add extra information </DialogTitle>

                <DialogContent>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="addExtraInfo"
                        label="extra information"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={handleAddExtraInfo} color="primary">
                        Add
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}