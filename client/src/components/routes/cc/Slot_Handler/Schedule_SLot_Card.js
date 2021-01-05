import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import { Box, Collapse, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import EditSlotForm from './Edit_Slot_Form';
import axios from 'axios';

const useStyles = makeStyles({
    root: {
        width : 160
    },
    bullet: {
        display: 'inline-block',
        // margin: '0 1px',
        // transform: 'scale(0.8)',
    },
    title: {
    },
    pos: {
    },
    pendingCard: {
        backgroundColor: "#ffffcc",
    },
    acceptedCard: {
        backgroundColor: "#ccffcc",
    },
    rejectedCard: {
        backgroundColor: "#ffcccc",
    }
});

const getInstructorName = (academicMembers,ID) =>{
    const member = academicMembers.filter(elm => elm.ID == ID);
    return member.length > 0 ? member[0].name : "";
}

export default function SimpleCard(props) {
    const classes = useStyles();
    const [openUpdateSlot, setOpenUpdateSlot] = React.useState(false);    
    const [updatedSlot, setUpdatedSlot] = React.useState({});

    const handleOpenEdit = (event) => {
        setOpenUpdateSlot(true);
    }
    const handleCloseEdit = () => {
        setOpenUpdateSlot(false);
    }
    const handleDeleteSlot = async (event) => {
        const slotID = event.currentTarget.id.split('_')[1];
        const res = await axios.delete(`/cc/deleteSlot/${props.courseID}/${slotID}`);
        props.handleSlots({slotID : slotID},2);
        props.setComponentInMain("slot");
    }
    const handleUpdateSlot = async (event) => {
        const slotID = event.currentTarget.id.split('_')[1];
        setUpdatedSlot(props.slot);
        setOpenUpdateSlot(true);
    }

    return (
        <div>
                <Card className={classes.root}>
                    <CardContent style={{margin : "0px",padding : "7px"}} >
                        <Box display="flex" flexDirection="row" style={{margin : "0px",padding : "0px"}}>
                            <Box style={{margin : "0px",padding : "0px"}}>
                                <Typography className={classes.pos} >
                                    <b>{props.slot.courseName}</b>
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    {props.locations.filter(elm => elm.ID == props.slot.locationID)[0].name}
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    {getInstructorName(props.academicMembers,props.slot.instructor)}
                                </Typography>
                            </Box>
                            <Box style={{margin : "0px",padding : "0px"}} >
                                    <CardActions style={{margin : "0px",padding : "0px"}}>
                                        <Tooltip title="Update Slot">
                                            <Button
                                            id = {"UPDATE_" + props.slot.ID}
                                            style={{margin : "0px",padding : "0px" , minWidth : "40px"}} 
                                            size="small" color="primary"
                                            onClick={handleUpdateSlot}><EditIcon />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Delete Slot">
                                            <Button 
                                            id = {"DELETE_" + props.slot.ID}
                                            style={{margin : "0px",padding : "0px", minWidth : "40px"}} 
                                            size="small" color="primary" 
                                            onClick={handleDeleteSlot}><DeleteIcon />
                                            </Button>
                                        </Tooltip>
                                    </CardActions>
                            </Box>
                        </Box>
                    </CardContent>
                    <EditSlotForm
                        open={openUpdateSlot}
                        slot = {updatedSlot}
                        handleOpen = {handleOpenEdit}
                        handleClose={handleCloseEdit}
                        locations = {props.locations}
                        handleSlots = {props.handleSlots}
                        setComponentInMain={props.setComponentInMain}
                    />
                </Card>
        </div>
    );
}
