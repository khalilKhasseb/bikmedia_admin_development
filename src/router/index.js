import { createRouter, createWebHistory } from 'vue-router';
import templateRoutes from './modules/template';
import Home from '../views/index.vue';
import store from '../store';
import giftRoutes from './modules/gift';
import { clearAuthStorage, getAuthToken } from '../utils/auth-storage';

// Vue.use(VueRouter);
// import { createApp } from 'vue';
// const app = createApp();
// app.use(createRouter);

const routes = [
    //dashboard
    {
        path: '/', 
        name: 'Home', 
        component: Home, 
        meta: {
            requireAuth: true
        }
    },
    ...giftRoutes,
    ...templateRoutes,
    
];

const router = new createRouter({
    // mode: 'history',
    history: createWebHistory(),
    linkExactActiveClass: 'active',
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { left: 0, top: 0 };
        }
    },
});

router.beforeEach((to, from, next) => {
    if (to.meta && to.meta.layout && to.meta.layout == 'auth') {
        store.commit('setLayout', 'auth');
    } else {
        store.commit('setLayout', 'app');
    }
    next(true);
});

router.beforeEach(async (to, from, next) => {
    /**
     * Enhanced Authentication Guard
     * 
     * Flow:
     * 1. Check Vuex store for authentication state (primary source of truth)
     * 2. Validate token expiration for localStorage logins
     * 3. Prevent authenticated users from accessing auth pages (login, register, etc.)
     * 4. Protect routes requiring authentication with returnUrl support
     * 5. Fallback to storage check if Vuex state hasn't been initialized yet
     */
    
    // Step 1: Check Vuex store authentication state
    let isAuthenticated = store.getters['auth/isAuthenticated'];
    const isTokenExpired = store.getters['auth/isTokenExpired'];
    
    // Step 2: Handle expired tokens
    if (isAuthenticated && isTokenExpired) {
        // Token has expired, clear all auth data
        clearAuthStorage();
        store.commit('auth/setIsAuthenticated', false);
        store.commit('auth/setUser', null);
        store.commit('auth/setTokenExpiresAt', null);
        isAuthenticated = false;
    }
    
    // Step 3: Prevent authenticated users from accessing auth pages
    if (to.meta && to.meta.layout === 'auth') {
        if (isAuthenticated) {
            // User is already logged in, redirect to home
            return next('/');
        }
    }
    
    // Step 4: Protect routes requiring authentication
    if (to.meta && to.meta.requireAuth) {
        if (isAuthenticated) {
            // User is authenticated and token is valid
            return next();
        }
        
        // Fallback: Initialize auth state from storage if Vuex hasn't been initialized
        // Retrieve and decrypt auth token from storage as fallback (in case Vuex state hasn't been initialized yet)
        const token = getAuthToken();
        if (token) {
            // Dispatch initializeAuth to restore Vuex state from storage
            await store.dispatch('auth/initializeAuth');
            
            // Re-evaluate authentication state after initialization
            isAuthenticated = store.getters['auth/isAuthenticated'];
            const isExpired = store.getters['auth/isTokenExpired'];
            
            if (isAuthenticated && !isExpired) {
                // Token is valid, allow access
                return next();
            }
            
            // Token is invalid or expired, clear and redirect
            clearAuthStorage();
            store.commit('auth/setIsAuthenticated', false);
            store.commit('auth/setUser', null);
            store.commit('auth/setTokenExpiresAt', null);
        }
        
        // User is not authenticated, redirect to login with returnUrl
        return next({
            path: '/auth/login',
            query: { returnUrl: to.fullPath }
        });
    }
    
    // Step 5: Allow access to public routes
    next();
});




export default router;
