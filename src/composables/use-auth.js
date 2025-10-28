// this file will handle the auth state for the application it will return isAuthenticated and user
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import authService from '../services/auth';

export const useAuth = () => {
    const store = useStore();

    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    const user = computed(() => store.getters['auth/getUser']);
    const rememberMe = computed(() => store.getters['auth/getRememberMe']);

    return {
        isAuthenticated,
        user,
        rememberMe,
        login: authService.login,
        logout: authService.logout,
    };
};
