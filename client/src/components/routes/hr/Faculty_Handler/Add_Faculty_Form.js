import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import React from 'react';

export default function AddFacultyForm(props) {
    const [newDepartments, setNewDepartments] = React.useState([]);
    const [newName , setNewName] = React.useState(null);

    const handleClickOpen = () => {
        props.handleOpenAdd();
    };

    const handleClose = () => {
        props.handleCloseAdd();
    };

    const handleAddFaculty = async () => {
        console.log(newDepartments);
        try {
            const req = {
                name: newName,
                departments: newDepartments,
            };
            const res = await axios.post(`/hr/createFaculty`, req);
            // const obj = res.data;

            // props.handleFaculties(res.data,0);
            props.setComponentInMain("faculty");
            props.openAlert("Faculty Added Successfully!" , "success");
        } catch (err) {
            props.openAlert(err.response.data);
        }
        handleClose();
    }
    return (
        <div>

            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Faculty </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editName"
                        label="Name"
                        type="text"
                        onChange={(event) => {setNewName(event.target.value)}}
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
                    <Button 
                    disabled = {newName == null}
                    onClick={handleAddFaculty} color="primary">
                        Add
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}