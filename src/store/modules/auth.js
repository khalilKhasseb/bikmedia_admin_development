import { clearAuthStorage, getAuthToken, getStoredUser } from '../../utils/auth-storage';

export default {
    namespaced: true,
    state: {
        is_authenticated: false,
        user: null,
        rememberMe: false,
        storageType: 'session',
        tokenExpiresAt: null,
    },
    mutations: {
        setIsAuthenticated(state, value) {
            state.is_authenticated = value;
        },
        setUser(state, value) {
            state.user = value;
        },
        setRememberMe(state, value) {
            state.rememberMe = value;
        },
        setStorageType(state, value) {
            state.storageType = value;
        },
        setTokenExpiresAt(state, value) {
            state.tokenExpiresAt = value;
        },
    },
    actions: {
        /**
         * Initializes authentication state from browser storage on app load.
         * Checks both sessionStorage and localStorage for existing tokens and restores the complete auth state to Vuex.
         * @param {Object} context - Vuex action context
         * @param {Function} context.commit - Vuex commit function
         */
        async initializeAuth({ commit }) {
            // Retrieve and decrypt token from storage
            const token = getAuthToken();
            
            // If no token is found in either storage, return early
            if (!token) {
                return;
            }
            
            // Determine which storage type was used (for rememberMe state)
            const storageType = sessionStorage.getItem('authToken') ? 'session' : 'local';
            
            // Retrieve and parse user data from storage
            const userData = getStoredUser();
            
            if (!userData) {
                // Clear corrupted state if token exists but user data doesn't
                clearAuthStorage();
                return;
            }
            
            // Check token expiration for localStorage logins
            if (storageType === 'local') {
                const authExpiresAt = localStorage.getItem('authExpiresAt');
                const expiresAt = parseInt(authExpiresAt, 10);
                
                // If token is expired, clear storage and return early
                if (expiresAt && Date.now() > expiresAt) {
                    clearAuthStorage();
                    return;
                }
            }
            
            // Clean up the non-selected storage to avoid conflicts
            const nonSelectedStorage = storageType === 'session' ? localStorage : sessionStorage;
            nonSelectedStorage.removeItem('authToken');
            nonSelectedStorage.removeItem('user');
            
            // Restore auth state to Vuex
            commit('setIsAuthenticated', true);
            commit('setUser', userData);
            commit('setRememberMe', storageType === 'local');
            commit('setStorageType', storageType);
            
            // Restore token expiration timestamp
            if (storageType === 'local') {
                const authExpiresAt = localStorage.getItem('authExpiresAt');
                const expiresAt = parseInt(authExpiresAt, 10);
                commit('setTokenExpiresAt', expiresAt || null);
            } else {
                commit('setTokenExpiresAt', null);
            }
            
            // TODO: Optional - validate token with backend API endpoint when available
            // Example implementation:
            // const isValid = await validateToken(token);
            // if (!isValid) {
            //     // Clear invalid token
            //     clearAuthStorage();
            //     commit('setIsAuthenticated', false);
            //     commit('setUser', null);
            // }
        },
    },
    getters: {
        isAuthenticated: (state) => state.is_authenticated,
        getUser: (state) => state.user,
        getRememberMe: (state) => state.rememberMe,
        getStorageType: (state) => state.storageType,
        getTokenExpiresAt: (state) => state.tokenExpiresAt,
        isTokenExpired: (state) => {
            // Session-based logins don't expire
            if (state.tokenExpiresAt === null || state.storageType === 'session') {
                return false;
            }
            // Check if current time exceeds expiration timestamp
            return Date.now() > state.tokenExpiresAt;
        },
    },
}