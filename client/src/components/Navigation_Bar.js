import { Collapse } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from '@material-ui/icons/Menu';
import TodayIcon from '@material-ui/icons/Today';
import clsx from 'clsx';
import React, { Component } from 'react';
import DropdownList_NavBar from './DropdownList_NavBar';
import DropdownList_Notifications from './DropdownList_Notifications';
import Hod_SlideBar from './slideBars/Hod_SlideBar';
import HR_SlideBar from './slideBars/HR_SlideBar';
import CC_SlideBar from './slideBars/CC_SlideBar';

const drawerWidth = 240;

const styles = (theme) => ({
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
    nested: {
        paddingLeft: theme.spacing(4),
    },
    grow: {
        flexGrow: 1,
    },
    IconButton: {
        marginRight: theme.spacing(4),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    inputRoot: {
        color: 'inherit',
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
});

class Navigation_Bar extends Component {
    state = {
        viewProfile: false,
        isSlideBarOpen: false,
    };

    handleViewProfile = (event) => {
        this.setState({ viewProfile: true });
        this.props.fromParent("profile");
    };

    handleViewAttendance = (event) => {
        this.props.fromParent("attendance");
    }

    handleSlideBarToggle = async (event) => {
        await this.setState({ isSlideBarOpen: !this.state.isSlideBarOpen });
        this.props.handleAppBarShift(this.state.isSlideBarOpen);
    }

    componentDidMount() {
        this.handleViewProfile();
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.grow}>
                <AppBar position="static" className={clsx(classes.appBar, {
                    [classes.appBarShift]: this.state.isSlideBarOpen,
                })}>
                    <Toolbar >
                        <IconButton
                            aria-label="account of current user"
                            aria-haspopup="true"
                            onClick={this.handleSlideBarToggle}
                            color="inherit"
                        >
                            {this.state.isSlideBarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                        </IconButton>
                        <Typography className={classes.title} variant="h6" noWrap>
                            GUC PORTAL
                  </Typography>
                        <div className={classes.grow} />
                        <div className={classes.sectionDesktop}>
                            <IconButton aria-label="show 4 new mails" color="inherit" onClick={this.handleViewAttendance}>
                                <Badge badgeContent={0} color="secondary">
                                    <TodayIcon />
                                </Badge>
                            </IconButton>
                            <Collapse in={localStorage.getItem('type') == 0}>
                                <DropdownList_Notifications />
                            </Collapse>

                            <IconButton
                                aria-label="account of current user"
                                aria-haspopup="true"
                                id="profile"
                                onClick={this.handleViewProfile}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <DropdownList_NavBar />
                        </div>
                    </Toolbar>
                    {
                        (localStorage.getItem('type') == 1 ) ?
                            <HR_SlideBar
                                open={this.state.isSlideBarOpen}
                                setComponentInMain={this.props.fromParent} /> :
                            (localStorage.getItem("academicMemberType") == 0) ?
                            <Hod_SlideBar
                                open={this.state.isSlideBarOpen}
                                updateRequestStaffProfile={this.props.updateRequestStaffProfile}
                                updateRequests={this.props.updateRequests}
                                setComponentInMain={this.props.fromParent} 
                                requestAllDepartmentCourses={this.props.requestAllDepartmentCourses}/>:
                            (localStorage.getItem("academicMemberType") == 1) ? 
                            <Hod_SlideBar
                                open={this.state.isSlideBarOpen}
                                updateRequestStaffProfile={this.props.updateRequestStaffProfile}
                                updateRequests={this.props.updateRequests}
                                setComponentInMain={this.props.fromParent} 
                                requestAllDepartmentCourses={this.props.requestAllDepartmentCourses}/>:
                            (localStorage.getItem("academicMemberType") == 2) ?
                            <CC_SlideBar
                            open={this.state.isSlideBarOpen}
                            setComponentInMain={this.props.fromParent}/> :
                            <Hod_SlideBar
                            open={this.state.isSlideBarOpen}
                            updateRequestStaffProfile={this.props.updateRequestStaffProfile}
                            updateRequests={this.props.updateRequests}
                            setComponentInMain={this.props.fromParent} 
                            requestAllDepartmentCourses={this.props.requestAllDepartmentCourses}/>
                    }
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(Navigation_Bar);