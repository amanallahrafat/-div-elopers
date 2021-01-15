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
import AddFacultyForm from './Add_Faculty_Form';
import EditFacultyForm from './Edit_Faculty_Form';

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

export default function Faculty_Card(props) {
    const [openEdit, setOpenEdit] = React.useState(false);

    const [openUpdateFaculty, setOpenUpdateFaculty] = React.useState(false);
    const [updatedFaculty, setUpdatedFaculty] = React.useState({});
    const [openAddFaculty, setOpenAddFaculty] = React.useState(false);


    const handleOpenEdit = (event) => {
        setOpenUpdateFaculty(true);
    }
    const handleCloseEdit = () => {
        setOpenUpdateFaculty(false);
    }

    const handleOpenAdd = () => {
        setOpenAddFaculty(true);
    }

    const handleCloseAdd = () => {
        setOpenAddFaculty(false);
    }


    const handleDeleteFaculty = async (event) => {
        const deletedName = event.currentTarget.id.split('_')[1];
        const res = await axios.delete(`/hr/deleteFaculty/${deletedName}`);
       // props.handleFaculties({name : deletedName },2);
        props.setComponentInMain("faculty");
        props.openAlert("Faculty deleted Successfully!" , "success");
    }

    const handleUpdateFaculty = async (event) => {
        const facultyName = event.currentTarget.id.split('_')[1];
        const faculty = props.faculties.filter(l => l.name == facultyName);
        setUpdatedFaculty(faculty[0]);
        setOpenUpdateFaculty(true);
    }

    const classes = useStyles();
    console.log(props.faculties);
    return (
        <div>
            <Container maxWidth="lg">

                <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(https://i.pinimg.com/originals/94/f6/41/94f641161d1d124c6bfa2463c7feb8d4.jpg)` }}>
                    <div className={classes.overlay} />

                </Paper>

                <Typography className={classes.title} variant="h5" component="div">
                    <b>Faculties</b>
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
                        props.faculties.map(faculty =>
                            <Grid item xs={12} md={4}>
                                    <Card className={classes.card}>
                                        <div className={classes.cardDetails}>
                                            <CardContent>
                                                <Typography variant="subtitle1" paragraph>
                                                    <b>Name:</b> {faculty.name}<br />
                                                    <b>Departments:</b> {
                                                        faculty.departments?.map(d =>
                                                            <Chip key={d.ID} label={d.name} className={classes.chip} />
                                                        )
                                                    }<br />
                                                </Typography>
                                            </CardContent>
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                id={"DELETE_" + faculty.name}
                                                color='primary'
                                                onClick={handleDeleteFaculty}
                                            >
                                                <DeleteIcon style={{ fontSize: 25, opacity: 0.8 }}
                                                />
                                            </IconButton>
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                id={"UPDATE_" + faculty.name}
                                                color='primary'
                                                onClick={handleUpdateFaculty}
                                            >
                                                <EditIcon style={{ fontSize: 30, opacity: 1 }}
                                                />
                                            </IconButton>
                                        </div>
                                    </Card>
                            </Grid>
                        )
                    }
                </Grid>
            </Container>
            <EditFacultyForm
                open={openUpdateFaculty}
                handleOpenEdit={handleOpenEdit}
                handleCloseEdit={handleCloseEdit}
                faculty={updatedFaculty}
                departments={props.departments}
                handleFaculties = {props.handleFaculties}
                openAlert = {props.openAlert}
                setComponentInMain={props.setComponentInMain} />
            <AddFacultyForm
                open={openAddFaculty}
                handleOpenAdd={handleOpenAdd}
                handleCloseAdd={handleCloseAdd}
                departments = {props.departments}
                handleFaculties = {props.handleFaculties}
                openAlert = {props.openAlert}
                setComponentInMain={props.setComponentInMain} />
        </div >
    );
}
