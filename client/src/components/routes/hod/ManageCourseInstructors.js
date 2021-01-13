import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Tooltip from '@material-ui/core/Tooltip';

import axios from 'axios';
import React from 'react';

import AssignInstructorForm from './assignInstructorForm.js';
import DeleteInstructorForm from './deleteInstructorForm.js';
import UpdateInstructorForm from './updateInstructorForm.js';



const useStyles = makeStyles((theme) => ({
    title: {
        flex: '1 1 100%',
        paddingBottom: '20px'
    },
    mainFeaturedPost: {
        position: 'relative',
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
        marginBottom: theme.spacing(4),
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    mainFeaturedPostContent: {
        position: 'relative',
        padding: theme.spacing(3),
        [theme.breakpoints.up('md')]: {
            padding: theme.spacing(1),
            paddingTop: theme.spacing(3),
            paddingRight: 0,
        },
    },
    card: {
        display: 'flex',
    },
    cardDetails: {
        flex: 1,
        textAlign: 'left',

    },
    cardMedia: {
        width: 160,
    },
}));

export default function CourseInstructor_Card(props) {

    const [openAddCourseInstructor, setAddCourseInstructor] = React.useState(false);
    const [currentCourse, setCurrentCourse] = React.useState();
    const [openDeleteCourseInstructor, setOpenDeleteCourseInstructor] = React.useState(false);
    const [openUpdateCourseInstructor, setOpenUpdateCourseInstructor] = React.useState(false);


    
    const handleCloseAddCourseInstructor = () => {
        setAddCourseInstructor(false);
    }

    const handleCloseDeleteCourseInstructor = () => {
        setOpenDeleteCourseInstructor(false);
    }

    const handleCloseUpdateCourseInstructor = ()=>{
        setOpenUpdateCourseInstructor(false);
    }
    
    const handleDeleteCourseInstructor = async (event) => {
        const courseID = event.currentTarget.id.split('_')[1];
        const course = props.courses.filter(l => l.ID == courseID);
        setCurrentCourse(course[0]);
        setOpenDeleteCourseInstructor(true);
    }

    const handleOpenAddCourseInstructor = async (event) => {
        const courseID = event.currentTarget.id.split('_')[1];
        const course = props.courses.filter(l => l.ID == courseID);
        setCurrentCourse(course[0]);
        setAddCourseInstructor(true);
    }

    const handleOpenUpdateCourseInstructor = async(event)=>{
        const courseID = event.currentTarget.id.split('_')[1];
        const course = props.courses.filter(l => l.ID == courseID);
        setCurrentCourse(course[0]);
        setOpenUpdateCourseInstructor(true);
    }



    const classes = useStyles();
    return (
        <div>
            <Container maxWidth="lg">

                <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(https://i.pinimg.com/originals/94/f6/41/94f641161d1d124c6bfa2463c7feb8d4.jpg)` }}>
                    <div className={classes.overlay} />

                </Paper>

                <Typography className={classes.title} variant="h5" component="div">
                    <b>Courses</b>
                </Typography>

                <Grid container spacing={4} >
                    {
                        props.courses.map(course =>
                            <Grid item xs={12} md={4}>
                                    <Card className={classes.card}>
                                        <div className={classes.cardDetails}>
                                            <CardContent>
                                                <Typography variant="subtitle1" paragraph>
                                                    <b>Name:</b> {course.name}<br />
                                                    <b>Code:</b> {course.code}<br />
                                                    <b>Instructors:</b><br/> 
                                                    {course.instructor.map((inst=>{
                                                        return (<div> <b>Name:</b> {inst.name} <span style={{textAlign :"right"}}><b>ID:</b> {"ac-"+inst.ID}</span></div>);
                                                    }))}<br/>                                               
                                                </Typography>
                                            </CardContent>
                                            <Tooltip title = "Delete instructor from course">
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                id={"DELETECOURSEINSTRUCTOR_" + course.ID}
                                                color='primary'
                                                onClick={handleDeleteCourseInstructor}
                                            >
                                                <DeleteIcon style={{ fontSize: 25, opacity: 0.8 }}
                                                />
                                            </IconButton>
                                            </Tooltip>
                                            <Tooltip title = "Update course instructor">
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                id={"UPDATECOURSEINSTRUCTOR_" + course.ID}
                                                color='primary'
                                                onClick={handleOpenUpdateCourseInstructor}
                                            >
                                                <EditIcon style={{ fontSize: 30, opacity: 1 }}
                                                />
                                            </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Add course instructor">
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                color='primary'
                                                id={"ADDCOURSEINSTRUCTOR_" + course.ID}       
                                                onClick={handleOpenAddCourseInstructor}
                                            >
                                            <AddCircleIcon style={{ fontSize: 25, opacity: 0.8 }}                                                                                                />
                                            </IconButton>
                                            </Tooltip>
                                        </div>
                                    </Card>
                            </Grid>
                        )
                    }
                </Grid>
            </Container>
            <AssignInstructorForm
                open={openAddCourseInstructor}
                //handleOpenEdit={handleOpenEdit}
                handleClose={handleCloseAddCourseInstructor}
                course={currentCourse}
                academicMembers = {props.academicMembers}
                setComponentInMain={props.setComponentInMain}
                openAlert={props.openAlert}
                setBackdropIsOpen={props.setBackdropIsOpen}
                />

            <DeleteInstructorForm
            open={openDeleteCourseInstructor}
            //handleOpenEdit={handleOpenEdit}
            handleClose={handleCloseDeleteCourseInstructor}
            course={currentCourse}
            academicMembers = {props.academicMembers}
            setComponentInMain={props.setComponentInMain}
            openAlert={props.openAlert}
            
            setBackdropIsOpen={props.setBackdropIsOpen}
             
           />

            <UpdateInstructorForm
            open={openUpdateCourseInstructor}
            //handleOpenEdit={handleOpenEdit}
            handleClose={handleCloseUpdateCourseInstructor}
            course={currentCourse}
            allCourses = {props.courses}
            academicMembers = {props.academicMembers}
            setComponentInMain={props.setComponentInMain}
            openAlert={props.openAlert}
            
            setBackdropIsOpen={props.setBackdropIsOpen}
             
           />



        </div >
    );

}
