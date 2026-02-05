import api from './api';

const register = (username, password) => {
    console.log("DEBUG: Registering user", username);
    return api.post('/auth/signup', {
        username,
        password,
    });
};

const login = (username, password) => {
    console.log("DEBUG: Logging in user", username);
    return api
        .post('/auth/signin', {
            username,
            password,
        })
        .then((response) => {
            if (response.data.token) {
                console.log("DEBUG: Token received, saving to local storage");
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    console.log("DEBUG: Logging out");
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    // console.log("DEBUG: Getting current user", user); // Commented out to reduce noise
    return user;
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
