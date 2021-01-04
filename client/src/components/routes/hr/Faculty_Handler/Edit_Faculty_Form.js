import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import React from 'react';


export default function EditFacultyForm(props) {
    const [newDepartments, setNewDepartments] = React.useState(null);

    const handleClickOpen = () => {
        props.handleOpenEdit();
    };

    const handleClose = () => {
        props.handleCloseEdit();
    };
    const handleUpdate = async () => {
        const newName = document.getElementById("editName").value;
        try {
            const req = {
                name: newName,
                departments: newDepartments,
            };
            const res = await axios.put(`hr/updateFaculty/${props.faculty.name}`, req);
            props.handleFaculties(res.data.newFaculty,1);
            props.setComponentInMain("faculty");
        } catch (err) {
            alert(err.response.data);
        }
        handleClose();
    }

    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update Faculty </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editName"
                        defaultValue = {props.faculty.name}
                        label="Name"
                        type="text"
                        fullWidth
                    />
                    <Autocomplete
                        multiple
                        options={props.departments}
                        getOptionLabel={(option) => option.name}
                        defaultValue = {props.faculty.departments}
                        onChange={(event, value) => {
                            value = value.map(elm => elm.ID);
                            setNewDepartments(value);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Departments"
                            />
                        )}
                    />
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