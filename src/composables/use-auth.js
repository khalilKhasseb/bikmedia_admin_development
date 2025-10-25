// this fill will handel the auth state for the application it will retrun isAuthenticated and user

export const useAuth = () => {
    const isAuthenticated = ref(false);
    const user = ref(null);

    const login = () => {
        isAuthenticated.value = true;
    };

    const logout = () => {
        isAuthenticated.value = false;
    };

    return {
        isAuthenticated,
        user,
        login,
        logout,
    };
};
