import React from 'react';
import { BrowserRouter, Router, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import ResetPassword from './components/ResetPasswordForm.js';
import HOD from "./components/routes/hod/hod.js";
import HR from './components/routes/hr/hr.js';
import CI from "./components/routes/ci/ci.js";
import CC from "./components/routes/cc/cc.js";
import AC from "./components/routes/ac/ac.js";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
//Test pickers
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

let firstRender = true;

function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  console.log(firstRender, open)

  setTimeout(() => {
    handleClose();
  }, 5_000)


  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <BrowserRouter>
          <div className="App">
            <Route exact path="/resetPassword" component={ResetPassword} />
            <Route exact path="/" component={Login} />
            <Route exact path="/hod" component={HOD} />
            <Route exact path="/hr" component={HR} />
            <Route exact path="/ci" component={CI} />
            <Route exact path="/cc" component={CC} />
            <Route exact path="/ac" component={AC} />
            {/* <Button variant="outlined" color="primary" onClick={handleToggle}>
              Show backdrop
            </Button> */}
            <Backdrop className={classes.backdrop} open={open} >
              <CircularProgress color="inherit" />
            </Backdrop>
          </div>
        </BrowserRouter>
      </MuiPickersUtilsProvider>

    </div>
  );
}

export default App;
