export default [
    {
        path: '/git',
        name: 'git',
        component: () => import(/* webpackChunkName: "git" */ '../../views/git.vue'),
    },
];