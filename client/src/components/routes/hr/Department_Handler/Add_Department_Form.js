import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
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

export default function AddDepartmentForm(props) {
    const classes = useStyles();
    const [newHOD, setNewHOD] = React.useState(null);
    const [newMembers, setNewMembers] = React.useState([]);
    const [newName , setNewName] = React.useState.apply(null);

    const handleChange = (event) => {
        setNewHOD(event.target.value);
    }

    const handleClickOpen = () => {
        props.handleOpenAdd();
    };

    const handleClose = () => {
        props.handleCloseAdd();
        setNewHOD(null);
        setNewMembers([]);
        setNewName(null);
    };

    const handleAddDepartment = async () => {
        try {
            const req = {
                name: newName,
            };
            if (newHOD != null) req.hodID = newHOD;
            if (newMembers.length > 0) req.members = newMembers;
            const res = await axios.post(`/hr/createDepartment`, req);
            props.setComponentInMain("department");
            props.openAlert("Department Added Successfully!" , "success");
        } catch (err) {
            props.openAlert(err.response.data);
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
                        onChange={(event) => {setNewName(event.target.value)}}
                        fullWidth
                    />
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Head of Department</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="hod"
                            value={newHOD}
                            onChange={handleChange}
                        >
                            {
                                props.academicMembers.map(
                                    elm => {
                                        return <MenuItem value={elm.ID}>{elm.name}</MenuItem>
                                    }
                                )
                            }
                        </Select>
                        <Autocomplete
                            multiple
                            options={props.academicMembers}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, value) => {
                                value = value.map(elm => elm.ID);
                                setNewMembers(value);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Members"
                                />
                            )}
                        />
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button 
                    disabled = {newName == null}
                    onClick={handleAddDepartment} color="primary">
                        Add
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}