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
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

import Box from '@material-ui/core/Box';

import axios from 'axios';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import RequestForm from './requestForm.js';




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

export default function MaternityLeaveRequest(props) {
    const [showForm, setShowForm] = React.useState(false);
    const [reqID,setReqID]=React.useState();
    const[selection,setSelection]=React.useState("all");
    const handleCloseForm=()=>{
        setShowForm(false);
    }
    const handleOpenForm=(event)=>{
            const requestID = event.currentTarget.id.split('_')[1];
            setReqID(requestID);
            setShowForm(true);
    }
    const handleAcceptRequest= async(event)=>{

        const requestID = event.currentTarget.id.split('_')[1];
       
        try {
            const req = {
                response: 1
            };
        
            props.updateRequests("maternity leave requests",requestID,"accepted");
            const res = await axios.put(`/hod/respondToMaternityLeaveRequest/${requestID}`,  req);
        } catch (err) {
            props.updateRequests("maternity leave requests",requestID,"pending");
            
            props.openAlert(err.response.data);
            
        }
        props.setComponentInMain("maternityLeaveRequest");
    
    }

    const handleRejectRequest= async(requestID,msg)=>{

    
        try {
            const req = {
                response: 0,
                msg:msg
            };
            props.updateRequests("maternity leave requests",requestID,"rejected");
            const res = await axios.put(`/hod/respondToMaternityLeaveRequest/${requestID}`,  req);
        } catch (err) {
            props.updateRequests("maternity leave requests",requestID,"pending");
            
            props.openAlert(err.response.data);
            
        }
        props.setComponentInMain("maternityLeaveRequest");
    
    }

    const classes = useStyles();
    return (
        <div>
            <Container maxWidth="lg">

                <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(https://i.pinimg.com/originals/94/f6/41/94f641161d1d124c6bfa2463c7feb8d4.jpg)` }}>
                    <div className={classes.overlay} />

                </Paper>

                <Typography className={classes.title} variant="h5" component="div">
                    <b>Maternity Leave Requests</b>
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
                            id="filterMaternityLeaveRequest"
                            options={[ "all" ,"accepted","rejected","pending" ]}

                            getOptionLabel={(option) => option}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Filter by request status" variant="outlined" />}
                           
                            onChange={(event, newValue) => {
                                    if (newValue ) {
                                        setSelection(newValue);
                         
                                    }
                            }}
                        /> 
                    </Grid>
                </Grid> 
                <br />
                <Grid container spacing={4}
                    direction="column"
                    alignItems="stretch"
                >
                    {

                        props.requests.map(req =>
                            <Grid item xs style={(req.status!=selection&&selection!="all")?{display:'none'}:{}} >
                                <Card className={classes.card}>
                                    <div className={classes.cardDetails}>
                                        <CardContent >
                                            <Box display="flex" direction="row" justifyContent="space-between">
                                            <Box>
                                            <Typography variant="subtitle1" paragraph>
                                                <b>Sender Name:</b> {req.senderID}<br />
                                                 <b>Email:</b> <a href={"mailto:"+req.email}>{req.email} </a><br /> 
                                                <b>Message:</b> {req.msg}<br />
                                                <b>Resquested start date  :</b> {new Date(req.startDate).toLocaleDateString('en-US')}<br />
                                                <b>Resquested end date  :</b> {new Date(req.endDate).toLocaleDateString('en-US')}<br />
                                                <b>Submission date:</b> {new Date(req.submissionDate).toLocaleDateString('en-US')}<br />
                                                <b>Document :</b> {req.documents}<br />
                                                <b>Status:</b> {req.status}<br />
                                            </Typography>
                                            </Box>

                                            <Box  >
                                        <Tooltip title = "Accept the request">
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                 id={"ACCEPTMATERNITYLEAVEREQUEST_" + req.ID}
                                                color='primary'
                                                 onClick={handleAcceptRequest}
                                                 style={(req.status!="pending")?{display:'none'}:{}}
                                              >
                                                <CheckIcon style={{color:"green", fontSize: 25, opacity: 1 }}
                                                />
                                            </IconButton>
                                            </Tooltip>

                                            <Tooltip title = "Reject the request">
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                id={"REJECTMATERNITYLEAVEREQUEST_" + req.ID}
                                                color='primary'
                                                style={(req.status!="pending")?{display:'none'}:{}}
                                           
                                                 onClick={handleOpenForm}
                                            >
                                                <CloseIcon style={{ color:"#cc0000",fontSize: 25, opacity: 1 }}
                                                />
                                            </IconButton>
                                            </Tooltip>
                                            </Box>
                                        
                                            </Box>
                                        </CardContent>
                                    </div>
                                </Card>
                            </Grid>

                       )
                    }
                </Grid>
            </Container>

            <RequestForm open={showForm} handleCloseForm={handleCloseForm} requestID={reqID} handleRejectRequest={handleRejectRequest}  setComponentInMain={props.setComponentInMain} />


        </div >
    );
}
