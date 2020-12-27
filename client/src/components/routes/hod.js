import { Component } from "react";
import Navigation_Bar from '../Navigation_Bar';
import { Redirect } from 'react-router-dom';
import axios from "axios";

class HOD extends Component {
    state = {
        // TODO
    }

    async componentDidMount(){
        if(!localStorage.getItem('auth-token'))
            return <Redirect to='/' />;
        try{
            await axios.get('/authStaffMember');
        }
        catch(err){
            alert("Please Login.");
            return <Redirect to='/' />;
        }
    }

    render() {
        console.log(localStorage.getItem('auth-token'));
        if (!localStorage.getItem('auth-token')) {
            alert("Please Login!");
            return <Redirect to='/' />;
        }
        return (
            <div>
                <Navigation_Bar />
            </div>
        )
    }
}
export default HOD;