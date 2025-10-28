<template>
    <!-- Single Nav Item -->
    <li v-if="item.type === 'single'" class="menu" :class="{ 'active': isActive }">
        <router-link 
            v-if="!item.external" 
            :to="item.to" 
            class="dropdown-toggle" 
            @click="$emit('toggle-mobile')"
        >
            <div class="">
                <span v-html="item.icon" v-if="item.icon"></span>
                <span>{{ getLabel(item.label) }}</span>
            </div>
            <span v-if="item.badge" :class="`badge badge-${item.badge.color || 'primary'} ms-auto`">
                {{ item.badge.text }}
            </span>
        </router-link>
        <a 
            v-else 
            :href="item.to" 
            target="_blank" 
            class="dropdown-toggle"
            @click="$emit('toggle-mobile')"
        >
            <div class="">
                <span v-html="item.icon" v-if="item.icon"></span>
                <span>{{ getLabel(item.label) }}</span>
            </div>
            <span v-if="item.badge" :class="`badge badge-${item.badge.color || 'primary'} ms-auto`">
                {{ item.badge.text }}
            </span>
        </a>
    </li>

    <!-- Group Nav Item (with children) -->
    <li v-else-if="item.type === 'group' && item.children && item.children.length > 0" class="menu">
        <a 
            class="dropdown-toggle" 
            data-bs-toggle="collapse" 
            :data-bs-target="`#${item.id}`" 
            :aria-controls="item.id" 
            aria-expanded="false"
        >
            <div class="">
                <span v-html="item.icon" v-if="item.icon"></span>
                <span>{{ getLabel(item.label) }}</span>
            </div>
            <div>
                <span v-html="chevronRight"></span>
            </div>
        </a>
        <ul 
            :id="item.id" 
            class="collapse submenu list-unstyled" 
            :data-bs-parent="parentId"
        >
            <nav-item
                v-for="(child, index) in item.children"
                :key="child.id || `${item.id}-child-${index}`"
                :item="child"
                :parent-id="`#${item.id}`"
                :depth="depth + 1"
                @toggle-mobile="$emit('toggle-mobile')"
            />
        </ul>
    </li>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { chevronRight } from '../../composables/use-navigation';

const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    parentId: {
        type: String,
        default: '#sidebar'
    },
    depth: {
        type: Number,
        default: 0
    }
});

defineEmits(['toggle-mobile']);

const route = useRoute();
const { t } = useI18n();

// Check if current route is active
const isActive = computed(() => {
    if (props.item.type === 'single' && props.item.to) {
        return route.path === props.item.to;
    }
    return false;
});

// Get label (support i18n keys)
const getLabel = (label) => {
    // Check if label is an i18n key (lowercase with underscores)
    if (label && /^[a-z_]+$/.test(label)) {
        return t(label);
    }
    return label;
};
</script>

<style scoped>
/* Add any custom styles for nav items here */
.menu.active > a {
    color: var(--primary);
}

/* Indent nested items based on depth */
.submenu .menu {
    padding-left: calc(var(--depth, 0) * 1rem);
}
</style>
