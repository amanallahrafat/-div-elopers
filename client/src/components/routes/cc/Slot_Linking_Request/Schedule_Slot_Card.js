import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Box, Collapse, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
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
    const [requestStatus, setRequestStatus] = React.useState('-');

    useEffect(() => {
        if (props.cardType == "replacement" && requestStatus == "-")
            setRequestStatus(props.request.status)
    })


    const handleAcceptRequest = async () => {
        console.log("Accept");
        try {
            setRequestStatus("accepted")
            const res = await axios.post('/cc/handleSlotLinkingRequest',
                { requestID: props.request.ID, decision: 1 }
            );
            await props.handleSlotLinkingRequest(props.request.ID ,1);
        } catch (err) {
            setRequestStatus("pending")
            console.log(err.response.data);
        }

    }

    const handleRejectRequest = async () => {
        console.log("Reject");
        try {
            setRequestStatus("rejected")
            const res = await axios.post('/cc/handleSlotLinkingRequest',
                { requestID: props.request.ID, decision: 0 }
            );
            await props.handleSlotLinkingRequest(props.request.ID ,0);
        } catch (err) {
            setRequestStatus("pending")
            console.log(err.response.data);
        }
    }

    return (
        <div>
            <Tooltip title={
                props.cardType == "replacement" ?
                    (requestStatus == "pending" ? "Pending Slot Linking Request" :
                        (requestStatus == "accepted" ? "Accepted Slot Linking Request" : "Rejected Slot Linking Request")) : "Regular Slot"}>

                <Card className={classes.root} className={
                    props.cardType == "replacement" ?
                        (requestStatus == "pending" ? classes.pendingCard :
                            (requestStatus == "accepted" ? classes.acceptedCard : classes.rejectedCard)) : ""}>
                    <CardContent style={{margin : "0px",padding : "7px"}}>
                        <Box display="flex" flexDirection="row"  style={{margin : "0px",padding : "0px"}}>
                            <Box width="70%">
                                <Typography className={classes.pos} >
                                    <b>{props.slot.courseName}</b>
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    <b>Location:&nbsp;</b>{props.locations.filter(elm => elm.ID == props.slot.locationID)[0].name}
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    <b>Instructor:&nbsp;</b>{getInstructorName(props.academicMembers,props.request.senderID)}
                                </Typography>
                            </Box>
                            <Box >
                                {
                                    (props.cardType == "replacement" && requestStatus == "pending") ? (<div><CardActions>
                                        <Tooltip title="Accept">
                                            <Button
                                                size="small"
                                                style={{ color: "green" }}
                                                onClick={handleAcceptRequest}
                                            >
                                                <CheckIcon />
                                            </Button>
                                        </Tooltip>
                                    </CardActions>
                                        <CardActions>
                                            <Tooltip title="Reject">
                                                <Button
                                                    size="small"
                                                    style={{ color: "red" }}
                                                    onClick={handleRejectRequest}
                                                ><CloseIcon />
                                                </Button>
                                            </Tooltip>
                                        </CardActions></div>) : <div />
                                }
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Tooltip>
        </div>
    );
}
