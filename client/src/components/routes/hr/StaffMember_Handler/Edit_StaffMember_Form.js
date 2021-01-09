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
import Autocomplete from '@material-ui/lab/Autocomplete';
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

export default function EditStaffMemberForm(props) {

    const classes = useStyles();

    const [name , setName] = React.useState(null);
    const [salary , setSalary] = React.useState(null);
    const [dayOff , setDayOff] = React.useState(null);
    const [gender , setGender] = React.useState(null);
    const [office , setOffice] = React.useState(null);
    const [department , setDepartment] = React.useState(null);
    const [memberType , setMemberType] = React.useState(null);
    const [extraInfo , setExtraInfo] = React.useState(null);


    const handleClickOpen = () => {
        props.handleOpenEdit();
    };

    const handleClose = () => {
        setName(null);setSalary(null);
        setDayOff(null);setGender(null);
        setOffice(null);setDepartment(null);
        setMemberType(null);setExtraInfo(null);
        props.handleCloseEdit();
    };
    const handleUpdate = async () => {
        try {
            const req = {};
            if(name != null) req.name = name;
            if(dayOff != null ) req.dayOff = dayOff;
            if(gender != null ) req.gender = gender;
            if(office != null ) req.officeID = office;
            if(salary != null ) req.salary = salary;
            if(extraInfo != null ) req.extraInfo = extraInfo;
            if(props.staffMember.type == 0){
                if(department != null ) req.departmentID = department;
                if(memberType != null) req.memberType = parseInt(memberType);
            }
            console.log(req)
            const res = await axios.put(`/hr/updateStaffMember/${props.staffMember.ID}/${props.staffMember.type}`, req);
            props.setComponentInMain("staffMember");
            props.openAlert("Staff Member has been updated Successfully!","success");
            handleClose();
        } catch (err) {
            props.openAlert(err.response.data);
        }
        handleClose();
    }


    const getDefaultOffice = async (ID) =>{
        console.log(props.staffMember)
        const office  = props.offices.filter(elm => elm.ID == ID)[0];
        console.log(office);
        return office;
    }

    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update Staff Member </DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="editName"
                        label="Name"
                        type="text"
                        fullWidth
                        defaultValue = {props.staffMember.name}
                        onChange={(event) => {setName(event.target.value)}}
                    />
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="editSalary"
                        label="Salary"
                        type="number"
                        defaultValue = {props.staffMember.salary}
                        InputProps={{
                            inputProps: {
                                min: 0
                            }
                        }} fullWidth
                        style={{marginBottom:"20px"}}
                        onChange={(event) => {setSalary(event.target.value)}}
                    />
                    <label><b>Gender</b></label>
                    <RadioGroup row aria-label="position" name="gender" id="editGender" defaultValue={props.staffMember.gender} >
                        <FormControlLabel onClick={() => { setGender("male") }}
                            value="male" control={<Radio required = {true} />} label="Male"/>
                        <FormControlLabel onClick={() => { setGender("female") }}
                            value="female" control={<Radio required = {true} />} label="Female" />
                    </RadioGroup>
                    <label><b>Day Off</b></label>
                    <RadioGroup row aria-label="position" name="dayOff" id="editDayOff" defaultValue = {props.staffMember.dayOff} >
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
                    <Autocomplete
                        options={props.offices}
                        getOptionLabel={(option) => option.name}
                        defaultValue = {props.offices.find(elm =>elm.ID == props.staffMember.officeID)}
                        onChange={(event, value) => {
                            value = value.map(elm => elm.ID);
                            setOffice(value);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Office"
                            />
                        )}
                    />
                    <Collapse in ={props.staffMember.type == 0 }>
                    <Autocomplete
                        options={props.departments}
                        getOptionLabel={(option) => option.name}
                        defaultValue = {props.departments.find(elm =>elm.ID == props.staffMember.departmentID)}
                        onChange={(event, value) => {
                            value = value.map(elm => elm.ID);
                            setOffice(value);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Department"
                            />
                        )}
                    />
                    <label><b>Member Type</b></label>
                    <RadioGroup row aria-label="position" name="type" id="editMemberType" defaultValue = {props.staffMember.memberType+""}>
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
                        defaultValue = {props.staffMember.extraInfo}
                        onChange={(event) => {setExtraInfo(event.target.value)}}
                        fullWidth
                        helperText="Enter the Extra info separated by comma"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button 
                    onClick={handleUpdate} 
                    color="primary">
                        Update
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}