import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

// props => open , type =>{error,warning,info,success} , msg
export default function AlertMessage(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(props.open);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event) => {
    props.onClose();
    setOpen(false);
  };

  console.log("here2");
  console.log(open,props.msg,props.type);
  return (
    <div className={classes.root}>
      <Snackbar open={props.open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={props.type}>{props.msg}</Alert>
      </Snackbar>
      {/* <Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert> */}
    </div>
  );
}
