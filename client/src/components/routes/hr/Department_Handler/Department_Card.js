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
import AddDepartmentForm from './Add_Department_Form';
import EditDepartmentForm from './Edit_Department_Form';

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

export default function Department_Card(props) {
    const [openEdit, setOpenEdit] = React.useState(false);

    const [openUpdateDepartment, setOpenUpdateDepartment] = React.useState(false);
    const [openAddDepartment, setOpenAddDepartment] = React.useState(false);
    
    const [updatedDepartment, setUpdatedDepartment] = React.useState({});

    const handleOpenEdit = (event) => {
        setOpenUpdateDepartment(true);
    }
    const handleCloseEdit = () => {
        setOpenUpdateDepartment(false);
    }

    const handleOpenAdd = () => {
        setOpenAddDepartment(true);
    }

    const handleCloseAdd = () => {
        setOpenAddDepartment(false);
    }

    const handleDeleteDepartment = async (event) => {
        try{
            const res = await axios.delete(`/hr/deleteDepartment/${event.currentTarget.id.split('_')[1]}`);
            props.setComponentInMain("department");
            props.openAlert("Department deleted Successfully!" , "success");
        }
        catch(err){
            props.openAlert(err.response.data);
        }
    }

    const handleUpdateDepartment = async (event) => {
        const departmentID = event.currentTarget.id.split('_')[1];
        const department = props.departments.filter(l => l.ID == departmentID);
        setUpdatedDepartment(department[0]);
        setOpenUpdateDepartment(true);
    }

    const getHODName = (department , memberNames) =>{
        console.log(memberNames);
        if(department.hodID == null) return undefined;
        const hod = memberNames.filter(elm => elm.ID == department.hodID );
        if( hod.length == 1)
            return hod[0].name;
        else
            return undefined;
    }

    const classes = useStyles();
    return (
        <div>
            <Container maxWidth="lg">
                <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(https://i.pinimg.com/originals/94/f6/41/94f641161d1d124c6bfa2463c7feb8d4.jpg)` }}>
                    <div className={classes.overlay} />
                </Paper>

                <Typography className={classes.title} variant="h5" component="div">
                    <b>Departments</b>
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
                        props.departments.map(department =>
                            <Grid item xs={12} md={4}>
                                <CardActionArea component="a" disabled={false}>
                                    <Card className={classes.card}>
                                        <div className={classes.cardDetails}>
                                            <CardContent>
                                                <Typography variant="subtitle1" paragraph>
                                                    <b>Name:</b> {department.name}<br />
                                                    <b>Head of Department:</b> {getHODName(department,department.memberNames)}<br />
                                                    <b>Members:</b> <br/> {
                                                        department.memberNames.length > 0 ? department.memberNames.map(m =>
                                                            <Chip key={m.ID} label={m.name} className={classes.chip} /> 
                                                        ) : undefined
                                                    }<br />
                                                </Typography>
                                            </CardContent>
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                id={"DELETE_" + department.ID}
                                                color='primary'
                                                onClick={handleDeleteDepartment}
                                            >
                                                <DeleteIcon style={{ fontSize: 25, opacity: 0.8 }}
                                                />
                                            </IconButton>
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                id={"UPDATE_" + department.ID}
                                                color='primary'
                                                onClick={handleUpdateDepartment}
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
            <EditDepartmentForm
                open={openUpdateDepartment}
                handleCloseEdit={handleCloseEdit}
                department={updatedDepartment}
                academicMembers = {props.academicMembers}
                openAlert = {props.openAlert}
                setComponentInMain={props.setComponentInMain} />
            <AddDepartmentForm
                open={openAddDepartment}
                handleCloseAdd={handleCloseAdd}
                academicMembers = {props.academicMembers}
                openAlert = {props.openAlert}
                setComponentInMain={props.setComponentInMain} />
        </div >
    );
}
