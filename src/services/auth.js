/**
 * Author: Khalil Khasseb
 * Date: 2025-10-24
 * Version: 1.0.0
 */

import http from './http';
import store from '../store';
import router from '../router';
/**
 * 
 * @param {*} username 
 * @param {*} password 
 * @returns {authToken , UserData}
 */
/**
 * Logs in a user with the provided username and password.
 * If the login is successful, the response is destructured to only return the user data.
 * @param {string} username The username to log in with.
 * @param {string} password The password to log in with.
 * @returns {Promise<Object>} A promise that resolves with the user data if the login is successful.
 */
const login = async (username, password) => {
    try {
        // once user is on login page we will check if the user is already logged in || flush the storage and do a fresh login
        const user = localStorage.getItem('user');
        if (user) {
            localStorage.removeItem('user');
        }
        const response = await http.post('/auth/login', {
            username: username,
            password: password,
            lang: "ar"
        });
        // If the response is ok, then perform the storage to local storage and the store
        if (response.status === 200) {
            // now destrucutre the response to only return the token and user data
            // for now we will return only the user in the user object
            // and the user object is not on local storage
            // we need to handle storage of the user data
            const { user } = response.data;
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('authToken', response.data.user.token);
            }
            
            return user || null;
        }
    } catch (error) {
        if (error.response) {
            console.log(`login failed: ${error.response.data}`);
        } else {
            console.log('login failed: network error');
        }
    }
};

const logout = () => {
    // return http.post('/logout');
    // log lout bu flush all user from local storage
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    store.commit('auth/setUser', null);
    store.commit('auth/setIsAuthenticated', false);
    router.push('/auth/login');
};

export default {
    login,
    logout,
};
