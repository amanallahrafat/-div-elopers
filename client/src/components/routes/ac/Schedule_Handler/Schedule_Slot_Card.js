import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import Replacement_Request_Card from './Replacement_Request_Card';
import { Box, Collapse, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import axios from 'axios';

const useStyles = makeStyles({
    root: {
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
export default function SimpleCard(props) {
    const classes = useStyles();
    const [openReplacementRequestCard, setOpenReplacementRequestCard] = React.useState(false);
    const [requestStatus, setRequestStatus] = React.useState('-');

    useEffect(() => {
        if (props.cardType == "replacement" && requestStatus == "-")
            setRequestStatus(props.requestStatus)
        console.log("mohamed")
    })

    const handleOpenReplacementRequest = () => {
        setOpenReplacementRequestCard(true);
    }

    const handleCloseReplacementRequest = () => {
        setOpenReplacementRequestCard(false);
    }

    const handleAcceptReplacementRequest = async () => {
        console.log("Accept");
        try {
            setRequestStatus("accepted")
            const res = await axios.put('ac/respondToReplacementRequest',
                { "requestID": props.requestID, "response": 1 }
            );
        } catch (err) {
            setRequestStatus("pending")
            console.log(err.response.data);
        }
    }

    const handleRejectReplacementRequest = async () => {
        console.log("Reject");
        try {
            setRequestStatus("rejected")
            const res = await axios.put('ac/respondToReplacementRequest',
                { "requestID": props.requestID, "response": 0 }
            );
        } catch (err) {
            setRequestStatus("pending")
            console.log(err.response.data);
        }
    }
    
    const handleCancelReplacementRequest = async (reqID) => {
        console.log(reqID)
        props.setBackdropIsOpen(true);
        try {
            const res = await axios.delete(`/ac/cancelReplacementRequest/${reqID}`);
            await props.setComponentInMain("personalSchedule");
            alert("Request has been cancelled successfully.")
        } catch (err) {
            console.log(err);
            console.log(err.response.data)
            props.setBackdropIsOpen(false);
        }
    }

    return (
        <div>
            <Tooltip title={
                props.cardType == "replacement_sent" ? "Sent Replacement Request" :
                    props.cardType == "replacement" ?
                        (requestStatus == "pending" ? "Pending Replacement Request" :
                            (requestStatus == "accepted" ? "Accepted Replacement Request" : "Rejected Replacement Request")) : "Regular Slot"}>

                <Card className={classes.root} className={
                    props.cardType == "replacement" ?
                        (requestStatus == "pending" ? classes.pendingCard :
                            (requestStatus == "accepted" ? classes.acceptedCard : classes.rejectedCard)) : ""}>
                    <CardContent>
                        <Box display="flex" flexDirection="row">
                            <Box width="70%">
                                <Typography className={classes.pos} >
                                    <b>{props.courseName}</b>
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    <b>Location:&nbsp;</b>{props.locationName}
                                </Typography>
                                <Collapse in={props.cardType == "replacement" || props.cardType == "replacement_sent"}>
                                    <Typography className={classes.pos} color="textSecondary">
                                        <b>Instructor:&nbsp;</b>{props.courseInstructor ? props.courseInstructor.name : ""}
                                    </Typography>
                                    <Typography className={classes.pos} color="textSecondary">
                                        <b>Email:&nbsp;</b>{props.courseInstructor ? props.courseInstructor.email : ""}
                                    </Typography>
                                    <Typography className={classes.pos} color="textSecondary">
                                        {props.courseInstructor ? (new Date(props.requestedDate)).toLocaleDateString('en-US') : ""}
                                    </Typography>
                                    <Collapse in={props.cardType == "replacement_sent"}>
                                        <Typography className={classes.pos} color="textSecondary">
                                            <b>Status:&nbsp;</b>{props.requestStatus}
                                        </Typography>
                                    </Collapse>
                                </Collapse>
                            </Box>
                            <Box >
                                {
                                    props.cardType == "regularSlot" ? <CardActions>
                                        <Tooltip title="Send Replacement Request">
                                            <Button size="small" color="primary" onClick={handleOpenReplacementRequest}><FindReplaceIcon /></Button>
                                        </Tooltip>
                                    </CardActions> : <div />
                                }


                                {
                                    (props.cardType == "replacement" && requestStatus == "pending") ? (<div><CardActions>
                                        <Tooltip title="Accept Replacement Request">
                                            <Button
                                                size="small"
                                                style={{ color: "green" }}
                                                onClick={handleAcceptReplacementRequest}
                                            >
                                                <CheckIcon />
                                            </Button>
                                        </Tooltip>
                                    </CardActions>
                                        <CardActions>
                                            <Tooltip title="Reject Replacement Request">
                                                <Button
                                                    size="small"
                                                    style={{ color: "red" }}
                                                    onClick={handleRejectReplacementRequest}
                                                ><CloseIcon />
                                                </Button>
                                            </Tooltip>
                                        </CardActions></div>) : <div />
                                }
                                {
                                    (props.cardType == "replacement_sent" && props.requestStatus == "pending") ? (<div><CardActions>

                                    </CardActions>
                                        <CardActions>
                                            <Tooltip title="Cancel Replacement Request">
                                                <Button
                                                    size="small"
                                                    style={{ color: "red" }}
                                                    onClick={() => {
                                                        handleCancelReplacementRequest(props.requestID)
                                                    }}
                                                ><CloseIcon />
                                                </Button>
                                            </Tooltip>
                                        </CardActions></div>) : <div />
                                }
                            </Box>
                        </Box>
                    </CardContent>
                    <Replacement_Request_Card
                        open={openReplacementRequestCard}
                        onClose={handleCloseReplacementRequest}
                        courseID={props.courseID}
                        slotNumber={props.slotNumber}
                        slotDay={props.slotDay}
                        slotID={props.slotID}
                        setComponentInMain = {props.setComponentInMain}

                        setBackdropIsOpen={props.setBackdropIsOpen}
                    />
                </Card>
            </Tooltip>
        </div>
    );
}
