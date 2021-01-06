import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import Tooltip from '@material-ui/core/Tooltip';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

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

    const handleOpenAssignMemberToSlot = (event) => {
        const courseID = event.currentTarget.id.split('_')[3];
        const slotID = event.currentTarget.id.split('_')[5];
        // const courseID = props.currentCourse;
        // const slotID = props.currentSlot;    

        console.log(event.currentTarget.id.split('_'));
        console.log(courseID, "in handle add");
        props.setCurrentCourse(courseID)
        props.setCurrentSlot(slotID)
        props.setOpenAssignAcademicMemberForm(true);
    }
    const handleUpdateAssignMemberToSlot = (event) => {
        const currentInstructorID=event.currentTarget.id.split('_')[1];
        const courseID = event.currentTarget.id.split('_')[3];
        const slotID = event.currentTarget.id.split('_')[5];
        // const courseID = props.currentCourse;
        // const slotID = props.currentSlot;    

        console.log(event.currentTarget.id.split('_'));
        console.log(courseID, "in handle update");
        props.setCurrentCourse(courseID)
        props.setCurrentSlot(slotID)
        props.setCurrentInstructorID(currentInstructorID);
        props.setOpenUpdateAcademicMemberForm(true);
    }

    const handleDeleteAssignMemberToSlot = async (event) => {
        const currentInstructorID=event.currentTarget.id.split('_')[1];
        const courseID = event.currentTarget.id.split('_')[3];
        const slotID = event.currentTarget.id.split('_')[5];
    
        console.log(event.currentTarget.id.split('_'));
        console.log(courseID, "in handle delete");
        try{
       await props.handleDeleteAssignMemberToSlot (slotID,courseID,currentInstructorID);
        }catch(err){
      //      alert(err.response.data)
        }
    }

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
                    <Tooltip title="Assign an academic member">
                        <IconButton
                            style={props.instructorID!=""?{display:'none'}:{}}
                            aria-label="account of current user"
                            aria-haspopup="true"
                            color='primary'
                            id={"ACDEMICMEMBERID_" + props.instructorID + "_COURSEID_" + props.courseID + "_slotID_" + props.slotID}
                            onClick={handleOpenAssignMemberToSlot}
                        >
                            <AddCircleIcon style={{ fontSize: 25, opacity: 0.8 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="update an academic member">
                        <IconButton
                            style={props.instructorID==""?{display:'none'}:{}}
                            aria-label="account of current user"
                            aria-haspopup="true"
                            color='primary'
                            id={"UPDATEACDEMICMEMBERID_" + props.instructorID + "_COURSEID_" + props.courseID + "_slotID_" + props.slotID}
                            onClick={handleUpdateAssignMemberToSlot}
                        >
                            <EditIcon style={{ fontSize: 25, opacity: 0.8 }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="delete an academic member">
                        <IconButton
                            style={props.instructorID==""?{display:'none'}:{}}
                            aria-label="account of current user"
                            aria-haspopup="true"
                            color='primary'
                            id={"DELETEACDEMICMEMBERID_" + props.instructorID + "_COURSEID_" + props.courseID + "_slotID_" + props.slotID}
                            onClick={handleDeleteAssignMemberToSlot}
                        >
                            <DeleteIcon style={{ fontSize: 25, opacity: 0.8 }} />
                        </IconButton>
                    </Tooltip>

                </CardContent>
            </Card>
        </div>
    );
}
