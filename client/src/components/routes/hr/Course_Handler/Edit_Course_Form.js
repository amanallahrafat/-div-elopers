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

export default function EditCourseForm(props) {
    const classes = useStyles();
    const [newDepartment, setNewDepartments] = React.useState(null);

    const handleClickOpen = () => {
        props.handleOpenEdit();
    };

    const handleClose = () => {
        props.handleCloseEdit();
    };
    const handleUpdate = async () => {
        const newName = document.getElementById("editName").value;
        const newCode  = document.getElementById("editCode").value;
        const newDescription  = document.getElementById("editDescription").value;
        try {
            const req = {
                name: newName,
                code : newCode,
                description : newDescription,
            };
            if (newDepartment != null) {
                req.department = newDepartment;
            }
            const res = await axios.put(`hr/updateCourse/${props.course.ID}`, req);
            props.setComponentInMain("course");
            props.openAlert("Course updated Successfully!" , "success");
        } catch (err) {
            props.openAlert(err.response.data);
        }
        handleClose();
    }

    const getDefaultDepartments = () =>{
        if(props.course.department != null )
            return props.departments.filter(elm => props.course.department.includes(elm.ID));
    }

    if (props.course == null)
        return <div />;

    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update Course </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editName"
                        defaultValue={props.course.name}
                        label="Name"
                        type="text"
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editCode"
                        defaultValue={props.course.code}
                        label="Code"
                        type="text"
                        fullWidth
                    />
                   <Autocomplete
                        multiple
                        options={props.departments}
                        getOptionLabel={(option) => option.name}
                        defaultValue = {getDefaultDepartments()}
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
                        defaultValue={props.course.description}
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
                    <Button onClick={handleUpdate} color="primary">
                        Update
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}