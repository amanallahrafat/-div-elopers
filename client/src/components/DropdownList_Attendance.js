import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import FilterListIcon from '@material-ui/icons/FilterList';

export default function DropdownList_Attendance(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose =  (event) => {
        setAnchorEl(null);
        props.handleFilter(event.target.id);
        return event.currentTarget.id;
    };

    
    return (
        <div>
            <IconButton
                aria-label="account of current user"
                aria-haspopup="true"
                color="inherit"
                onClick={handleClick}
            >
             <FilterListIcon />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem id="all" onClick={handleClose}>None</MenuItem>
          
                <MenuItem id="1" onClick={handleClose}>January</MenuItem>
                <MenuItem id="2" onClick={handleClose}>February</MenuItem>
                <MenuItem id="3" onClick={handleClose}>March</MenuItem>
                <MenuItem id="4" onClick={handleClose}>April</MenuItem>
                <MenuItem id="5" onClick={handleClose}>May</MenuItem>
                <MenuItem id="6" onClick={handleClose}>June</MenuItem>
                <MenuItem id="7" onClick={handleClose}>July</MenuItem>
                <MenuItem id="8" onClick={handleClose}>August</MenuItem>
                <MenuItem id="9" onClick={handleClose}>September</MenuItem>
                <MenuItem id="10" onClick={handleClose}>October</MenuItem>
                <MenuItem id="11" onClick={handleClose}>November</MenuItem>
                <MenuItem id="12" onClick={handleClose}>December</MenuItem>
            </Menu>
        </div>
    );
}
