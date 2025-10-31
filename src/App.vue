<template>
    <div :class="[$store.state.layout_style, $store.state.menu_style]" :dir="isRTL ? 'rtl' : 'ltr'">
        <component v-bind:is="layout"></component>
    </div>
</template>
<script setup>
    import { computed, watch } from "vue";
    import { useI18n } from "vue-i18n";

    import "./assets/sass/app.scss";

    import { useMeta } from "./composables/use-meta";
    import { useStore } from "vuex";

    useMeta({ title: "Sales Admin" });

    const store = useStore();
    const { locale } = useI18n();

    const layout = computed(() => {
        return store.getters.layout;
    });

    // RTL support for Arabic language
    const isRTL = computed(() => {
        return locale.value === 'ar';
    });

    // Watch for locale changes and update document direction
    watch(locale, (newLocale) => {
        const direction = newLocale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', direction);
        document.documentElement.setAttribute('lang', newLocale);
    }, { immediate: true });
</script>
<script>
    // layouts
    import appLayout from "./layouts/app-layout.vue";
    import authLayout from "./layouts/auth-layout.vue";

    export default {
        components: {
            app: appLayout,
            auth: authLayout,
        },
    };
</script>
