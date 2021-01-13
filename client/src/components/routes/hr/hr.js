import { Container } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import clsx from "clsx";
import { Component } from "react";
import { Redirect } from "react-router-dom";
import setAuthToken from "../../../actions/setAuthToken";
import Attendance from "../../Attendance";
import Navigation_Bar from "../../Navigation_Bar.js";
import Profile from "../../Profile";
import Course_Card from "./Course_Handler/Course_Card";
import Department_Card from "./Department_Handler/Department_Card";
import Faculty_Card from "./Faculty_Handler/Faculty_Card";
import Location_Card from "./Location_Handler/Location_Card";
import StaffMember_Card from "./StaffMember_Handler/StaffMember_Card";
import ViewMissingDaysForm from '../../ViewMissingDaysForm.js';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AlertMessage from '../../Alert_Message.js';

const requestUserProfile = async () => {
  const userProfile = await axios.get("/viewProfile");
  return userProfile.data;
};

const requestAttendanceRecods = async () => {
  const attendanceRecords = await axios.get("/viewAttendance");
  return attendanceRecords.data;
};

const requestAllLocations = async () => {
  const locations = await axios.get("/hr/viewAllLocations");
  return locations.data;
};

const requestAllFacutlies = async () => {
  let faculties = (await axios.get("/hr/viewAllFaculties")).data;
  faculties = faculties.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
  return faculties;
};

const requestAllDepartments = async () => {
  const departments = await axios.get("/hr/viewAllDepartments");
  return departments.data;
};

const requestAllAcademicMembers = async () => {
  const members = await axios.get("/hr/viewAllStaffMembers");
  return members.data.filter((elm) => elm.type == 0);
};

const requestAllCourses = async () => {
  let courses = await axios.get("/hr/viewAllCourses");
  courses = courses.data.sort((a, b) => a.ID - b.ID);
  return courses;
};

const viewAllMembersProfiles = async () => {
  return (await axios.get("/hr/viewAllMembersProfiles")).data;
};

const requestAllOffices = async () => {
  let locations = await axios.get("/hr/viewAllLocations");
  console.log(locations);
  locations = locations.data.filter((elm) => elm.type == 2);
  return locations;
};

const requestStaffMembersWithMissingDays = async () => {
  return (await axios.get("/hr/viewStaffMembersWithMissingDays")).data;
}

const requestStaffMembersWithMissingHours = async () => {
  return (await axios.get("/hr/viewStaffMembersWithMissingHours")).data;
}

const requestMissingDays = async () => {
  const res = await axios.get('/viewMissingDays');
  const dates = res.data;
  const mappedDates = [];
  for (const date of dates) {
    mappedDates.push({ date: (new Date(date)).toLocaleString() + "" })
  }
  console.log(mappedDates);
  return mappedDates;
}

const drawerWidth = 240;
const styles = (theme) => ({
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
});
class HR extends Component {
  state = {
    isLoggedIn: 0,
    locations: [],
    faculties: [],
    departments: [],
    courses: [],
    staffMembers: [],
    firstTimeLocations: true,
    firstTimeFaculties: true,
    firstTimeDepartments: true,
    firstTimeCourses: true,
    firstTimeStaffMembers: true,
    componentInMain: <div />,
    isAppBarShift: false,
    showAlert: false,
    alertMessage: "",
    errorType : "",
    backdropIsOpen: true,
  };

  handleAppBarShift = (event) => {
    this.setState({ isAppBarShift: event });
    console.log(this.state.isAppBarShift);
  };

  // decision => 0 for add , 1 for update, 2 for delete
  handleLocations = async (obj, decision) => {
    if (this.state.firstTimeLocations) {
      console.log("first time location", obj, decision);
      this.setState({ firstTimeLocations: false });
      const locations = await requestAllLocations();
      locations.sort((a, b) => a.ID - b.ID);
      this.setState({ locations: locations });
      return locations;
    }
    else if (decision == 0) {
      const locations = this.state.locations;
      locations.push(obj);
      locations.sort((a, b) => a.ID - b.ID);
      this.setState({ locations: locations });
    }
    else if (decision == 1) {
      const newLocations = this.state.locations.filter(elm => elm.ID != obj.ID);
      newLocations.push(obj);
      newLocations.sort((a, b) => a.ID - b.ID);
      this.setState({ locations: newLocations });
    }
    else if (decision == 2) {
      const newLocations = this.state.locations.filter(elm => elm.ID != obj.ID);
      this.setState({ locations: newLocations });
    }
  };

  handleFaculties = async (obj, decision) => {
    if (this.state.firstTimeFaculties) {
      console.log("first time faculty", obj, decision);
      this.setState({ firstTimeFaculties: false });
      const faculties = await requestAllFacutlies();
      faculties.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      this.setState({ faculties: faculties });
      return faculties;
    }
    else if (decision == 0) {
      const faculties = this.state.faculties;
      faculties.push(obj);
      faculties.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      this.setState({ faculties: faculties });
    }
    else if (decision == 1) {
      const newFaculties = this.state.faculties.filter(elm => elm.name != obj.oldName);
      delete obj.oldName;
      newFaculties.push(obj);
      newFaculties.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      this.setState({ faculties: newFaculties });
    }
    else if (decision == 2) {
      const newFaculties = this.state.faculties.filter(elm => elm.name != obj.name);
      this.setState({ faculties: newFaculties });
    }
  }

  // handleDepartments = async (obj, decision) => {
  //   if (this.state.firstTimeDepartments) {
  //     console.log("first time department", obj, decision);
  //     this.setState({ firstTimeDepartments: false });
  //     const departments = await requestAllDepartments();
  //     departments.sort((a, b) => a.ID - b.ID);
  //     this.setState({ departments: departments });
  //     return departments;
  //   }
  //   else if (decision == 0) {
  //     const departments = this.state.departments;
  //     departments.push(obj);
  //     departments.sort((a, b) => a.ID - b.ID);
  //     this.setState({ departments: departments });
  //   }
  //   else if (decision == 1) {
  //     const newDepartments = this.state.departments.filter(elm => elm.ID != obj.ID);
  //     newDepartments.push(obj);
  //     newDepartments.sort((a, b) => a.ID - b.ID);
  //     this.setState({ departments: newDepartments });
  //   }
  //   else if (decision == 2) {
  //     const newDepartments = this.state.departments.filter(elm => elm.ID != obj.ID);
  //     this.setState({ departments: newDepartments });
  //   }
  // }

    openAlert = (message , type = "error") => {
      this.setState({ showAlert: true, alertMessage: message, errorType : type });
  }


  setComponentInMain = async (event) => {
    console.log("aman");
    console.log(event);
    this.setState({ backdropIsOpen: true });

    await this.handleLocations();

    if (event == "viewMissingDays") {
      await this.setState({
        componentInMain: (
          <ViewMissingDaysForm
            missedDays={await requestMissingDays()}
          />
        )
      })
    }
    else if (event == "profile") {
      await this.setState({
        componentInMain: (
          <Profile
            profile={await requestUserProfile()}
            setComponentInMain={this.setComponentInMain}
            openAlert = {this.openAlert}
          />
        ),
      });
    } else if (event == "location") {
      await this.setState({
        componentInMain: (
          <Location_Card
            locations={this.state.locations}
            handleLocations={this.handleLocations}
            setComponentInMain={this.setComponentInMain}
            openAlert = {this.openAlert}
          />
        ),
      });
    } else if (event == "attendance") {
      await this.setState({
        componentInMain: (
          <Attendance
            attendanceRecords={await requestAttendanceRecods()}
            setComponentInMain={this.setComponentInMain}
            openAlert = {this.openAlert}
          />
        ),
      });
    } else if (event == "faculty") {
      await this.setState({
        componentInMain: (
          <Faculty_Card
            faculties={await requestAllFacutlies()}
            departments={await requestAllDepartments()}
            handleFaculties={this.handleFaculties}
            setComponentInMain={this.setComponentInMain}
            openAlert = {this.openAlert}
          />
        ),
      });
    } else if (event == "department") {
      await this.setState({
        componentInMain: (
          <Department_Card
            departments={await requestAllDepartments()}
            academicMembers={await requestAllAcademicMembers()}
            setComponentInMain={this.setComponentInMain}
            openAlert = {this.openAlert}
          />
        ),
      });
    } else if (event == "course") {
      await this.setState({
        componentInMain: (
          <Course_Card
            courses={await requestAllCourses()}
            departments={await requestAllDepartments()}
            academicMembers={await requestAllAcademicMembers()}
            setComponentInMain={this.setComponentInMain}
            openAlert = {this.openAlert}
          />
        ),
      });
    } else if (event == "staffMember") {
      await this.setState({
        componentInMain: (
          <StaffMember_Card
            departments={await requestAllDepartments()}
            staffMembers={await viewAllMembersProfiles()}
            offices={await requestAllOffices()}
            staffMembersWithMissingDays={await requestStaffMembersWithMissingDays()}
            staffMembersWithMissingHours={await requestStaffMembersWithMissingHours()}
            setComponentInMain={this.setComponentInMain}
            openAlert = {this.openAlert}
          />
        ),
      });
    }
    this.setState({ backdropIsOpen: false })
  };

  async componentDidMount() {
    this.setState({ backdropIsOpen: true })

    if (!localStorage.getItem("auth-token")) {
      this.setState({ isLoggedIn: 1 });
      return;
    }
    try {
      //setAuthToken(localStorage.getItem("auth-token"));
      console.log("before auth staff")
      await axios.get("/authStaffMember");
      console.log("after auth staff")
      await axios.get("/authHr");
      console.log("after auth hr")

      this.setState({ isLoggedIn: 2 });
    } catch (err) {
      this.setState({ isLoggedIn: 1 });
    }

    this.setState({ backdropIsOpen: false })
  }

  render() {
    const { classes } = this.props;
    if (this.state.isLoggedIn === 0) return <div />;
    if (this.state.isLoggedIn === 1) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <div>
          <Navigation_Bar
            handleAppBarShift={this.handleAppBarShift}
            fromParent={this.setComponentInMain}
            openAlert = {this.openAlert}
          />
          <Container
            maxWidth="lg"
            style={{ marginTop: "100px" }}
            className={clsx({
              [classes.appBarShift]: this.state.isAppBarShift,
            })}
          >
            {this.state.componentInMain}
          </Container>
        </div>
        <AlertMessage open={this.state.showAlert} type={this.state.errorType} onClose={() => { this.setState({ showAlert: false }) }}
          msg={this.state.alertMessage} />
        <Backdrop className={classes.backdrop} open={this.state.backdropIsOpen}
          style={{ zIndex: 600000000 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }
}

export default withStyles(styles)(HR);
