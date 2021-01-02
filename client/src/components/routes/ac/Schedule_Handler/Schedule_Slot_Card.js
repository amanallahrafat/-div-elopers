import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import Replacement_Request_Card from './Replacement_Request_Card';
import { Box, Tooltip } from '@material-ui/core';
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
});
export default function SimpleCard(props) {
    const classes = useStyles();
    const [openReplacementRequestCard, setOpenReplacementRequestCard] = React.useState(false);

    const handleOpenReplacementRequest = () => {
        setOpenReplacementRequestCard(true);
    }
    const handleCloseReplacementRequest = () => {
        setOpenReplacementRequestCard(false);
    }

    return (
        <div>
            <Card className={classes.root}>
                <CardContent>
                    <Box display = "flex" flexDirection = "row">
                    <Box width = "70%">
                    <Typography className={classes.pos} >
                        <b>{props.courseName}</b>
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        {props.locationName}
                    </Typography>
                    </Box>
                    <Box >
                    <CardActions>
                        <Tooltip title = "Send Replacement Request">
                        <Button  size="small" color="primary" onClick={handleOpenReplacementRequest}><FindReplaceIcon /></Button>
                        </Tooltip>
                    </CardActions>
                    </Box>
                    </Box>
                </CardContent>
                <Replacement_Request_Card
                    open={openReplacementRequestCard}
                    onClose={handleCloseReplacementRequest}
                    courseID={props.courseID}
                    slotNumber={props.slotNumber}
                    slotDay={props.slotDay}
                    slotID = {props.slotID}
                />
            </Card>
        </div>
    );
}
