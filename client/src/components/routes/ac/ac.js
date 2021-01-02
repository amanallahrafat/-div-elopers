import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DateRangeIcon from '@material-ui/icons/DateRange';
import axios from "axios";
import { Component } from "react";
import { Redirect } from 'react-router-dom';
import setAuthToken from "../../../actions/setAuthToken";

const requestUserProfile = async () => {
    const userProfile = await axios.get('/viewProfile');
    return userProfile.data;
}

const requestAttendanceRecods = async () => {
    const attendanceRecords = await axios.get('/viewAttendance');
    return attendanceRecords.data;
}

class Academic_Member_List extends Component {
    state = {
        isLoggedIn: 0,
        componentInMain: <div />
    }

    handleSchedule = async (event) => {
        this.props.setComponentInMain("schedule")
    }

    async componentDidMount() {
        if (!localStorage.getItem('auth-token')) {
            this.setState({ isLoggedIn: 1 });
            return;
        }
        try {
            setAuthToken(localStorage.getItem('auth-token'));
            await axios.get('/authStaffMember');
            this.setState({ isLoggedIn: 2 });
        }
        catch (err) {
            this.setState({ isLoggedIn: 1 });
        }
    }

    render() {
        if (this.state.isLoggedIn === 0)
            return <div />;
        if (this.state.isLoggedIn === 1) {
            return <Redirect to='/' />;
        }
        return (
            <div >
                <List>
                    <ListItem button>
                        <ListItemIcon><DateRangeIcon /></ListItemIcon>
                        <ListItemText primary="Schedule" onClick={this.handleSchedule} />
                    </ListItem>
                </List>
            </div>
        )
    }
}

export default Academic_Member_List;