import { Component } from "react";
import Navigation_Bar from '../../Navigation_Bar.js';
import { Redirect } from 'react-router-dom';
import axios from "axios";
import setAuthToken from "../../../actions/setAuthToken";
import Profile from '../../Profile';

const requestUserProfile = async()=>{
    const userProfile = await axios.get('/viewProfile');
    console.log(userProfile.data);
  return userProfile.data;
}

class HOD extends Component {
    state = {
        isLoggedIn: 0,
        // componentInMain: (<button>Sarah</button>)
        componentInMain: <div />
    }

    setComponentInMain = async (event)=>{
        if(event=="profile"){
            this.setState({componentInMain: <Profile profile = {await requestUserProfile()}/>});
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
            //alert("Please Login!");
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

export default HOD;