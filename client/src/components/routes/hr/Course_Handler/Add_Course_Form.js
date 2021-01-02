import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

export default function AddCourseForm(props) {
    const classes = useStyles();
    const [newDepartments , setNewDepartments] = React.useState(null);

    const handleChange = (event) =>{
        setNewDepartments(event.target.value);
    }

    const handleClickOpen = () => {
        props.handleOpenAdd();
    };

    const handleClose = () => {
        props.handleCloseAdd();
    };

    const handleAdd = async () => {
        const newName = document.getElementById("editName").value;
        const newCode  = document.getElementById("editCode").value;
        const newDescription  = document.getElementById("editDescription").value;
        try {
            const req = {
                name: newName,
                code : newCode,
            };
            if (newDepartments != null) {
                req.department = newDepartments;
            }
            if(newDescription.length > 0){
                req.description = newDescription;
            }
            const res = await axios.post(`/hr/createCourse`, req);
            props.setComponentInMain("course");
        } catch (err) {
            alert(err.response.data);
        }
        handleClose();
    }

    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Course </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editName"
                        label="Name"
                        type="text"
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editCode"
                        label="Code"
                        type="text"
                        fullWidth
                    />
                   <Autocomplete
                        multiple
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
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editDescription"
                        label="Description"
                        multiline
                        rowsMax = {4}
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={handleAdd} color="primary">
                        Add
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}