import axios from 'axios';

const instance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use(
    (config) => {
        const isAuthRequest = config.url.includes('/auth/');
        if (!isAuthRequest) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.token) {
                config.headers['Authorization'] = 'Bearer ' + user.token;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;
