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
});
export default function SimpleCard(props) {
    const classes = useStyles();
  
    return (
        <div>
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.pos} >
                        <b>{props.instructorName}</b>
                    </Typography>
                    
                    <Typography className={classes.pos} >
                        <b>{props.instructorID}</b>
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        {props.locationName}
                    </Typography>
                    
              </CardContent>
            </Card>
        </div>
    );
}
