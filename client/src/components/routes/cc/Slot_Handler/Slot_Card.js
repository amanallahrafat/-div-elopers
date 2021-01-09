import { Box, Container } from "@material-ui/core";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Switch from '@material-ui/core/Switch';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import React from "react";
import axios from 'axios';
import Schedule_Slot_Card from "./Schedule_SLot_Card.js";
import AddSlotForm from './Add_Slot_Form';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.common.black,
    },
    body: {
        "&:first-child ": {
            backgroundColor: theme.palette.primary.light,
        },
        fontSize: 14
    },

}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover
        }
    }
}))(TableRow);

let scheduleObj = {
    'saturday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
    'sunday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
    'monday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
    'tuesday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
    'wednesday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
    'thursday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
    'friday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
}

const makeCard = (arrayOfCards) => {
    //return (<Box></Box>)
    if (!arrayOfCards) return (<Box></Box>)
    const g = (<Grid container display="flex" direction="column" justifyContent="space-between">
        {arrayOfCards.map((card) => (
            <Grid item>{card}<br /></Grid>)
        )
        }
    </Grid>);
    return g;
}

function mapToScheduleObj(prop) {
    
    scheduleObj = {
        'saturday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
        'sunday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
        'monday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
        'tuesday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
        'wednesday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
        'thursday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
        'friday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
    }
    
    if (!prop.schedule || !scheduleObj) return;

    scheduleRow = [];
    for (const entry of prop.schedule) {
        console.log(entry);
        const card = <Schedule_Slot_Card
            slot = {entry}
            courseID = {prop.courseID}
            cardType="regularSlot"
            locations = {prop.locations}
            academicMembers = {prop.academicMembers}
            handleSlots = {prop.handleSlots}
            openAlert = {prop.openAlert}
            setComponentInMain={prop.setComponentInMain}
        />;
        scheduleObj[entry.day][entry.slotNumber - 1].push(card);
    }

    for (const entry in scheduleObj) {
        scheduleRow.push(createData(entry, makeCard(scheduleObj[entry][0]), makeCard(scheduleObj[entry][1]),
            makeCard(scheduleObj[entry][2]), makeCard(scheduleObj[entry][3]), makeCard(scheduleObj[entry][4]),
            makeCard(scheduleObj[entry][5]), makeCard(scheduleObj[entry][6])));
    }
    return scheduleRow;
}
function createData(day, first, second, third, fourth, fifth) {
    return { day, first, second, third, fourth, fifth };
}

let scheduleRow = [];

const useStyles = makeStyles({
    table: {
        minWidth: 700
    },
    tableRightBorder:
        { borderWidth: 1, borderColor: 'rgba(128,128,128,0.2)', borderStyle: 'solid' }
});

export default function CustomizedTables(props) {
    const classes = useStyles();
    scheduleRow = mapToScheduleObj(props);
    const [openAddSlot, setOpenAddSlot] = React.useState(false);

    const handleOpenAdd = () => {
        setOpenAddSlot(true);
    }

    const handleCloseAdd = () => {
        setOpenAddSlot(false);
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: "30px" }} >
            <Typography className={classes.title} variant="h5" component="div">
                    <b>Course Slots</b>
                    <IconButton
                        aria-label="account of current user"
                        aria-haspopup="true"
                        color='primary'
                        onClick={handleOpenAdd}
                    >
                        <AddCircleIcon style={{ fontSize: 25, opacity: 0.8 }}
                        />
                    </IconButton>
                </Typography><br/>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>&nbsp;</StyledTableCell>
                            <StyledTableCell align="center"><b>First Period</b></StyledTableCell>
                            <StyledTableCell align="center"><b>Second Period</b></StyledTableCell>
                            <StyledTableCell align="center"><b>Third Period</b></StyledTableCell>
                            <StyledTableCell align="center"><b>Fourth Period</b></StyledTableCell>
                            <StyledTableCell align="center"><b>Fifth Period</b></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(scheduleRow).map((row) => (
                            <StyledTableRow key={row.name}>
                                <StyledTableCell component="th" scope="row">
                                    <b>{row.day.charAt(0).toUpperCase() + row.day.slice(1)}</b>
                                </StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableRightBorder}>{row.first}</StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableRightBorder}>{row.second}</StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableRightBorder}>{row.third}</StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableRightBorder}>{row.fourth}</StyledTableCell>
                                <StyledTableCell align="center" className={classes.tableRightBorder}>{row.fifth}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <AddSlotForm
                open={openAddSlot}
                handleOpenAdd={handleOpenAdd}
                handleCloseAdd={handleCloseAdd}
                handleSlots = {props.handleSlots}
                locations = {props.locations}
                courseID = {props.courseID}
                openAlert = {props.openAlert}
                setComponentInMain={props.setComponentInMain} />
        </Container>
    );
}
