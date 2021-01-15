import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NotificationsIcon from '@material-ui/icons/Notifications';
import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

let isPeriodicCalled = false;
export default function SimpleMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isLoggedOut, setIsLoggedOut] = React.useState(false);
    const [notifications, setNotifications] = React.useState([]);

    const handleClick = async (event) => {
        setAnchorEl(event.currentTarget);
        const res = await axios.get('ac/getAllNotifications');
        setNotifications(res.data.sort((a, b) => b.date > a.date));
    };


        const periodic = (() => {
            if(!isPeriodicCalled){
                isPeriodicCalled = true;
                setInterval(async () => {
                    if(parseInt(localStorage.getItem("type")) != 0) return;
                    console.log(localStorage.getItem("type"));
                    let res = await axios.get('ac/getAllNotifications');
                    res = res.data.sort((a, b) => b.date > a.date);
                    const resJSON = JSON.stringify(res);
                    if (resJSON != JSON.stringify(notifications))
                        setNotifications(res);
    
                }, 10000)
            }
        })();
          

    const handleClose = async (event) => {
        setAnchorEl(null);
    };

    if (isLoggedOut) {
        return <Redirect to='/' />;
    }
    return (
        <div>
            <IconButton
                onClick={handleClick}
                aria-label="show 17 new notifications" color="inherit">
                <Badge badgeContent={0} color="secondary">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {
                    notifications.map((mem) => {
                        return (
                            <div>
                                <MenuItem>
                                    <Grid container direction="column">
                                    <Grid item>
                                    <p>
                                        <b>{mem.senderName + " : "}
                                        </b>
                                    </p>
                                    <p>{mem.msg}</p>
                                  
                                    </Grid>
                                    <Grid item>
                                    <p>{(new Date(mem.date)).toLocaleDateString("en-US")}</p>
                                  
                                    </Grid>
                                    </Grid>
                                    
                                </MenuItem>
                            </div>);
                    })
                }
            </Menu>
        </div>
    );
}
