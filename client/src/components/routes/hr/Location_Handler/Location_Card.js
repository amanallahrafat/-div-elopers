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
import AddLocationForm from './Add_Location_Form';
import EditLocationForm from './Edit_Location_Form';


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

export default function Location_Card(props) {
    const [openEdit, setOpenEdit] = React.useState(false);

    const [openUpdateLocation, setOpenUpdateLocation] = React.useState(false);
    const [updatedLocation, setUpdatedLocation] = React.useState({});
    const [openAddLocation, setOpenAddLocation] = React.useState(false);


    const handleOpenEdit = (event) => {
        setOpenUpdateLocation(true);
    }
    const handleCloseEdit = () => {
        setOpenUpdateLocation(false);
    }

    const handleOpenAdd = () => {
        setOpenAddLocation(true);
    }

    const handleCloseAdd = () => {
        setOpenAddLocation(false);
    }

    const handleDeleteLocation = async (event) => {
        const deletedID = event.currentTarget.id.split('_')[1];
        try{
            const res = await axios.delete(`/hr/deleteLocation/${deletedID}`);
            props.handleLocations({ID : deletedID},2);
            props.setComponentInMain("location");
            props.openAlert("Location deleted Successfully!","success");
        }
        catch(err){
            props.openAlert(err.response.data);
        }
    }

    const handleUpdateLocation = async (event) => {
        const locationID = event.currentTarget.id.split('_')[1];
        const location = props.locations.filter(l => l.ID == locationID);
        setUpdatedLocation(location[0]);
        setOpenUpdateLocation(true);
    }

    const classes = useStyles();
    return (
        <div>
            <Container maxWidth="lg">

                <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(https://i.pinimg.com/originals/94/f6/41/94f641161d1d124c6bfa2463c7feb8d4.jpg)` }}>
                    <div className={classes.overlay} />

                </Paper>

                <Typography className={classes.title} variant="h5" component="div">
                    <b>Locations</b>
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
                        props.locations.map(location =>
                            <Grid item xs={12} md={4}>
                                    <Card className={classes.card}>
                                        <div className={classes.cardDetails}>
                                            <CardContent>
                                                <Typography variant="subtitle1" paragraph>
                                                    <b>Name:</b> {location.name}<br />
                                                    <b>Capacity:</b> {location.capacity}<br />
                                                    <b>Type:</b> {location.type === 0 ?
                                                        "Hall" : location.type === 1 ? "Tutorial room" :
                                                            location.type === 2 ? "Office" : "Lab"}

                                                </Typography>
                                            </CardContent>
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                id={"DELETE_" + location.ID}
                                                color='primary'
                                                onClick={handleDeleteLocation}
                                            >
                                                <DeleteIcon style={{ fontSize: 25, opacity: 0.8 }}
                                                />
                                            </IconButton>
                                            <IconButton
                                                aria-label="account of current user"
                                                aria-haspopup="true"
                                                id={"UPDATE_" + location.ID}
                                                color='primary'
                                                onClick={handleUpdateLocation}
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
            <EditLocationForm
                open={openUpdateLocation}
                handleOpenEdit={handleOpenEdit}
                handleCloseEdit={handleCloseEdit}
                location={updatedLocation}
                handleLocations = {props.handleLocations}
                openAlert = {props.openAlert}
                setComponentInMain={props.setComponentInMain} />
            <AddLocationForm
                open={openAddLocation}
                handleOpenAdd={handleOpenAdd}
                handleCloseAdd={handleCloseAdd}
                handleLocations = {props.handleLocations}
                openAlert = {props.openAlert}
                setComponentInMain={props.setComponentInMain} />
        </div >
    );
}
