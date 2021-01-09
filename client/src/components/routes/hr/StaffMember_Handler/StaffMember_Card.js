import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
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
import { Collapse } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';
import TodayIcon from '@material-ui/icons/Today';
import { deepPurple } from '@material-ui/core/colors';
import Tooltip from '@material-ui/core/Tooltip';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Switch from '@material-ui/core/Switch';
import AddStaffMemberForm from './Add_StaffMember_Form';
import EditStaffMemberForm from './Edit_StaffMember_Form';
import AttendanceRecordForm from './AttendanceRecord_Form';
import AddMissingSignInOutForm from './Add_Missing_SignIn_Out_Form';


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
    Avatar: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        marginBottom : "20px",
        margin : "auto",
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
      },
}));

export default function StaffMember_Card(props) {
    const [openEdit, setOpenEdit] = React.useState(false);

    const [openUpdate, setOpenUpdate] = React.useState(false);
    const [updatedStaffMember, setUpdatedStaffMember] = React.useState({});
    const [attendanceView , setAttendanceView] = React.useState(null);
    const [openAdd, setOpenAdd] = React.useState(false);
    const [openAttendance , setOpenAttendance] = React.useState(false);
    const [openUpdateSession , setOpenUpdateSession] = React.useState(false);
    const [updatedStaffMemberSession , setUpdatedStaffMemberSession] = React.useState({});
    const [viewMissingDays, setViewMissingDays] = React.useState(false);
    const [viewMissingHours, setViewMissingHours] = React.useState(false);
    
    const handleChangeMissingDays = async (event) => {
        setViewMissingDays(event.target.checked);
    };

    const handleChangeMissingHours = async (event) => {
        setViewMissingHours(event.target.checked);
    };

    const handleOpenUpdateSession = (event) =>{
        setOpenUpdateSession(true);
    }

    const handleCloseUpdateSession = (event) =>{
        setOpenUpdateSession(false);
    }

    const handleOpenEdit = (event) => {
        setOpenUpdate(true);
    }
    const handleCloseEdit = () => {
        setOpenUpdate(false);
    }

    const handleOpenAdd = () => {
        setOpenAdd(true);
    }

    const handleCloseAdd = () => {
        setOpenAdd(false);
    }

    const handleOpenAttendance = () => {
        setOpenAttendance(true);
    }

    const handleCloseAttendance = () => {
        setOpenAttendance(false);
    }


    const handleDelete = async (event) => {
        try{
            const memberID = event.currentTarget.id.split('_')[2];
            const type = event.currentTarget.id.split('_')[1];
            const res = await axios.delete(`/hr/deleteStaffMember/${memberID}/${type}`);
            props.setComponentInMain("staffMember");
            props.openAlert("Staff Member has been deleted Successfully!","success");
        }
        catch(err){
            props.openAlert(err.response.data);
        }
    }

    const handleUpdate = async (event) => {
        const memberID = event.currentTarget.id.split('_')[2];
        const type = event.currentTarget.id.split('_')[1];
        const member = props.staffMembers.filter(l => l.ID == memberID && l.type == type );
        setUpdatedStaffMember(member[0]);
        setOpenUpdate(true);
    }

    const handleUpdateSession = async (event) => {
        const memberID = event.currentTarget.id.split('_')[2];
        const type = event.currentTarget.id.split('_')[1];
        const member = props.staffMembers.filter(l => l.ID == memberID && l.type == type );
        setUpdatedStaffMemberSession(member[0]);
        setOpenUpdateSession(true);
    }

    const handleAttendance = async (event) =>{
        const memberID = event.currentTarget.id.split('_')[2];
        const type = event.currentTarget.id.split('_')[1];
        const attendanceRecords = await axios.get(`/hr/viewStaffMemberAttendance/${memberID}/${type}`);
        console.log(attendanceRecords.data);
        setAttendanceView(attendanceRecords.data);
        setOpenAttendance(true);
    }

    const getOfficeName = (ID) =>{
        const office = props.offices.filter(elm => elm.ID == ID);
        return office.length > 0 ? office[0].name : undefined;
    }

    const getDepartmentName = (ID) =>{
        const dep = props.departments.filter(elm => elm.ID == ID);
        return dep.length > 0 ? dep[0].name : undefined;
    }

    const getViewedMembers = () =>{
        if(viewMissingDays && !viewMissingHours) return props.staffMembersWithMissingDays;
        else if(!viewMissingDays && viewMissingHours) return props.staffMembersWithMissingHours;
        else if( viewMissingDays && viewMissingHours){
            setViewMissingDays(false);setViewMissingHours(false);
            return props.staffMembers;
        }
        else return props.staffMembers;
    }

    const classes = useStyles();
    
    return (
        <div>
            <Container maxWidth="lg">

                <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(https://i.pinimg.com/originals/94/f6/41/94f641161d1d124c6bfa2463c7feb8d4.jpg)` }}>
                    <div className={classes.overlay} />

                </Paper>

                <Typography className={classes.title} variant="h5" component="div">
                    <b>Staff Members</b>
                    <Tooltip title="Add new Staff Member">
                    <IconButton
                        aria-label="account of current user"
                        aria-haspopup="true"
                        color='primary'
                        onClick={handleOpenAdd}
                    >
                        <AddCircleIcon style={{ fontSize: 25, opacity: 0.8 }}
                        />
                    </IconButton>
                    </Tooltip>
                    <Tooltip title = "View Staff Members with Missing Days">
                    <Switch
                        checked={viewMissingDays}
                        onChange={handleChangeMissingDays}
                        name="viewMissingDays"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                    </Tooltip>
                    <Tooltip title = "View Staff Members with Missing Hours">
                    <Switch
                        checked={viewMissingHours}
                        onChange={handleChangeMissingHours}
                        name="viewMissingHours"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                    </Tooltip>
                </Typography>

                <Grid container spacing={4} >
                    {
                        getViewedMembers().map(staffMember =>
                            <Grid item xs={12} md={6}>
                                    <Card className={classes.card}>
                                        <div className={classes.cardDetails}>
                                            <CardContent style={{paddingBottom:"0px",paddingLeft:"0px"}}>
                                                <Typography variant="subtitle1" paragraph style={{marginBottom:"0px"}}>
                                                    <Box display="flex" flexDirection="row" >
                                                        <Box width="40%" style={{margin:"auto",textAlign:"center"}}>
                                                            <Avatar src="/broken-image.jpg" className={classes.Avatar}>{staffMember.name.substring(0, 2).toUpperCase()}</Avatar>
                                                            <b> {staffMember.name}</b><br />
                                                        </Box>
                                                        <Box width="30%">
                                                            <b>Email: </b><a href={"mailto:"+staffMember.email}>{staffMember.email}</a> <br />
                                                            <b>Day Off: </b> {staffMember.dayOff}<br />
                                                            <b>Gender: </b> {staffMember.gender}<br />
                                                            <b>Office: </b> {getOfficeName(staffMember.officeID)}<br />
                                                            <b>Salary: </b> {staffMember.salary}<br />
                                                            <Collapse in = {staffMember.type == 0} >
                                                                <b>Department: </b> {getDepartmentName(staffMember.departmentID)}<br />
                                                            </Collapse>
                                                        </Box>
                                                        <Box width="30%">
                                                        <b>Extra Info:</b><br />
                                                        {staffMember.extraInfo.map(elm =>{
                                                            return(
                                                                <div>{elm}</div>
                                                            )
                                                        })} 
                                                        </Box>
                                                    </Box>
                                                </Typography>
                                            </CardContent>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    aria-label="account of current user"
                                                    aria-haspopup="true"
                                                    id={"DELETE_"+staffMember.type+"_" + staffMember.ID}
                                                    color='primary'
                                                    onClick={handleDelete}
                                                    style={{paddingRight : "0px"}}
                                                >
                                                    <DeleteIcon style={{ fontSize: 25, opacity: 0.8,padding:"0px" }}
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Update">
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                id={"UPDATE_"+staffMember.type+"_" + staffMember.ID}
                                                color='primary'
                                                onClick={handleUpdate}
                                                style={{paddingRight : "0px"}}
                                            >
                                                <EditIcon style={{ fontSize: 30, opacity: 1 ,padding:"0px"}}
                                                />
                                            </IconButton>
                                            </Tooltip>
                                            <Tooltip title="view Attendance Record">
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                id={"viewAttendance_"+staffMember.type+"_" + staffMember.ID}
                                                color='primary'
                                                onClick={handleAttendance}
                                                style={{paddingRight : "0px"}}
                                            >
                                                <TodayIcon style={{ fontSize: 30, opacity: 1 ,padding:"0px"}} />
                                            </IconButton>
                                            </Tooltip>
                                            <Collapse 
                                            style = {{display : "inline-block"}}
                                            in = {!(staffMember.ID == localStorage.getItem("ID") && staffMember.type == localStorage.getItem("type"))}>
                                                <Tooltip title="Add Missing Sessions">
                                                <IconButton
                                                    aria-label="account of current user"
                                                    aria-haspopup="true"
                                                    id={"viewAttendance_"+staffMember.type+"_" + staffMember.ID}
                                                    color='primary'
                                                    onClick={handleUpdateSession}
                                                    style={{paddingRight : "0px"}}
                                                >
                                                    <ExitToAppIcon style={{ fontSize: 30, opacity: 1 ,padding:"0px"}} />
                                                </IconButton>
                                                </Tooltip>
                                            </Collapse>
                                        </div>
                                    </Card>
                            </Grid>
                        )
                    }
                </Grid>
            </Container>
            <EditStaffMemberForm
                open={openUpdate}
                handleCloseEdit={handleCloseEdit}
                staffMember={updatedStaffMember}
                offices = {props.offices}
                departments = {props.departments}
                openAlert = {props.openAlert}
                setComponentInMain={props.setComponentInMain} />
            <AddStaffMemberForm
                open={openAdd}
                handleOpenEdit={handleOpenEdit}
                handleOpenAdd={handleOpenAdd}
                handleCloseAdd={handleCloseAdd}
                offices = {props.offices}
                departments = {props.departments}
                openAlert = {props.openAlert}
                setComponentInMain={props.setComponentInMain} />
            <AttendanceRecordForm
                open={openAttendance}
                handleOpenAttendance={handleOpenAttendance}
                handleCloseAttendance={handleCloseAttendance}
                attendanceRecords = {attendanceView}
                setComponentInMain={props.setComponentInMain} /> 
            <AddMissingSignInOutForm
                open = {openUpdateSession}
                handleOpenUpdateSession = {handleOpenUpdateSession}
                handleCloseUpdateSession = {handleCloseUpdateSession}
                staffMember = {updatedStaffMemberSession}
                openAlert = {props.openAlert}
                setComponentInMain = {props.setComponentInMain}
            />  
        </div >
    );
}
