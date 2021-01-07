import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router-dom';
import setAuthToken from "../actions/setAuthToken.js";

export default function SimpleMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isLoggedOut, setIsLoggedOut] = React.useState(false);
    const [resetPasswordFlag , setResetPasswordFlag] = React.useState(false);

   
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleResetPassword = (event) =>{
        // props.fromParent("resetPassword");
        setResetPasswordFlag(true);
        setAnchorEl(null);
    }

    const handleClose = async (event) => {
        let res;
        try {
            switch (event.target.id) {
                case "signIn": {
                    res = await axios.post('/signIn');
                    break;
                }
                case "signOut": {
                    res = await axios.post('/signOut');
                    break;
                }
                case "logout": {
                    res = await axios.post('/logout');
                    setIsLoggedOut(true);
                    localStorage.removeItem('auth-token');
                    setAuthToken();
                    break;
                }
            }
        }
        catch (err) {
            alert(err.response.data);
        }
        setAnchorEl(null);
    };
    if (isLoggedOut) {
        return <Redirect to='/' />;
    }
    if(resetPasswordFlag){
        return <Redirect to='/resetPassword' />;
    }

    
    return (
        <div>
            <div>
                <IconButton
                    aria-label="account of current user"
                    aria-haspopup="true"
                    color="inherit"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem id="resetPassword" onClick={handleResetPassword}>Reset Password</MenuItem>
                    <MenuItem id="signIn" onClick={handleClose}>Sign in</MenuItem>
                    <MenuItem id="signOut" onClick={handleClose}>Sign out</MenuItem>
                    <MenuItem id="logout" onClick={handleClose}>Logout</MenuItem>
                </Menu>
            </div>
        </div>
    );
}
