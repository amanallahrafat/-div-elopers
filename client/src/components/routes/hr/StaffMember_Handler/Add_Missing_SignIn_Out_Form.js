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
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  KeyboardTimePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';


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

   const [signIn , setSignIn] = React.useState({
       date : null,
       time : null
   });
   const [signOut , setSignOut] = React.useState({
       date : null,
       time : null
   });


    const handleClickOpen = () => {
        props.handleOpenUpdateSession();
    };

    const handleClose = () => {
        setSignIn({date : null, time : null});
        setSignOut({date : null, time : null});
        props.handleCloseUpdateSession();
    };

    const handleAdd = async () => {
        try {
            const req = {
                ID : props.staffMember.ID,
                type : props.staffMember.type,
                signinYear : signIn.date.getFullYear(),signinMonth : signIn.date.getMonth(),signinDay : signIn.date.getDate(),
                signinHour : signIn.time.getHours() ,signinMinute : signIn.time.getMinutes(),signinSec : signIn.time.getSeconds(),
                signoutYear : signOut.date.getFullYear(),signoutMonth : signOut.date.getMonth(),signoutDay : signOut.date.getDate(),
                signoutHour : signOut.time.getHours() ,signoutMinute : signOut.time.getMinutes(),signoutSec : signOut.time.getSeconds(),
            };
            const res = await axios.post("/hr/addMissingSignInOut", req);
            props.setComponentInMain("staffMember");
            handleClose();
        } catch (err) {
            alert(err.response.data);
        }
    }

    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"> Add Missing Session </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        disabled
                        margin="dense"
                        id="editName"
                        label="Name"
                        type="text"
                        variant="filled"
                        value = {props.staffMember.name}
                        style = {{marginBottom : "20px" , display : "block"}}
                    />
                    <label><b>Sign In Time</b></label>
                    <Grid container justify="space-around">
                    <MuiPickersUtilsProvider utils={DateFnsUtils} >
                        <KeyboardDatePicker
                            format="MM/dd/yyyy"
                            margin="normal"
                            style={{marginRight : "20px", marginTop : "0px",marginBottom:"20px"}}
                            id="datePicker"
                            label="Date picker"
                            value={signIn.date}
                            onChange={(date)=> setSignIn({...signIn,date : date })}
                            KeyboardButtonProps={{
                              'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                            margin="normal"
                            style={{marginRight : "20px", marginTop : "0px" ,marginBottom : "20px"}}
                            id="timePicker"
                            label="Time picker"
                            value={signIn.time}
                            onChange={(time)=> setSignIn({...signIn,time : time })}
                            KeyboardButtonProps={{
                              'aria-label': 'change time',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    </Grid>
                    <label><b>Sign Out Time</b></label>
                    <Grid container justify="space-around">
                    <MuiPickersUtilsProvider utils={DateFnsUtils} >
                        <KeyboardDatePicker
                            format="MM/dd/yyyy"
                            margin="normal"
                            style={{marginRight : "20px", marginTop : "0px" ,marginBottom : "20px"}}
                            id="datePicker"
                            label="Date picker"
                            value={signOut.date}
                            onChange={(date)=> setSignOut({...signOut,date : date })}
                            KeyboardButtonProps={{
                              'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                            margin="normal"
                            style={{marginRight : "20px", marginTop : "0px" ,marginBottom : "20px"}}
                            id="timePicker"
                            label="Time picker"
                            value={signOut.time}
                            onChange={(time)=> setSignOut({...signOut,time : time })}
                            KeyboardButtonProps={{
                              'aria-label': 'change time',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button 
                    disabled = {signIn.date == null || signIn.time == null  || signOut.date == null || signOut.time == null}
                    onClick={handleAdd} 
                    color="primary">
                        Update
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}