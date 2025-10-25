export default {
    namespaced: true,
    state: {
        is_authenticated: false,
        user: null,
    },
    mutations: {
        setIsAuthenticated(state, value) {
            state.is_authenticated = value;
        },
        setUser(state, value) {
            state.user = value;
        },
    },
    actions: {
        // login({ commit }, { username, password }) {
        //     commit('setIsAuthenticated', true);
        // },
    },
    getters: {
        isAuthenticated: (state) => state.is_authenticated,
        getUser: (state) => state.user,
    },
}