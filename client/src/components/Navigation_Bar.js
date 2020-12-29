import { Collapse } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import TodayIcon from '@material-ui/icons/Today';
import React, { Component } from 'react';
import DropdownList_NavBar from './DropdownList_NavBar';
import DropdownList_Notifications from './DropdownList_Notifications';


const styles = (theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        // backgroundColor: theme.palette.background.paper,
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
    };

    handleViewProfile = (event) => {
        this.setState({ viewProfile: true });
    };
    render() {
        const { classes } = this.props;
        console.log(localStorage.getItem('type'));
        return (
            <div className={classes.grow}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            aria-label="account of current user"
                            //   aria-controls={menuId}
                            aria-haspopup="true"
                            //   onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography className={classes.title} variant="h6" noWrap>
                            GUC PORTAL
                  </Typography>
                        <div className={classes.grow} />
                        <div className={classes.sectionDesktop}>
                            <IconButton aria-label="show 4 new mails" color="inherit">
                                <Badge badgeContent={0} color="secondary">
                                    <TodayIcon />
                                </Badge>
                            </IconButton>
                            <Collapse in = {localStorage.getItem('type') == 0}>
                                <DropdownList_Notifications/>
                            </Collapse>
                            <IconButton
                                // edge="end"
                                aria-label="account of current user"
                                //   aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={this.handleViewProfile}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <DropdownList_NavBar />
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}
export default withStyles(styles)(Navigation_Bar);