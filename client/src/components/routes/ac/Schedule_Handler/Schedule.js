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
    'saturday': [<div />, <div />, <div />, <div />, <div />],
    'sunday': [<div />, <div />, <div />, <div />, <div />],
    'monday': [<div />, <div />, <div />, <div />, <div />],
    'tuesday': [<div />, <div />, <div />, <div />, <div />],
    'wednesday': [<div />, <div />, <div />, <div />, <div />],
    'thursday': [<div />, <div />, <div />, <div />, <div />],
    'friday': [<div />, <div />, <div />, <div />, <div />],
}

let scheduleObjWithReplacement = {
    'saturday': [[], [], [], [], []],
    'sunday': [[], [], [], [], []],
    'monday': [[], [], [], [], []],
    'tuesday': [[], [], [], [], []],
    'wednesday': [[], [], [], [], []],
    'thursday': [[], [], [], [], []],
    'friday': [[], [], [], [], []],
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

function mapToScheduleObj(courseSchedule,
    replacementRequests,
    replacementRequestsRecieved,
    recievedFlag,
    sentFlag,
    senderObj,
    props
) {

    scheduleRow = [];
    scheduleRowWithReplacement = [];

    scheduleObj = {
        'saturday': [<div />, <div />, <div />, <div />, <div />],
        'sunday': [<div />, <div />, <div />, <div />, <div />],
        'monday': [<div />, <div />, <div />, <div />, <div />],
        'tuesday': [<div />, <div />, <div />, <div />, <div />],
        'wednesday': [<div />, <div />, <div />, <div />, <div />],
        'thursday': [<div />, <div />, <div />, <div />, <div />],
        'friday': [<div />, <div />, <div />, <div />, <div />],
    }

    scheduleObjWithReplacement = {
        'saturday': [[], [], [], [], []],
        'sunday': [[], [], [], [], []],
        'monday': [[], [], [], [], []],
        'tuesday': [[], [], [], [], []],
        'wednesday': [[], [], [], [], []],
        'thursday': [[], [], [], [], []],
        'friday': [[], [], [], [], []],
    }

    for (const entry of courseSchedule) {
        const card = <Schedule_Slot_Card
            setComponentInMain={props.setComponentInMain}

            courseName={entry.courseName}
            locationName={entry.slot.locationName}
            courseID={entry.courseID}
            slotNumer={entry.slot.slotNumber}
            slotDay={entry.slot.day}
            slotID={entry.slot.ID}

            cardType="regularSlot"
            setBackdropIsOpen={props.setBackdropIsOpen}
        />;
        scheduleObj[entry.slot.day][entry.slot.slotNumber - 1] = card;

        scheduleObjWithReplacement[entry.slot.day][entry.slot.slotNumber - 1].push(card);
    }

    if (recievedFlag) {
        for (const entry of replacementRequests) {
            console.log(entry);
            if (entry.slot == null) continue;
            scheduleObjWithReplacement[entry.slot.day][entry.slot.slotNumber - 1].push(
                <Schedule_Slot_Card
                    setComponentInMain={props.setComponentInMain}

                    courseName={entry.courseName}
                    locationName={entry.locationName}
                    courseID={entry.courseID}
                    slotNumer={entry.slot.slotNumber}
                    slotDay={entry.slot.day}
                    slotID={entry.slot.ID}

                    cardType="replacement"
                    courseInstructor={entry.senderName}
                    requestedDate={entry.requestedDate}
                    requestID={entry.ID}
                    requestStatus={entry.status}

                    setBackdropIsOpen={props.setBackdropIsOpen}
                />
            );
        }
    }
    if (sentFlag) {
        for (const entry of replacementRequestsRecieved) {
            console.log("entry", entry);
            if (entry.slot == null) continue;
            scheduleObjWithReplacement[entry.slot.day][entry.slot.slotNumber - 1].push(
                <Schedule_Slot_Card
                    setComponentInMain={props.setComponentInMain}

                    courseName={entry.courseName}
                    locationName={entry.locationName}
                    courseID={entry.courseID}
                    slotNumer={entry.slot.slotNumber}
                    slotDay={entry.slot.day}
                    slotID={entry.slot.ID}

                    cardType="replacement_sent"
                    courseInstructor={senderObj}
                    requestedDate={entry.requestedDate}
                    requestID={entry.ID}
                    requestStatus={entry.status}

                    setBackdropIsOpen={props.setBackdropIsOpen}
                />
            );
        }
    }

    console.log("with replacement", scheduleObjWithReplacement);

    for (const entry in scheduleObj) {
        // console.log(entry);
        scheduleRow.push(createData(entry, scheduleObj[entry][0], scheduleObj[entry][1],
            scheduleObj[entry][2], scheduleObj[entry][3], scheduleObj[entry][4],
            scheduleObj[entry][5], scheduleObj[entry][6]));
    }

    for (const entry in scheduleObjWithReplacement) {
        // console.log(entry);
        scheduleRowWithReplacement.push(createData(entry, makeCard(scheduleObjWithReplacement[entry][0]), makeCard(scheduleObjWithReplacement[entry][1]),
            makeCard(scheduleObjWithReplacement[entry][2]), makeCard(scheduleObjWithReplacement[entry][3]), makeCard(scheduleObjWithReplacement[entry][4]),
            makeCard(scheduleObjWithReplacement[entry][5]), makeCard(scheduleObjWithReplacement[entry][6])));
    }
}
function createData(day, first, second, third, fourth, fifth) {
    return { day, first, second, third, fourth, fifth };
}

let scheduleRow = [];
let scheduleRowWithReplacement = [];

const useStyles = makeStyles({
    table: {
        minWidth: 700
    },
    tableRightBorder:
        { borderWidth: 1, borderColor: 'rgba(128,128,128,0.2)', borderStyle: 'solid' }
});

export default function CustomizedTables(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        checkedA: false,
        checkedB: false,
    });

    const [isViewingReplacementRequest, setIsViewingReplacementRequest] = React.useState(false);
    const [isViewingSentReplacementRequest, setIsViewingSentReplacementRequest] = React.useState(false);

    mapToScheduleObj(props.schedule,
        props.replacementRequests,
        props.sentReplacementRequests,
        isViewingReplacementRequest,
        isViewingSentReplacementRequest,
        props.senderObj,
        props,
    );

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        setIsViewingReplacementRequest(!isViewingReplacementRequest);
        console.log(isViewingReplacementRequest);
    };

    const handleChangeSent = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        setIsViewingSentReplacementRequest(!isViewingSentReplacementRequest);
        console.log(isViewingSentReplacementRequest);
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: "30px" }} >
            <Grid container justify="flex-end">
                <FormGroup row >
                    <FormControlLabel
                        control={
                            <Switch checked={state.checkedA}
                                onChange={handleChange} name="checkedA"
                                color="primary"
                            />}
                        label="View Received Replacement Requests"
                        style={{ align: "right" }}

                    />
                    <br />
                    <FormControlLabel
                        control={
                            <Switch checked={state.checkedB}
                                onChange={handleChangeSent} name="checkedB"
                                color="primary"
                            />}
                        label="View Sent Replacement Requests"
                        style={{ align: "right" }}

                    />
                </FormGroup>
            </Grid>
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
                        {(isViewingReplacementRequest||isViewingSentReplacementRequest ? scheduleRowWithReplacement : scheduleRow).map((row) => (
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
        </Container>
    );
}
