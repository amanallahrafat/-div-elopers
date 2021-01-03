import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import React from 'react';
import AddCourseForm from './Add_Course_Form';
import EditCourseForm from './Edit_Course_Form';

const useStyles = makeStyles((theme) => ({
    title: {
        flex: '1 1 100%',
        paddingBottom: '20px'
    },
    chip: {
        margin: 2,
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

export default function Course_Card(props) {
    const [openEdit, setOpenEdit] = React.useState(false);

    const [openUpdateCourse, setOpenUpdateCourse] = React.useState(false);
    const [openAddCourse, setOpenAddCourse] = React.useState(false);
    
    const [updatedCourse, setUpdatedCourse] = React.useState({});

    const handleOpenEdit = (event) => {
        setOpenUpdateCourse(true);
    }
    const handleCloseEdit = () => {
        setOpenUpdateCourse(false);
    }

    const handleOpenAdd = () => {
        setOpenAddCourse(true);
    }

    const handleCloseAdd = () => {
        setOpenAddCourse(false);
    }

    const handleDeleteCourse = async (event) => {
        const res = await axios.delete(`/hr/deleteCourse/${event.currentTarget.id.split('_')[1]}`);
        props.setComponentInMain("course");
    }

    const handleUpdateCourse = async (event) => {
        const CourseID = event.currentTarget.id.split('_')[1];
        const Course = props.courses.filter(l => l.ID == CourseID);
        console.log(Course[0]);
        setUpdatedCourse(Course[0]);
        setOpenUpdateCourse(true);
    }

    const getDepartmentName =  (ID) =>{
        const dep  = props.departments.filter(elm => elm.ID == ID);
        return dep.length > 0 ? dep[0].name : undefined ;
    }

    const getMemberName = (ID) =>{
        const member = props.academicMembers.filter(elm => elm.ID == ID);
        console.log(member);
        return member.length > 0 ? member[0].name : undefined;
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
                    <IconButton
                        aria-label="account of current user"
                        aria-haspopup="true"
                        color='primary'
                        onClick={handleOpenAdd}
                    >
                        <AddCircleIcon style={{ fontSize: 25, opacity: 0.8 }}
                        />
                    </IconButton>
                </Typography>

                <Grid container spacing={4} >
                    {
                        props.courses.map(course =>
                            <Grid item xs={12}>
                                <CardActionArea component="a" disabled={false}>
                                    <Card className={classes.card}>
                                        <div className={classes.cardDetails}>
                                            <CardContent>
                                                <Typography variant="subtitle1" paragraph>
                                                    <b>Name:</b> {course.name}<br />
                                                    <b>Code:</b> {course.code}<br />
                                                    <b>Course Coordinator:</b> {getMemberName(course.coordinatorID)}<br />
                                                    <b>Departments:</b> <br/> {
                                                        course.department.map(m =>
                                                            <Chip key={m} label={getDepartmentName(m)} className={classes.chip} />
                                                        )
                                                    }<br />
                                                    <b>Instructors:</b> <br/> {
                                                        course.instructor.map(m =>
                                                            <Chip key={m} label={getMemberName(m)} className={classes.chip} />
                                                        )
                                                    }<br />
                                                    <b>Teaching Staff:</b> <br/> {
                                                        course.teachingStaff.map(m =>
                                                            <Chip key={m} label={getMemberName(m)} className={classes.chip} />
                                                        )
                                                    }<br />
                                                    <b>Description:</b> {course.description}<br />
                                                </Typography>
                                            </CardContent>
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                id={"DELETE_" + course.ID}
                                                color='primary'
                                                onClick={handleDeleteCourse}
                                            >
                                                <DeleteIcon style={{ fontSize: 25, opacity: 0.8 }}
                                                />
                                            </IconButton>
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                id={"UPDATE_" + course.ID}
                                                color='primary'
                                                onClick={handleUpdateCourse}
                                            >
                                                <EditIcon style={{ fontSize: 30, opacity: 1 }}
                                                />
                                            </IconButton>
                                        </div>
                                    </Card>
                                </CardActionArea>
                            </Grid>
                        )
                    }
                </Grid>
            </Container>
            <EditCourseForm
                open={openUpdateCourse}
                handleCloseEdit={handleCloseEdit}
                course = {updatedCourse}
                departments = {props.departments}
                setComponentInMain={props.setComponentInMain} />
            <AddCourseForm
                open={openAddCourse}
                handleCloseAdd={handleCloseAdd}
                departments = {props.departments}
                setComponentInMain={props.setComponentInMain} />
        </div >
    );
}
