/**
 * Author: Khalil Khasseb
 * Date: 2025-10-24
 * Version: 1.0.0
*/
import axios from 'axios';

const http = axios.create({
    baseURL: "/api",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'API-KEY': "q25etr-as568-er9855-85rtg-45g56",
        "Auth-Token":"dZaMZ423sb0Nv6TtlbwoD2oKR7"
    },
});

http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Auth-token'] = String(token);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default http;