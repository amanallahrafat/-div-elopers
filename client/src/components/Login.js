import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert';
import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { login } from '../actions/authAction.js';
import Copyright from './Material_UI_Copyright.js';
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = (theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://www.guc.edu.eg//img/content/about_guc/48.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class Login extends Component {
    state = {
        email: "",
        password: "",
        showPassword: false,
        res: "",
        isLoggedIn: false,
        loginError: false,
        emptyEmail: true,
        emptyPassword: true,
        isDirtyEmail: false,
        isDirtyPassword: false,
        clicked : false
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        await this.setState({ clicked: true });
        console.log(this.state.clicked)
        const req = {
            email: this.state.email,
            password: this.state.password,
        }
        try {
            const res = await login(req);
            this.setState({
                res: res,
                loginError: false,
                isLoggedIn: true,
            });
        } catch (error) {
            this.setState({ loginError: true })
        }
        this.setState({clicked : false});
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value,
        });
        if (event.target.id === "email") {
            if (event.target.value === "")
                this.setState({ emptyEmail: true });
            else
                this.setState({ emptyEmail: false });
        }
        if (event.target.id === "password") {
            if (event.target.value === "")
                this.setState({ emptyPassword: true });
            else
                this.setState({ emptyPassword: false });
        }
    };

    handleFocus = event => {
        if (event.target.id === "email") {
            if (event.target.value === "")
                this.setState({ emptyEmail: true, isDirtyEmail: true });
            else
                this.setState({ emptyEmail: false, isDirtyEmail: true });
        }
        if (event.target.id === "password") {
            if (event.target.value === "")
                this.setState({ emptyPassword: true, isDirtyPassword: true });
            else
                this
                    .setState({ emptyPassword: false, isDirtyPassword: true });
        }
    }

    render() {
        const { classes } = this.props;
        if(this.state.res.firstLogin){
            return <Redirect to={{pathname:"/resetPassword",state :{firstLogin : this.state.res.firstLogin}}} />
        }
        if (this.state.isLoggedIn ) {
            if (this.state.res.type === 1) {
                return <Redirect to='/hr' />;
            } else {
                switch (this.state.res.academicMemberType) {
                    case 0: return <Redirect to='/hod' />;
                    case 1: return <Redirect to='/ci' />;
                    case 2: return <Redirect to='/cc' />;
                    case 3: return <Redirect to='/ac' />;
                    default: ;
                }
            }
        }
        return (
            <Grid container component="main" className={classes.root} >
                <CssBaseline />
                <Grid item xs={false} sm={4} md={7} className={classes.image} />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Login
                        </Typography>
                        <form className={classes.form} noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                onChange={this.handleChange}
                                onBlur={this.handleFocus}
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                            <Collapse in={this.state.emptyEmail && this.state.isDirtyEmail}>
                                <Alert
                                    severity="error"
                                    id="emptyEmailError"
                                    className={classes.alert}
                                >
                                    This field is required!
                            </Alert>
                            </Collapse>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                onChange={this.handleChange}
                                onBlur={this.handleFocus}
                                autoComplete="current-password"
                            />
                            <Collapse in={this.state.emptyPassword && this.state.isDirtyPassword}>
                                <Alert
                                    severity="error"
                                    id="emptyPasswordError"
                                    className={classes.alert}
                                >
                                    This field is required!
                            </Alert>
                            </Collapse>
                            {!this.state.clicked ?(
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={this.handleSubmit}
                                disabled={
                                    this.state.emptyPassword ||
                                    this.state.emptyEmail
                                }

                            >
                                Login
                            </Button>) :(
                                <CircularProgress
                                style={{
                                  marginTop: "6px",
                                  marginRight: "240px",
                                  display: "block",
                                  margin: "0 auto"
                                }}
                              />
                            )

            }
                            <Collapse in={this.state.loginError}>
                                <Alert
                                    severity="error"
                                    id="error"
                                    className={classes.alert}
                                >
                                    Wrong Email or Password
                            </Alert>
                            </Collapse>



                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Box mt={5}>
                                <Copyright />
                            </Box>
                        </form>
                    </div>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Login);