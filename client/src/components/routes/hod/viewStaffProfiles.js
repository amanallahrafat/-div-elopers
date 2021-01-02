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
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
    root: {
        flexGrow: 1,
      },
}));

export default function ViewStaffProfiles(props) {
    const [showInstructor,setShowInstructor]=React.useState('');
    const [showCourse,setShowCourse]=React.useState('');
    
    const classes = useStyles();
    return (
        <div>
            <Container maxWidth="lg">

                <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(https://i.pinimg.com/originals/94/f6/41/94f641161d1d124c6bfa2463c7feb8d4.jpg)` }}>
                    <div className={classes.overlay} />

                </Paper>

                <Typography className={classes.title} variant="h5" component="div">
                    <b>Staff Profiles</b>
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
                    id="filterByStaff"
                    options={[{name:"All"},...((props.academicMembers).filter((mem)=>{
                        if(!props.academicMembers)return true;
                        const deptID=props.academicMembers.find((ac)=>{return ac.ID==props.hodProfile.ID}).departmentID;
                        return mem.departmentID==deptID}))]}
                   
                    getOptionLabel={(option) => option.name}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Filter by an academic member" variant="outlined" />}
                    onClose={()=>{        setShowCourse('') }}
            
                    onChange={(event, newValue) => {
                        if(newValue&&newValue.name=="All"&&newValue.ID==undefined){
                            props.updateProfiles();
                            props.setComponentInMain("viewStaffProfiles");
                      //      setShowInstructor('');
                            
                        }else
                        if(newValue&&newValue.ID){
                            props.updateProfiles("staffMember",{ID:newValue.ID});
                          props.setComponentInMain("viewStaffProfiles");
                      //    setShowInstructor('');
                          
                        }
                    }}
                   // clearOnEscape={true}
                    value={showInstructor}
                />
             </Grid>
             <Grid item>
               <Autocomplete
                    id="filterByCourse"
                    options={props.allCourses.filter((cor)=>{
                        return true;
                    })}
                   
                    getOptionLabel={(option) => { 
                        if(!option)return '';
                        return(option.name + " " + option.code)}}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Filter by a course" variant="outlined" />}
                    onClose={()=>{        setShowCourse('')
                    }}
                    onChange={(event, newValue) => {
                     
                        if(newValue&&newValue.ID){
                            props.updateProfiles("course",{courseID:newValue.ID});
                            props.setComponentInMain("viewStaffProfiles");
                  //          setShowCourse('')
                            
                        }
                    }}

                    value={showCourse}
        
                />
                </Grid>
               
                </Grid>
                <br/>
                <Grid container spacing={4} >
                    {
                    
                        props.staffProfiles.map(profile =>
                            <Grid item xs={12} md={4}>
                                <Card className={classes.card}>
                                    <div className={classes.cardDetails}>
                                        <CardContent>
                                            <Typography variant="subtitle1" paragraph>
                                                <b>Name:</b> {profile.name}<br />
                                                <b>Email:</b> {profile.email}<br />
                                                <b>ID:</b> {profile.ID}<br />
                                                <b>Office:</b> {profile.officeID}<br/>
                                                <b>Day off:</b> {profile.dayOff}<br/>
                                                <b>Department:</b> {profile.departmentID}<br/>
                                            </Typography>
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
