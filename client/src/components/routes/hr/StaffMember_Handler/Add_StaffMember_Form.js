import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import axios from 'axios';
import React from 'react';
import { Collapse } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function AddStaffMemberForm(props) {
    const classes = useStyles();

    const [name , setName] = React.useState(null);
    const [email , setEmail] = React.useState(null);
    const [salary , setSalary] = React.useState(null);

    const [dayOff , setDayOff] = React.useState(null);
    const [gender , setGender] = React.useState(null);
    const [office , setOffice] = React.useState(null);
    const [type, setType] = React.useState(null);
    const [department , setDepartment] = React.useState(null);
    const [memberType , setMemberType] = React.useState(null);


    const handleClickOpen = () => {
        props.handleOpenAdd();
    };

    const handleClose = () => {
        setName(null);setEmail(null);setSalary(null);
        setDayOff(null);setGender(null);
        setOffice(null);setType(null);
        setDepartment(null);setMemberType(null);
        props.handleCloseAdd();
    };

    const handleAdd = async () => {
        const name = document.getElementById("editName").value;
        const email = document.getElementById("editEmail").value;
        const salary = document.getElementById("editSalary").value;
        const extraInfo = document.getElementById("editExtraInfo").value;
        try {
            const req = {
                name : name,
                email : email,
                type : type, 
                dayOff : dayOff,
                gender : gender,
                officeID : office,
                salary : parseInt(salary),
            };
            if(type == 0){
                req.departmentID = department;
                if(memberType != null)
                    req.memberType = parseInt(memberType);
            }
            if(extraInfo != null ){
                if(extraInfo.length > 0) req.extraInfo = [extraInfo];
            }
            const res = await axios.post("/hr/addStaffMember", req);
            props.setComponentInMain("staffMember");
            props.openAlert("StaffMember Added Successfully" , "success");
            handleClose();
        } catch (err) {
            props.openAlert(err.response.data);
        }
    }

    return (
        <div>

            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Staff Member </DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="editName"
                        label="Name"
                        type="text"
                        fullWidth
                        onChange={(event) => {setName(event.target.value)}}
                    />
                   <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="editEmail"
                        label="Email"
                        type="mail"
                        fullWidth
                        style={{marginBottom:"20px"}}
                        onChange={(event) => {setEmail(event.target.value)}}
                    />
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="editSalary"
                        label="Salary"
                        type="number"
                        InputProps={{
                            inputProps: {
                                min: 0
                            }
                        }} fullWidth
                        style={{marginBottom:"20px"}}
                        onChange={(event) => {setSalary(event.target.value)}}
                    />
                    <label><b>Gender</b></label>
                    <RadioGroup row aria-label="position" name="gender" id="editGender" >
                        <FormControlLabel onClick={() => { setGender("male") }}
                            value="male" control={<Radio required = {true} />} label="Male"/>
                        <FormControlLabel onClick={() => { setGender("female") }}
                            value="female" control={<Radio required = {true} />} label="Female" />
                    </RadioGroup>
                    <label><b>Day Off</b></label>
                    <RadioGroup row aria-label="position" name="dayOff" id="editDayOff" >
                        <FormControlLabel onClick={() => { setDayOff("saturday") }}
                            value="saturday" control={<Radio />} label="Saturday" />
                        <FormControlLabel onClick={() => { setDayOff("sunday") }}
                            value="sunday" control={<Radio />} label="Sunday" />
                             <FormControlLabel onClick={() => { setDayOff("monday") }}
                            value="monday" control={<Radio />} label="Monday" />
                        <FormControlLabel onClick={() => { setDayOff("tuesday") }}
                            value="tuesday" control={<Radio />} label="Tuesday" />
                             <FormControlLabel onClick={() => { setDayOff("wednesday") }}
                            value="wednesday" control={<Radio />} label="Wednesday" />
                        <FormControlLabel onClick={() => { setDayOff("thursday") }}
                            value="thursday" control={<Radio />} label="Thursday" />
                    </RadioGroup>
                    <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label" required>Office</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="office"
                            value={office}
                            onChange={(event) => {setOffice(event.target.value)}}
                        >
                            {
                                props.offices.map(
                                    elm => {
                                        return <MenuItem value={elm.ID}>{elm.name}</MenuItem>
                                    }
                                )
                            }
                        </Select>
                    </FormControl><br/>
                    <label><b>Type</b></label>
                    <RadioGroup row aria-label="position" name="type" id="edittype">
                        <FormControlLabel onClick={() => { setType(0) }}
                            value="0" control={<Radio />} label="Academic Member" />
                        <FormControlLabel onClick={() => { setType(1) }}
                            value="1" control={<Radio />} label="HR" />
                    </RadioGroup>
                    <Collapse in ={type == 0 }>
                    <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Department</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="office"
                            value={department}
                            onChange={(event) => {setDepartment(event.target.value)}}
                        >
                            {
                                props.departments.map(
                                    elm => {
                                        return <MenuItem value={elm.ID}>{elm.name}</MenuItem>
                                    }
                                )
                            }
                        </Select>
                    </FormControl><br/>
                    <label><b>Member Type</b></label>
                    <RadioGroup row aria-label="position" name="type" id="editMemberType">
                        <FormControlLabel onClick={() => { setMemberType(0) }}
                            value="0" control={<Radio />} label="Head of Department" />
                        <FormControlLabel onClick={() => { setMemberType(3) }}
                            value="3" control={<Radio />} label="Academic Member" />
                    </RadioGroup>
                    </Collapse>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="editExtraInfo"
                        label="Extra Info"
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button 
                    disabled = {(name == null || email == null || salary == null
                        || gender == null || dayOff == null || office == null || type == null || (type == 0 && department == null))}
                    onClick={handleAdd} 
                    color="primary">
                        Add
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}