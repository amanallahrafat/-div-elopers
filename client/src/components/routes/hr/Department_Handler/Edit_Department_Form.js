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

export default function EditDepartmentForm(props) {
    const classes = useStyles();
    const [newHOD, setNewHOD] = React.useState(null);
    //const [newMembers, setNewMembers] = React.useState(null);

    const handleChange = (event) => {
        setNewHOD(event.target.value);
    }

    const handleClickOpen = () => {
        props.handleOpenEdit();
    };

    const handleClose = () => {
        props.handleCloseEdit();
        setNewHOD(null);
        setNewMembers(null);
    };

    const handleEditDepartment = async () => {
        const newName = document.getElementById("editName").value;
        try {
            const req = {
                name: newName,
            };
            if (newHOD != null) req.hodID = newHOD;
            //if (newMembers != null) req.members = newMembers;
            //console.log(newMembers);
            const res = await axios.put(`/hr/updateDepartment/${props.department.ID}`, req);
            props.setComponentInMain("department");
            props.openAlert("Department updated Successfully!" ,"success");
        } catch (err) {
            props.openAlert(err.response.data);
        }
        handleClose();
    }
    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Department </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editName"
                        label="Name"
                        type="text"
                        defaultValue={props.department.name}
                        fullWidth
                    />
                    <FormControl className={classes.formControl}>
                        <Autocomplete
                            options={props.academicMembers}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, value) => {
                                value = value.ID;
                                setNewHOD(value);
                            }}
                            disableClearable={true}
                            defaultValue={props.department.HODName}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Head of Department"
                                />
                            )}
                        />
                        {/* <Autocomplete
                            multiple
                            options={props.academicMembers}
                            getOptionLabel={(option) => option.name}
                            defaultValue={props.department.memberNames}
                            onChange={(event, value) => {
                                value = value.map(v => v.ID);
                                const copy = [];
                                for (const v of value) {
                                    if (!copy.includes(v)) copy.push(v);
                                }
                                setNewMembers(copy);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Members"
                                />
                            )}
                        /> */}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={handleEditDepartment} color="primary">
                        Edit
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}