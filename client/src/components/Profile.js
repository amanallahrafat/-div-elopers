import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import EditProfileForm from './editProfileForm';
import AddExtraInfoForm from './addExtraInfoForm';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import axios from 'axios';
import AlertMessage from './Alert_Message.js';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Collapse } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
},
}));

export default function MainFeaturedPost(props) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openExtraInfo, setOpenExtraInfo] = React.useState(false);
  const [backdropIsOpen, setBackdropIsOpen] = React.useState(false);

  const handleOpenEdit = (event) => {
    setOpenEdit(true);
  }
  const handleCloseEdit = () => {
    setOpenEdit(false);
  }

  const handleOpenAddExtraInfo = () => {
    setOpenExtraInfo(true);
  }
  const handleCloseExtraInfo = () => {
    setOpenExtraInfo(false);
  }

  const calculateSalary = async () => {
    const salary = props.profile.salary;
  }

  const handleDeleteExtraInfo = async (event) => {
    setBackdropIsOpen(true);
    const newInfo = props.profile.extraInfo.filter((info, idx) => {
      return idx != event.currentTarget.id;
    })

    const req = { extraInfo: newInfo };
    try{
      const res = await axios.post('updateMyProfile', req);
      props.setComponentInMain("profile");
      props.openAlert(res.data,"success");
    }catch(err){
      props.openAlert(err.response.data);
    }
    setBackdropIsOpen(false);
  }

  const classes = useStyles();
  return (
    <div>
      <Container maxWidth="lg">

        <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(https://i.pinimg.com/originals/94/f6/41/94f641161d1d124c6bfa2463c7feb8d4.jpg)` }}>
          {/* Increase the priority of the hero background image */}
          {<img style={{ display: 'none' }} />}
          <div className={classes.overlay} />
          <Grid container  style = {{textAlign: 'left', padding: "25px"}}>  
            <Grid item md={6}>
              <div className={classes.mainFeaturedPostContent}>
                <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                  {props.profile.name}
                </Typography>
                <Typography variant="h5" color="inherit" paragraph>
                  ID: {(props.profile.type == 1 ? 'hr-' : 'ac-') + props.profile.ID}
                </Typography>
                <Typography variant="h6" color="inherit" paragraph>
                  Office Number: {props.profile.officeID}
                </Typography>
                <Typography variant="h6" color="inherit" paragraph>
                  Email: {props.profile.email}
                </Typography>
                <Link variant="subtitle1" href="#">
                </Link>
              </div>
            </Grid>

            <Grid item md={6} style={{ textAlign: 'right' }}>
              <IconButton
                // edge="end"
                aria-label="account of current user"
                //   aria-controls={menuId}
                aria-haspopup="true"
                id='profile'
                // onClick={this.handleViewProfile}
                color='primary'
                //style={{color:'black'}}
                onClick={handleOpenEdit}
              >
                <EditIcon style={{ fontSize: 30, opacity: 1 }}
                />
              </IconButton>

            </Grid>

          </Grid>
        </Paper>
        <Grid container spacing={4} >
          <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <div className={classes.cardDetails}>
                  <CardContent >
                    <Typography variant="subtitle1" paragraph>
                      <b>Gender:</b> {props.profile.gender}<br />
                      <b>Day off:</b> {props.profile.dayOff}<br />
                      <b>Salary:</b> {props.profile.salary}<br />
                      <b>Current Month Salary:</b> {calculateSalary()}<br />
                      <b>Annual Balance:</b> {props.profile.annualBalance}<br />
                      <b>Accidental Leave Balance:</b> {props.profile.accidentalLeaveBalance}<br />
                      <Collapse in ={localStorage.getItem("type") != 1}>
                      <b>Department: </b>{props.profile.department}<br />
                      </Collapse>
                    </Typography>                    
                  </CardContent>
                </div>
              </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* <CardActionArea component="a" href="#" disabled={false}> */}
            <Card className={classes.card}>
              <div className={classes.cardDetails}>
                <CardContent>
                  <Typography  variant="subtitle1" paragraph>
                    <b>Extra Information:</b>

                    <IconButton
                      aria-label="account of current user"
                      aria-haspopup="true"
                      color='primary'

                      onClick={handleOpenAddExtraInfo}
                    >
                      <AddCircleIcon style={{ fontSize: 25, opacity: 0.8 }}
                      />
                    </IconButton>
                    <br />
                    {props.profile.extraInfo.map((i, idx) => {
                      return (
                        <div>
                          {i}
                          <IconButton
                            disabled={false}
                            aria-label="account of current user"
                            aria-haspopup="true"
                            id={"" + idx}
                            color='primary'
                            onClick={handleDeleteExtraInfo}
                          >
                            <DeleteIcon style={{ fontSize: 25, opacity: 0.8 }}
                            />
                          </IconButton>
                        </div>
                      )
                    })}
                  </Typography>
                </CardContent>
              </div>
              <Hidden xsDown>
                <CardMedia className={classes.cardMedia} title={"SARAH"} />
              </Hidden>
            </Card>
            {/* </CardActionArea> */}
          </Grid>
        </Grid>
      </Container>
      <AddExtraInfoForm open={openExtraInfo} openAlert={props.openAlert} handleOpenEdit={handleOpenAddExtraInfo} handleCloseEdit={handleCloseExtraInfo} profile={props.profile} setComponentInMain={props.setComponentInMain} />
      <EditProfileForm open={openEdit} openAlert={props.openAlert} handleOpenEdit={handleOpenEdit} handleCloseEdit={handleCloseEdit} profile={props.profile} setComponentInMain={props.setComponentInMain} />
      <Backdrop className={classes.backdrop} open={backdropIsOpen}
        style={{ zIndex: 600000000 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div >
  );
}
