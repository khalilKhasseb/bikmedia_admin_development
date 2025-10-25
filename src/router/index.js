import { createRouter, createWebHistory } from 'vue-router';
import templateRoutes from './modules/template';
import Home from '../views/index.vue';
import store from '../store';

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

router.beforeEach((to, from, next) => {
    /**
     * 
     * The sequence of the code is as follows
     * 1. Check if the route requires authentication
     * 2. If the route requires authentication, check if the user is authenticated
     * 3. If the user is authenticated, allow the user to access the route
     * 4. If the user is not authenticated, redirect the user to the login page
     */
    if (to.meta && to.meta.requireAuth) {
        const token = localStorage.getItem('authToken');
        // const { token } = user;
        if (token) {
            next();
        } else {
            next('/auth/login');
        }
    } else {
        next();
    }
});




export default router;
