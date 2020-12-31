import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import React from 'react';

export default function AddDepartmentForm(props) {
    const [newDepartments, setNewDepartments] = React.useState([]);

    const handleClickOpen = () => {
        props.handleOpenAdd();
    };

    const handleClose = () => {
        props.handleCloseAdd();
    };

    const handleAddDepartment = async () => {
        const newName = document.getElementById("editName").value;
        try {
            const req = {
                name: newName,
                departments: newDepartments,
            };
            const res = await axios.post(`/hr/createDepartment`, req);
            props.setComponentInMain("department");
        } catch (err) {
            alert(err.response.data);
        }
        handleClose();
    }
    return (
        <div>

            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Department </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editName"
                        label="Name"
                        type="text"
                        fullWidth
                    />
                    <Autocomplete
                        multiple
                        id="editDepartments"
                        options={props.departments}
                        getOptionLabel={(option) => option.name}
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
                    <Button onClick={handleAddDepartment} color="primary">
                        Add
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}