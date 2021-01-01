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
import React from 'react';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import SchoolIcon from '@material-ui/icons/School';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

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

    const handleLocation = () => {
        props.setComponentInMain("location");
    }

    const handleFaculties = () => {
        props.setComponentInMain("faculty");
    }

    const handleDepartments= () => {
        props.setComponentInMain("department");
    }

    const handleCourses= () => {
        props.setComponentInMain("course");
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
                    <ListItem button>
                        <ListItemIcon><AddLocationIcon /></ListItemIcon>
                        <ListItemText primary="Locations" onClick={handleLocation} />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><SchoolIcon /></ListItemIcon>
                        <ListItemText primary="Faculties" onClick={handleFaculties} />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><LocalLibraryIcon /></ListItemIcon>
                        <ListItemText primary="Departments" onClick={handleDepartments} />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><MenuBookIcon /></ListItemIcon>
                        <ListItemText primary="Courses" onClick={handleCourses} />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><PeopleAltIcon /></ListItemIcon>
                        <ListItemText primary="Staff Memebers" />
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}
