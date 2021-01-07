import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CopyRight from './Material_UI_Copyright.js';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CircularProgress from "@material-ui/core/CircularProgress";
import { Redirect } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [oldPassword , setOldPassword] = React.useState(null);
  const [newPassword , setNewPassword] = React.useState(null);
  const [newPasswordConfirm , setNewPasswordConfirm] = React.useState(null);
  const [passFlag , setPassFlag] = React.useState(false);
  const [msg , setMsg] = React.useState();
  const [clicked , setClicked] = React.useState(false);
  const [shouldLogin , setShouldLogin] = React.useState(false);

  const handleSubmit = async (event) =>{
        event.preventDefault();
        setClicked(true);
        setPassFlag(true);
        setMsg((newPassword.localeCompare(newPasswordConfirm)) == 0 ? true : false);
        try{
            const res = await axios.post('/resetPassword',{
                oldPassword : oldPassword,
                newPassword : newPassword
            });
            setShouldLogin(true);
        }
        catch(err){
            console.log(err.response.data);
        }
        setClicked(false);
  }

  if (shouldLogin) {
    if (localStorage.getItem("type") == 1) {
        return <Redirect to='/hr' />;
    } else {
        switch (localStorage.getItem("academicMemberType")) {
            case 0: return <Redirect to='/hod' />;
            case 1: return <Redirect to='/ci' />;
            case 2: return <Redirect to='/cc' />;
            case 3: return <Redirect to='/ac' />;
            default: ;
        }
    }
    }
    return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="oldPassword"
            label="Old Password"
            name="oldPassword"
            type ="password"
            autoFocus
            onChange = {(event) => {setOldPassword(event.target.value)}}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="New password"
            label="New Password"
            type="password"
            id="newPassword"
            autoFocus
            onChange = {(event) => {setNewPassword(event.target.value)}}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Confirm New password"
            label="Confirm New Password"
            type="password"
            id="newPasswordConfirm"
            autoFocus
            onChange = {(event) => {setNewPasswordConfirm(event.target.value)}}
          />
          {
              
          }
          <Collapse in={passFlag}>
                <Alert
                severity={msg ?"success" : "error"}
                id="passwordError"
                className={classes.alert}
                > {msg ? "Password Confirmed" : "Passwords don't Match"}</Alert>
            </Collapse>
            { (clicked) ?
            (
                <CircularProgress
                style={{
                  marginTop: "6px",
                  marginRight: "240px",
                  display: "block",
                  margin: "0 auto"
                }}
              />
            ) :
          <Button
            disabled = {oldPassword == null || newPassword == null || newPasswordConfirm == null}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick = {handleSubmit}
            className={classes.submit}
          >
            SUBMIT
          </Button>
        }
        </form>
      </div>
      <Box mt={8}>
        <CopyRight />
      </Box>
    </Container>
  );
}
