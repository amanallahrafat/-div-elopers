import axios from "axios";
import setAuthToken from "./setAuthToken.js";

export const login = async userData => {
    var user, token;
    user = await axios.post('/login', userData);
    if (user.headers['auth-token'])
        token = user.headers['auth-token'];
    if (!token)
        throw new Error("Wrong Email or Password");
    localStorage.clear();
     localStorage.setItem("auth-token", token);
    localStorage.setItem("type",user.data.type);
    localStorage.setItem("ID",user.data.ID);
    localStorage.setItem("academicMemberType",user.data.academicMemberType);

    setAuthToken(token);
    return {
        type: user.data.type,
        academicMemberType: user.data.academicMemberType,
        firstLogin : user.data.firstLogin
    };
};
