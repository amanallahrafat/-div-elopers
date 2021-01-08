import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DateRangeIcon from '@material-ui/icons/DateRange';
import axios from "axios";
import { Component } from "react";
import { Redirect } from 'react-router-dom';
import setAuthToken from "../../../actions/setAuthToken";
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import CallReceivedIcon from '@material-ui/icons/CallReceived';

const requestUserProfile = async () => {
    const userProfile = await axios.get('/viewProfile');
    return userProfile.data;
}

const requestAttendanceRecods = async () => {
    const attendanceRecords = await axios.get('/viewAttendance');
    return attendanceRecords.data;
}

const styles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        //   width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        //   width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        //   marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    accordionStyle: {
        width: "100%"
    }
}));

class Academic_Member_List extends Component {
    state = {
        isLoggedIn: 0,
        componentInMain: <div />
    }

    handlePersonalSchedule = async (event) => {
        this.props.setComponentInMain("personalSchedule")
    }

    handleAllCourseSchedule = async (event) => {
        this.props.setComponentInMain("allCourseSchedule")
    }

    handleChangeDayOffRequest = async (event) => {
        this.props.setComponentInMain("ac_changeDayOffRequest");
    }
    
    handleAnnualLeaveRequest = async(event)=>{
        this.props.setComponentInMain("ac_annualLeaveRequest");
    }

    handleAccidentalLeaveRequest = async(event)=>{
        this.props.setComponentInMain("ac_accidentalLeaveRequest");
    }

    handleMaternityLeaveRequest = async(event)=>{
        this.props.setComponentInMain("ac_maternityLeaveRequest");
    }

    handleSickLeaveRequest = async(event)=>{
        this.props.setComponentInMain("ac_sickLeaveRequest");
    }

    handleCompensationLeaveRequest=async(event)=>{
        console.log("2na hnaa?")
        this.props.setComponentInMain("ac_compensationLeaveRequest");
    }

    async componentDidMount() {
        if (!localStorage.getItem('auth-token')) {
            this.setState({ isLoggedIn: 1 });
            return;
        }
        try {
            setAuthToken(localStorage.getItem('auth-token'));
            await axios.get('/authStaffMember');
            this.setState({ isLoggedIn: 2 });
        }
        catch (err) {
            this.setState({ isLoggedIn: 1 });
        }
    }

    render() {
        const { classes } = this.props;

        if (this.state.isLoggedIn === 0)
            return <div />;
        if (this.state.isLoggedIn === 1) {
            return <Redirect to='/' />;
        }
        return (
            <div >
                <List>
                    <ListItem button onClick={this.handlePersonalSchedule}>
                        <ListItemIcon><PermContactCalendarIcon /></ListItemIcon>
                        <ListItemText primary="Personal Schedule"  />
                    </ListItem>
                    <ListItem button onClick={this.handleAllCourseSchedule}>
                        <ListItemIcon><DateRangeIcon /></ListItemIcon>
                        <ListItemText primary="All Course Schedules"  />
                    </ListItem>
                </List>
                <Accordion className={classes.accordionStyle}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <ListItemIcon ><CallReceivedIcon /></ListItemIcon>
                        <ListItemText style={{ textAlign: "left" }}
                            className={classes.menuButton}
                            primary={"Academic Requests"} />
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            <ListItem button onClick={this.handleChangeDayOffRequest}>
                                <ListItemText primary={"Change day off"}  />
                            </ListItem>
                            <ListItem button onClick={this.handleAnnualLeaveRequest} >
                                <ListItemText primary={"Annual leaves"} />
                            </ListItem>
                            <ListItem button onClick={this.handleAccidentalLeaveRequest} >
                                <ListItemText primary={"Accidental leaves" } />
                            </ListItem>
                            <ListItem button onClick={this.handleSickLeaveRequest} >
                                <ListItemText primary={"Sick leaves"} />
                            </ListItem>
                            <ListItem button onClick={this.handleMaternityLeaveRequest}>
                                <ListItemText primary={"Maternity leaves"} />
                            </ListItem>
                            <ListItem button  onClick={this.handleCompensationLeaveRequest}>
                                <ListItemText primary={"Compensation leaves"}  />
                            </ListItem>
                        </List>
                    </AccordionDetails>
                </Accordion>
            </div>
        )
    }
}

export default withStyles(styles)(Academic_Member_List);