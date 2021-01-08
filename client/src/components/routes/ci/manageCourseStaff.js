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
import Box from '@material-ui/core/Box';

import axios from 'axios';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AssignCourseCoordinatorForm from './assignCourseCoordinatorForm.js'


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
    root: {
        flexGrow: 1,
    },
}));

export default function ManageCourseStaff(props) {
    const [showInstructor, setShowInstructor] = React.useState('');
    const [showCourse, setShowCourse] = React.useState('');
    const [selectedCourse, setSelectedCourse] = React.useState(-1);
    const [selectedCourseCordinator, setSelectedCourseCordinator] = React.useState("not yet assigned")
    const [selectedCourseCordinatorID, setSelectedCourseCordinatorID] = React.useState(-1)

    const [openAssignCourseCoordinator, setOpenAssignCourseCoordinator] = React.useState(false);
    // React.useEffect(()=>{
    //    return ()=>{ setSelectedCourse(null);
    //     setSelectedCourseCordinatorID(null);
    //     setSelectedCourseCordinator(null);}
    // },[])
    const handleOpenAssignCourseCoordinator = () => {
        setOpenAssignCourseCoordinator(true);

    }
    const handleCloseAssignCourseCoordinator = () => {
        setOpenAssignCourseCoordinator(false);

    }

    const handleRemoveAcademicMember = async (event) => {
        let currentInstructorID = event.currentTarget.id.split('_')[1];
        const courseID = event.currentTarget.id.split('_')[3];
        currentInstructorID = currentInstructorID.split('-')[1];
        console.log(event.currentTarget.id.split('_'));
        console.log(courseID, "in handle remove");
        try {
            const req = {
                "academicMemberID": parseInt(currentInstructorID),
                "courseID": parseInt(courseID)
            };
            console.log(req);
            const res = await axios.delete(`/ci/removeAcademicMemberFromCourse`, { data: req });



            if (selectedCourseCordinatorID == currentInstructorID) {
                setSelectedCourseCordinator("not yet assigned")
                setSelectedCourseCordinatorID(-1);
            }

            props.updateProfiles({ courseID: selectedCourse });
            props.setComponentInMain("manageCourseStaff");
        } catch (err) {
       
            props.openAlert(err.response.data);
        }
    }

    const classes = useStyles();
    return (
        <div>
            <Container maxWidth="lg">

                <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(https://i.pinimg.com/originals/94/f6/41/94f641161d1d124c6bfa2463c7feb8d4.jpg)` }}>
                    <div className={classes.overlay} />

                </Paper>

                <Typography className={classes.title} variant="h5" component="div">
                    <b>Manage Course Staff</b>
                </Typography>
                <Grid
                    container
                    className={classes.root}
                    spacing={2}
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item>
                        <Autocomplete
                            id="filterByCourse"
                            options={props.allCourses}

                            getOptionLabel={(option) => {
                                if (!option) return '';
                                return (option.code + ": "+option.name)
                            }}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Filter by a course" variant="outlined" />}
                            // onClose={() => {
                            //     setShowCourse('')
                            // }}
                            onChange={(event, newValue) => {

                                if (newValue && newValue.ID) {
                                    setSelectedCourse(newValue.ID)
                                    let cordinatorName = "not yet assigned";

                                    const mem = props.academicMembers.find((m) => {
                                        return m.ID == newValue.coordinatorID;
                                    })

                                    if (mem)
                                        cordinatorName = mem.name;

                                    console.log(cordinatorName, newValue.cordinatorID);
                                    setSelectedCourseCordinator(cordinatorName)
                                    setSelectedCourseCordinatorID(newValue.coordinatorID)

                                    props.updateProfiles({ courseID: newValue.ID });
                                    props.setComponentInMain("manageCourseStaff");

                                }
                            }}
                        // value={showCourse}

                        />
                        <br />
                        <Grid container alignItems="center"  direction="row" style={(selectedCourse == -1) ? { display: 'none' } : {}}>
                            <Grid item>
                                <Typography variant="subtitle1" paragraph>
                                    <b>Course Coordinator:</b> {selectedCourseCordinator}<br />
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Tooltip title="Assign a course coordinator">
                                    <IconButton
                                        style={selectedCourseCordinator != "not yet assigned" ? { display: 'none' } : {}}
                                        aria-label="account of current user"
                                        aria-haspopup="true"
                                        color='primary'
                                        id={"ASSIGNCOURSECOORDINATORID_" + props.instructorID + "_COURSEID_" + props.courseID + "_slotID_" + props.slotID}
                                        onClick={handleOpenAssignCourseCoordinator}
                                    >
                                        <EditIcon style={{ fontSize: 25, opacity: 0.8 }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                        <AssignCourseCoordinatorForm
                            open={openAssignCourseCoordinator}
                            handleClose={handleCloseAssignCourseCoordinator}
                            courseID={selectedCourse}
                            academicMembers={props.academicMembers}
                            setComponentInMain={props.setComponentInMain}
                            updateCourseStaff={props.updateProfiles}
                            setSelectedCourseCordinator={setSelectedCourseCordinator}
                            setSelectedCourseCordinatorID={setSelectedCourseCordinatorID}
                        />


                    </Grid>

                </Grid>
                <br />
                <Grid container spacing={4} >
                    {

                        props.staffProfiles.map(profile =>
                            <Grid item xs={12} md={4}>
                                <Card className={classes.card}>
                                    <div className={classes.cardDetails}>
                                        <CardContent>
                                            <Typography variant="subtitle1" paragraph>
                                                <b>Name:</b> {profile.name}<br />
                                                <b>Email:</b> <a href={"mailto:"+profile.email}>{profile.email} </a><br /> 
                                             <b>ID:</b> {profile.ID}<br />
                                                <b>Office:</b> {profile.officeID}<br />
                                                <b>Day off:</b> {profile.dayOff}<br />
                                                <b>Department:</b> {profile.departmentID}<br />
                                            </Typography>
                                            <Tooltip title="Remove from teaching staff">
                                                <IconButton
                                                    style={props.instructorID == "" ? { display: 'none' } : {}}
                                                    aria-label="account of current user"
                                                    aria-haspopup="true"
                                                    color='primary'
                                                    id={"REMOVEACADEMICMEMBER_" + profile.ID + "_COURSEID_" + selectedCourse}
                                                    onClick={handleRemoveAcademicMember}
                                                >
                                                    <DeleteIcon style={{ fontSize: 25, opacity: 0.8 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </CardContent>
                                    </div>
                                </Card>
                            </Grid>
                        )
                    }
                </Grid>
            </Container>

        </div >
    );
}
