import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import DepartmentCoursesCard from "./departmentCoursesCard";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.common.black
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
let scheduleObj = {
    'saturday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
    'sunday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
    'monday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
    'tuesday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
    'wednesday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
    'thurseday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
    'friday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
}


function mapToScheduleObj(courseSchedule) {
    scheduleObj = {
        'saturday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
        'sunday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
        'monday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
        'tuesday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
        'wednesday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
        'thurseday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
        'friday': [[<div />], [<div />], [<div />], [<div />], [<div />]],
    }
    console.log("course schedule ", courseSchedule);
    if (!courseSchedule || !scheduleObj) return;
    rows = [];
    for (const entry of courseSchedule) {
        scheduleObj[entry.day][entry.slotNumber - 1].push(
            <DepartmentCoursesCard
                instructorName={entry.instructor}
                instructorID={entry.instructorID}
                locationName={entry.locationName}
            />
        )
    }

    for (const entry in scheduleObj) {
        // rows.push(createData(entry, scheduleObj[entry][0], scheduleObj[entry][1],
        //     scheduleObj[entry][2], scheduleObj[entry][3], scheduleObj[entry][4],
        //     scheduleObj[entry][5], scheduleObj[entry][6]));
        // console.log(entry,scheduleObj[entry][0],entry[2],entry[3]);
        rows.push(createData(entry, makeCard(scheduleObj[entry][0]), makeCard(scheduleObj[entry][1]),
            makeCard(scheduleObj[entry][2]), makeCard(scheduleObj[entry][3]), makeCard(scheduleObj[entry][4]),
            makeCard(scheduleObj[entry][5]), makeCard(scheduleObj[entry][6])));

    }
}
const makeCard = (arrayOfCards) => {
    if (!arrayOfCards) return (<Box></Box>)
    return (<Grid container display="flex" direction="column" justifyContent="space-between">
        {arrayOfCards.map((card) => (
            <Grid item>{card}<br/></Grid>)
        )
        }
    </Grid>)
}



function createData(day, first, second, third, fourth, fifth) {
    return { day, first, second, third, fourth, fifth };
}

let rows = [];

const useStyles = makeStyles({
    table: {
        minWidth: 700
    }, root: {
        flexGrow: 1,
    },
    tableRightBorder : { borderWidth: 1, borderColor: 'rgba(128,128,128,0.2)',borderStyle: 'solid' }

});

export default function CustomizedTables(props) {
    const classes = useStyles();
    const [selectedCourse, setSelectedCourse] = React.useState({
        courseID: "loading ID",
        courseName: "select a course first",
        courseCode: "select a course first",
        courseSlots: [],
        courseCoverage: "select a course first"

    })
    // React.useEffect(() => {
    //     mapToScheduleObj(selectedCourse.courseSlots);
    //   }, [selectedCourse]);
    // mapToScheduleObj(selectedCourse?.courseSlots);
    console.log("props.allCourses", props.allCourses);
    console.log("props.departmentCourses", props.departmentCourses)
    return (
        <TableContainer component={Paper} style={{border:'1px'}}>
            <Grid container
                className={classes.root}
                direction="column"
                justify="center"
                alignItems="center"
            >
                <br/>
                <Grid item >
                    <b>Course name: </b>{selectedCourse.courseName}<br />
                   <b>Course code: </b>{selectedCourse.courseCode}<br />
                    <b>Course coverage: </b>{selectedCourse.courseCoverage}<br />


                </Grid>
                <br/>
                <Grid item>
                    <Autocomplete
                        id="filterDepartmentCourses"
                        options={props.allCourses}

                        getOptionLabel={(option) => option.name}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Filter by course" variant="outlined" />}

                        onChange={(event, newValue) => {
                            if (newValue && newValue.ID) {
                                console.log("all cors in props ", props.depart);
                                const sc = props.departmentCourses.find((c) => {
                                    return c.courseID == newValue.ID
                                });
                                mapToScheduleObj(sc?.courseSlots);
                                setSelectedCourse(sc);
                                console.log("selected course from list ", newValue.ID, " selected from props", sc)


                            }
                        }}
                    />
                </Grid>
                <br/>
            </Grid>

            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow >
                        <StyledTableCell>&nbsp;</StyledTableCell>
                        <StyledTableCell align="center"><b>First Slot</b></StyledTableCell>
                        <StyledTableCell align="center"><b>Second Slot</b></StyledTableCell>
                        <StyledTableCell align="center"><b>Third Slot</b></StyledTableCell>
                        <StyledTableCell align="center"><b>Fourth Slot</b></StyledTableCell>
                        <StyledTableCell align="center"><b>Fifth Slot</b></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row.name} >
                            <StyledTableCell component="th" scope="row">
                                <b>{row.day.charAt(0).toUpperCase() + row.day.slice(1)}</b>
                            </StyledTableCell>
                            <StyledTableCell align="center" className={classes.tableRightBorder} >{row.first}</StyledTableCell>
                            <StyledTableCell align="center" className={classes.tableRightBorder}>{row.second}</StyledTableCell>
                            <StyledTableCell align="center" className={classes.tableRightBorder}>{row.third}</StyledTableCell>
                            <StyledTableCell align="center" className={classes.tableRightBorder}>{row.fourth}</StyledTableCell>
                            <StyledTableCell align="center" >{row.fifth}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
