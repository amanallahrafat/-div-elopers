import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React, { useEffect } from 'react';
//Test
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';


const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: '100%',
  },
  formControl: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const getCurDay = (date) => { // date entered as normal date not miliseconds
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
}
export default function MaxWidthDialog(props) {
  const classes = useStyles();
  const [academicMembers, setAcademicMembers] = React.useState([]);
  const [selectedMem, setSelectedMem] = React.useState(null);
  const [selectedDate, handleDateChange] = React.useState(new Date());

  useEffect(async () => {
    if (academicMembers.length == 0) {
      setAcademicMembers(
        (await axios.post('ac/viewCourseMembers', { courseID: props.courseID })).data
      );
    }
  });

  function disableNonSlotDays(date) {
    return getCurDay(date) != props.slotDay || date.getTime() < new Date(Date.now());
  }
  const handleClickOpen = () => {
    // setOpen(true);
  };

  const handleClose = () => {
    props.onClose();
  };

  const handleSubmit = async (event) => {
    try{
      await axios.post('ac/sendReplacementRequest',{replacementID : selectedMem, courseID : props.courseID,
        slotID : props.slotID, requestedDate : selectedDate.getTime()});
    }catch(err){
      alert(err.response.data);
      console.log(err.response.data);
    }
    
    handleClose();

   
  }

  const handleMaxWidthChange = (event) => {
    // setMaxWidth(event.target.value);
  };

  const handleFullWidthChange = (event) => {
    // setFullWidth(event.target.checked);
  };
  console.log(props.slotDay)
  return (
    <React.Fragment>
      <Dialog
        // fullWidth={fullWidth}
        // maxWidth={maxWidth}
        open={props.open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Replacement Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Academic members available for replacement
          </DialogContentText>
          <form className={classes.form} noValidate>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="max-width">Academic Members</InputLabel>
              <Select
                autoFocus
                // value={maxWidth}
                inputProps={{
                  name: 'max-width',
                  id: 'max-width',
                }}
                onChange={(event) => { setSelectedMem(event.target.value) }}
              >
                {
                  academicMembers.map((ac) =>
                    <MenuItem value={ac.ID}> {ac.name}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
          </form>
          {/* <form className={classes.container} noValidate>
            <TextField
              id="date"
              label="Birthday"
              type="date"
              // defaultValue="2017-05-24"
              shouldDisableDate={false}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form> */}
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker 
            value={selectedDate} 
            shouldDisableDate = {disableNonSlotDays}  
            onChange={handleDateChange} />

          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
