import axios from "axios";
import setAuthToken from "./setAuthToken.js";

export const login = async userData => {
    var user, token;
    user = await axios.post('/login', userData);
    if (user.headers['auth-token'])
        token = user.headers['auth-token'];
    if (!token)
        throw new Error("Wrong Email or Password")
    localStorage.setItem("auth-token", token);
    setAuthToken(token);
    return {
        type: user.data.type,
        academicMemberType: user.data.academicMemberType
    };
};
