import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import React from 'react';
import Academic_Member_List from '../routes/ac/ac_List.js';
import Course_Instructor_List from '../routes/ci/CI_List.js';
import {useHistory} from 'react-router-dom'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';





const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
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
    marginLeft: -drawerWidth,
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

export default function PersistentDrawerLeft(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCourseInsructor = () => {
    props.setComponentInMain("manageCourseInstructors");
  }

  const handleViewStaffProfiles = () => {
    console.log("clicked on view staff profile")
    props.updateRequestStaffProfile();
    props.setComponentInMain("viewStaffProfiles");
  }

  const handleChangeDayOff = async () => {
    console.log("cliked on change day off")
    await (props.updateRequests());
    props.setComponentInMain("changeDayOffRequest");
  }

  const handleAnnualLeaveRequest = async () => {
    console.log("cliked on annual leave request")
    await (props.updateRequests());
    props.setComponentInMain("annualLeaveRequest");
  }

  const handleAccidentalLeaveRequest = async () => {
    console.log("cliked on accidental leave request")
    await (props.updateRequests());
    props.setComponentInMain("accidentalLeaveRequest");
  }

  const handleSickLeaveRequest = async () => {
    console.log("cliked on Sick leave request")
    await (props.updateRequests());
    props.setComponentInMain("sickLeaveRequest");
  }

  const handleMaternityLeaveRequest = async () => {
    console.log("cliked on maternity leave request")
    await (props.updateRequests());
    props.setComponentInMain("maternityLeaveRequest");
  }

  const handleCompensationLeaveRequest = async () => {
    console.log("cliked on Compensation leave request")
    await (props.updateRequests());
    props.setComponentInMain("compensationLeaveRequest");
  }

  const handleDepartmentCourses = async () => {
    console.log("cliked on handle department courses")
   // await (props.requestAllDepartmentCourses());
    props.setComponentInMain("departmentCourses");
    console.log("passed set comp in main")
  }
  const history = useHistory();
  const handleCIFunctionalities=()=>{
    let path='/ci';
    history.push(path);
  }
  return (
    <div className={classes.root}>
      <CssBaseline />

      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={props.open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
        </div>
       <List>
        <ListItem button key="Course Instructor Functionalities" color="primary" onClick={handleCIFunctionalities}>
            <ListItemIcon> <SwapHorizIcon /></ListItemIcon>
            <ListItemText primary={"Course Instructor Functionalities"} />
          </ListItem>
          </List>
        <Divider />
        <List>
          <ListItem button key="Manage Course Instructors" onClick={handleCourseInsructor}>
            <ListItemIcon> <AssignmentIndIcon /></ListItemIcon>
            <ListItemText primary={"Manage Course Instructors"} />
          </ListItem>
          <ListItem button key="View Staff Profiles" onClick={handleViewStaffProfiles}>
            <ListItemIcon> <SupervisorAccountIcon /></ListItemIcon>
            <ListItemText primary={"View Staff Profiles"} />
          </ListItem>
          <ListItem button key="Department courses" onClick={handleDepartmentCourses}>
            <ListItemIcon> <MenuBookIcon /></ListItemIcon>
            <ListItemText primary={"Department courses"} />
          </ListItem>
        </List>
        <Accordion className={classes.accordionStyle}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <ListItemIcon ><CallReceivedIcon /></ListItemIcon>
            <ListItemText style={{ textAlign: "left" }} className={classes.menuButton} primary={"Requests"} />
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem button key="test1" onClick={handleChangeDayOff}>
                <ListItemText primary={"Change day off"} />
              </ListItem>
              <ListItem button key="test 2" onClick={handleAnnualLeaveRequest}>
                <ListItemText primary={"Annual leaves"} />
              </ListItem>
              <ListItem button key="test 3" onClick={handleAccidentalLeaveRequest}>
                <ListItemText primary={"Accidental leaves"} />
              </ListItem>
              <ListItem button key="test 4" onClick={handleSickLeaveRequest}>
                <ListItemText primary={"Sick leaves"} />
              </ListItem>
              <ListItem button key="test 5" onClick={handleMaternityLeaveRequest}>
                <ListItemText primary={"Maternity leaves"} />
              </ListItem>
              <ListItem button key="test 6" onClick={handleCompensationLeaveRequest}>
                <ListItemText primary={"Compensation leaves"} />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        <Academic_Member_List setComponentInMain={props.setComponentInMain} />
      </Drawer>
    </div>
  );
}
