import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MailIcon from '@material-ui/icons/Mail';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import LocalHotelIcon from '@material-ui/icons/LocalHotel';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import MenuBookIcon from '@material-ui/icons/MenuBook';

import Academic_Member_List from '../routes/ac/ac_List.js'
import React from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';




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

  const handleChangeDayOff=async ()=>{
    console.log("cliked on change day off")
    await (props.updateRequests());
    props.setComponentInMain("changeDayOffRequest");
  }

  const handleAnnualLeaveRequest=async ()=>{
    console.log("cliked on annual leave request")
    await (props.updateRequests());
    props.setComponentInMain("annualLeaveRequest");
  }

  const handleAccidentalLeaveRequest=async ()=>{
    console.log("cliked on accidental leave request")
    await (props.updateRequests());
    props.setComponentInMain("accidentalLeaveRequest");
  }

  const handleSickLeaveRequest=async ()=>{
    console.log("cliked on Sick leave request")
    await (props.updateRequests());
    props.setComponentInMain("sickLeaveRequest");
  }
  
  const handleMaternityLeaveRequest=async ()=>{
    console.log("cliked on maternity leave request")
    await (props.updateRequests());
    props.setComponentInMain("maternityLeaveRequest");
  }

  const handleCompensationLeaveRequest=async ()=>{
    console.log("cliked on Compensation leave request")
    await (props.updateRequests());
    props.setComponentInMain("compensationLeaveRequest");
  }

  const handleDepartmentCourses=async ()=>{
    console.log("cliked on handle department courses")
    await (props.requestAllDepartmentCourses());
    props.setComponentInMain("departmentCourses");
    console.log("passed set comp in main")
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
        <Divider />
        <List>
          <ListItem button key="Manage Course Instructors">
            <ListItemIcon> <AssignmentIndIcon /></ListItemIcon>
            <ListItemText primary={"Manage Course Instructors"} onClick={handleCourseInsructor} />
          </ListItem>
          <ListItem button key="View Staff Profiles">
            <ListItemIcon> <SupervisorAccountIcon /></ListItemIcon>
            <ListItemText primary={"View Staff Profiles"} onClick={handleViewStaffProfiles} />
          </ListItem>
          <ListItem button key="Department courses">
            <ListItemIcon> <MenuBookIcon /></ListItemIcon>
            <ListItemText primary={"Department courses"} onClick={handleDepartmentCourses} />
          </ListItem>
        </List>
        <Accordion className={classes.accordionStyle}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
             <ListItemIcon ><CallReceivedIcon/></ListItemIcon>
             <ListItemText style = {{textAlign:"left"}}className={classes.menuButton} primary={"Requests"} />
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem button key="test1">
                <ListItemText primary={"Change day off"} onClick={handleChangeDayOff} />
              </ListItem>
              <ListItem button key="test 2">
                <ListItemText primary={"Annual leaves"} onClick={handleAnnualLeaveRequest} />
              </ListItem>
              <ListItem button key="test 2">
                <ListItemText primary={"Accidental leaves"} onClick={handleAccidentalLeaveRequest} />
              </ListItem>
              <ListItem button key="test 2">
                <ListItemText primary={"Sick leaves"} onClick={handleSickLeaveRequest} />
              </ListItem>
              <ListItem button key="test 2">
                <ListItemText primary={"Maternity leaves"} onClick={handleMaternityLeaveRequest}/>
              </ListItem>
              <ListItem button key="test 2">
                <ListItemText primary={"Compensation leaves"} onClick={handleCompensationLeaveRequest}/>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        <Academic_Member_List setComponentInMain={props.setComponentInMain}/>
      </Drawer>
    </div>
  );
}
