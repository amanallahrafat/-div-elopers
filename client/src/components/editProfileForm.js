import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React from 'react';

export default function editProfileForm(props) {
    //  const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        props.handleOpenEdit();
    };

    const handleClose = () => {
        props.handleCloseEdit();
    };
    const handleUpdate = async () => {
        const newMail = document.getElementById("editEmail").value;
        try {
            const req = { email: newMail };
            const res = await axios.post('updateMyProfile', req);
            console.log(res.data);
            props.setComponentInMain("profile");
        } catch (err) {
            alert("please enter a valid mail");
        }
        handleClose();
    }
    return (
        <div>

            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Profile </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will send updates
                        occasionally.
          </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="editEmail"
                        label="Email Address"
                        type="email"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={handleUpdate} color="primary">
                        update
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}