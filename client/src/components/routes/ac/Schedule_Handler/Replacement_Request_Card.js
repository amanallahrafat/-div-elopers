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
import axios from 'axios';
import React, { useEffect } from 'react';

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
}));

export default function MaxWidthDialog(props) {
  const classes = useStyles();
  const [academicMembers, setAcademicMembers] = React.useState([]);
  const [selectedMem, setSelectedMem] = React.useState(null);

  useEffect(async () => {
    if (academicMembers.length == 0) {
      setAcademicMembers(
        (await axios.post('ac/viewCourseMembers', { courseID: props.courseID })).data
      );
    }
  });

  const handleClickOpen = () => {
    // setOpen(true);
  };

  const handleClose = () => {
    props.onClose();
  };

  const handleSubmit = (event) => {
    // await axios.post('ac/sendReplacementRequest', )
  }

  const handleMaxWidthChange = (event) => {
    // setMaxWidth(event.target.value);
  };

  const handleFullWidthChange = (event) => {
    // setFullWidth(event.target.checked);
  };

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
