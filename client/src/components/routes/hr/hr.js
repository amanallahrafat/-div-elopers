import { Component } from "react";
import Navigation_Bar from '../../Navigation_Bar.js';
import { Redirect } from 'react-router-dom';
import axios from "axios";
import setAuthToken from "../../../actions/setAuthToken";
import Profile from '../../Profile';
import Location_Card from './Location_Card'

const requestUserProfile = async () => {
    const userProfile = await axios.get('/viewProfile');
    return userProfile.data;
}

const requestAllLocations = async () => {
    const locations = await axios.get('/hr/viewAllLocations');
    return locations.data;
}

class HR extends Component {
    state = {
        isLoggedIn: 0,
        'componentInMain': <div />
    }

    setComponentInMain = async (event) => {
        console.log("hello")
        if (event == "profile") {
            this.setState({
                'componentInMain': <Profile
                    profile={await requestUserProfile()}
                    setComponentInMain={this.setComponentInMain} />
            });
        }
        else if (event == "location") {
            this.setState({
                'componentInMain': <Location_Card
                    locations={await requestAllLocations()}
                    setComponentInMain={this.setComponentInMain} />
            });
        }
    }

    async componentDidMount() {
        if (!localStorage.getItem('auth-token')) {
            this.setState({ isLoggedIn: 1 });
            return;
        }
        try {
            setAuthToken(localStorage.getItem('auth-token'));
            await axios.get('/authStaffMember');
            await axios.get('/authHr');

            this.setState({ isLoggedIn: 2 });
        }
        catch (err) {
            this.setState({ isLoggedIn: 1 });
        }
    }

    render() {
        console.log(this.props.location);
        if (this.state.isLoggedIn === 0)
            return <div />;
        if (this.state.isLoggedIn === 1) {
            return <Redirect to='/' />;
        }
        return (
            <div >
                <Navigation_Bar fromParent={this.setComponentInMain} />
                {this.state.componentInMain}
            </div>
        )
    }
}

export default HR;