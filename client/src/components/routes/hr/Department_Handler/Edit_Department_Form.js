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

    const handleClickOpen = () => {
        props.handleOpenEdit();
    };

    const handleChange = (event) =>{
        setNewHOD(event.target.value);
    }

    const handleClose = () => {
        props.handleCloseEdit();
    };
    const handleUpdate = async () => {
        const newName = document.getElementById("editName").value;
        try {
            const req = {
                name: newName,
            };
            if (newHOD != null) {
                req.hodID = newHOD;
            }
            const res = await axios.put(`hr/updateDepartment/${props.department.ID}`, req);
            props.setComponentInMain("department");
        } catch (err) {
            alert(err.response.data);
        }
        handleClose();
    }
    if (props.department.memberNames == null)
        return <div />;

    console.log(props.department.memberNames)
    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update Department </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editName"
                        defaultValue={props.department.name}
                        label="Name"
                        type="text"
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
                                props.department.memberNames.map(
                                    elm =>{ 
                                        return <MenuItem value = {elm.ID}>{elm.name}</MenuItem>
                                    }
                                )
                            }
                        </Select>
                    </FormControl>
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