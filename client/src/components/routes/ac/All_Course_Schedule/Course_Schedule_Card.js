import { Box, Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import axios from 'axios';
import React from 'react';

const useStyles = makeStyles({
    root: {
    },
    bullet: {
        display: 'inline-block',
        margin: '0 1px',
        transform: 'scale(0.8)',
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
export default function SimpleCard(props) {
    const classes = useStyles();
    const handleSlotLinkingRequest = async () =>{
        try{
            await axios.post("ac/sendSlotLinkingRequest", {courseID : props.courseID, slotID: props.slotID})
            alert("Slot linking request submitted successfully.");

        }catch(err){
            console.log({courseID : props.courseID, slotID: props.slotID})
            console.log(err.response.data)
            alert(err.response.data)
        }
    }
    return (
        <div>
            <Card className={classes.root} className={
                props.instructorName == "Not yet assigned" ? classes.pendingCard : ""}>
                <CardContent>
                    <Box display="flex" flexDirection="row">
                        <Box width="70%">
                            <Typography className={classes.pos} >
                                <b>Instructor:&nbsp;</b>{props.instructorName}
                            </Typography>
                            {
                                props.instructorID ? (<Typography className={classes.pos} >
                                    <b>ID:&nbsp;</b>{props.instructorID}
                                </Typography>) : <div />
                            }
                            <Typography className={classes.pos} color="textSecondary">
                                <b>Location:</b> &nbsp;{props.locationName}
                            </Typography>
                        </Box>
                        <Box>
                            {
                                props.instructorName == "Not yet assigned" ? <CardActions>
                                    <Tooltip title="Send Slot Linking Request">
                                        <Button size="small" color="primary" onClick={handleSlotLinkingRequest}><CallReceivedIcon /></Button>
                                    </Tooltip>
                                </CardActions> : <div />
                            }
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
}
