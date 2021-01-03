import { Container } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import Schedule_Slot_Card from "./Schedule_Slot_Card";

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
    }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover
        }
    }
}))(TableRow);
const scheduleObj = {
    'saturday': [<div />, <div />, <div />, <div />, <div />],
    'sunday': [<div />, <div />, <div />, <div />, <div />],
    'monday': [<div />, <div />, <div />, <div />, <div />],
    'tuesday': [<div />, <div />, <div />, <div />, <div />],
    'wednesday': [<div />, <div />, <div />, <div />, <div />],
    'thurseday': [<div />, <div />, <div />, <div />, <div />],
    'friday': [<div />, <div />, <div />, <div />, <div />],
}
function mapToScheduleObj(courseSchedule) {
    rows = [];
    for (const entry of courseSchedule) {
        scheduleObj[entry.slot.day][entry.slot.slotNumber - 1] =
            <Schedule_Slot_Card
                courseName={entry.courseName}
                locationName={entry.slot.locationName}
                courseID={entry.courseID}
                slotNumer={entry.slot.slotNumber}
                slotDay={entry.slot.day}
                slotID = {entry.slot.ID}
           />
    }
    for (const entry in scheduleObj) {
        console.log(entry);
        rows.push(createData(entry, scheduleObj[entry][0], scheduleObj[entry][1],
            scheduleObj[entry][2], scheduleObj[entry][3], scheduleObj[entry][4],
            scheduleObj[entry][5], scheduleObj[entry][6]));
    }
}
function createData(day, first, second, third, fourth, fifth) {
    return { day, first, second, third, fourth, fifth };
}

let rows = [];

const useStyles = makeStyles({
    table: {
        minWidth: 700
    }
});

export default function CustomizedTables(props) {
    const classes = useStyles();
    mapToScheduleObj(props.schedule);
    return (
        <Container maxWidth = "lg"  style={{marginTop:"30px"}} >
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
                    {rows.map((row) => (
                        <StyledTableRow key={row.name}>
                            <StyledTableCell component="th" scope="row">
                                <b>{row.day.charAt(0).toUpperCase() + row.day.slice(1)}</b>
                            </StyledTableCell>
                            <StyledTableCell align="center">{row.first}</StyledTableCell>
                            <StyledTableCell align="center">{row.second}</StyledTableCell>
                            <StyledTableCell align="center">{row.third}</StyledTableCell>
                            <StyledTableCell align="center">{row.fourth}</StyledTableCell>
                            <StyledTableCell align="center">{row.fifth}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </Container>
    );
}
