import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
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

    return (
        <div>
            <Card className={classes.root} className={
                props.instructorName == "Not yet assigned" ? classes.pendingCard : ""}>
                <CardContent>
                    <Typography className={classes.pos} >
                        <b>Instructor:&nbsp;</b>{props.instructorName}
                    </Typography>
                    {
                        props.instructorID ? (<Typography className={classes.pos} >
                            <b>ID:&nbsp;</b>{props.instructorID}
                        </Typography>) : <div />
                    }
                    <Typography className={classes.pos} color="textSecondary">
                        <b>Location:&nbsp;</b>{props.locationName}
                    </Typography>

                </CardContent>
            </Card>
        </div>
    );
}
