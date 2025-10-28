export default [
    {
        path: '/store/gifts',
        name: 'gifts',
        component: () => import(/* webpackChunkName: "gifts" */ '../../views/bikmedia/store/gifts.vue'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/store/gift/create',
        name: 'gift-create',
        component: () => import(/* webpackChunkName: "gift-create" */ '../../views/bikmedia/store/gift/GiftCreate.vue'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/store/gift/:id/edit',
        name: 'gift-edit',
        component: () => import(/* webpackChunkName: "gift-edit" */ '../../views/bikmedia/store/gift/GiftEdit.vue'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/store/gift/:id/view',
        name: 'gift-view',
        component: () => import(/* webpackChunkName: "gift-view" */ '../../views/bikmedia/store/gift/GiftView.vue'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/store/equipments',
        name: 'equipments',
        component: () => import(/* webpackChunkName: "equipments" */ '../../views/bikmedia/store/equipments.vue'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/store/equipment/create',
        name: 'equipment-create',
        component: () => import(/* webpackChunkName: "equipment-create" */ '../../views/bikmedia/store/equipment/EquipmentCreate.vue'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/store/equipment/:id/edit',
        name: 'equipment-edit',
        component: () => import(/* webpackChunkName: "equipment-edit" */ '../../views/bikmedia/store/equipment/EquipmentEdit.vue'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/store/equipment/:id/view',
        name: 'equipment-view',
        component: () => import(/* webpackChunkName: "equipment-view" */ '../../views/bikmedia/store/equipment/EquipmentView.vue'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/store/levels',
        name: 'levels',
        component: () => import(/* webpackChunkName: "levels" */ '../../views/bikmedia/store/levels.vue'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/store/level/:id/view',
        name: 'level-view',
        component: () => import(/* webpackChunkName: "level-view" */ '../../views/bikmedia/store/level/LevelView.vue'),
        meta: {
            requireAuth: true
        }
    }
];