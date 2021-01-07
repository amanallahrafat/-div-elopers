import { Box, Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import React, { useEffect } from 'react';

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
    const [status, setStatus] = React.useState("-");
    const [instructorName, setInstructorName] = React.useState("Not yet assigned");
    const [instructorID, setInstructorID] = React.useState("");
    const [locationName, setLocationName] = React.useState("");
    const [isMe, setIsMe] = React.useState(false);
    const [reqID, setReqID] = React.useState(null);
    const [hasBeenCancelled, setHasBeenCanelled] = React.useState(false);

    useEffect(() => {
        console.log(props)
        console.log(hasBeenCancelled)
        if (status == '-'  &&!hasBeenCancelled &&props.slotLinkingReq) {
            setStatus(props.slotLinkingReq.status);
        }
        if (instructorName == 'Not yet assigned' && props.instructorName) {
            setInstructorName(props.instructorName);
        }
        if (instructorID == '' && props.instructorID) {
            setInstructorID(props.instructorID);
        }
        if (locationName == '' && props.locationName) {
            setLocationName(props.locationName);
        }
        if(status!='-'){
            setIsMe(true);
        }else{
            setIsMe(false);
        }
    });

    const handleSlotLinkingRequest = async () => {
        try {
            const res = await axios.post("ac/sendSlotLinkingRequest", { courseID: props.courseID, slotID: props.slotID })
            setReqID(res.data.data.reqID);
            setStatus('pending');
            setHasBeenCanelled(false);
        } catch (err) {
            console.log({ courseID: props.courseID, slotID: props.slotID })
            console.log(err.response.data)
            alert(err.response.data)
        }
    }

    const handleCancelSlotLinkingRequest = async (reqID) => {
        try{
            const res = await axios.delete(`ac/cancelSlotLinkingRequest/${reqID}`);
            alert("Request has been cancelled successfully.")
            await setHasBeenCanelled(true);
            await setStatus('-');
            await setIsMe(false);
        }catch(err){
            alert(err);
        }
    }

    return (
        <div>
            <Card className={classes.root} className={
                (!isMe) ? "" : status == "pending" ? classes.pendingCard :
                    status == "accepted" ? classes.acceptedCard : classes.rejectedCard
            }>
                <CardContent>
                    <Box display="flex" flexDirection="row">
                        <Box width="70%">
                            <Typography className={classes.pos} >
                                <b>Instructor:&nbsp;</b>{instructorName}
                            </Typography>
                            {
                                instructorID != "" ? (<Typography className={classes.pos} >
                                    <b>ID:&nbsp;</b>{instructorID}
                                </Typography>) : <div />
                            }
                            <Typography className={classes.pos} color="textSecondary">
                                <b>Location:</b> &nbsp;{locationName}
                            </Typography>
                        </Box>
                        <Box>
                            {
                                (status == "-" && instructorName == "Not yet assigned") ||
                                    status == "rejected"
                                    ? <CardActions>
                                        <Tooltip title="Send Slot Linking Request">
                                            <Button size="small" color="primary" onClick={handleSlotLinkingRequest}><CallReceivedIcon /></Button>
                                        </Tooltip>
                                    </CardActions> :
                                    status == "pending" ?
                                        <CardActions>
                                            <Tooltip title="Cancel Slot Linking Request">
                                                <Button size="small" style={{ color: "red" }} onClick={
                                                    () => {
                                                        let requestID=-1;
                                                        if(props.slotLinkingReq){
                                                            requestID=props.slotLinkingReq.ID;
                                                        }else{
                                                            requestID=reqID;
                                                        }
                                                        handleCancelSlotLinkingRequest(requestID);
                                                    }}><CloseIcon /></Button>
                                            </Tooltip>
                                        </CardActions>
                                        : <div />
                            }
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
}
