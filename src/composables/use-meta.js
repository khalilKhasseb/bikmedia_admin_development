import { useHead } from '@vueuse/head';
import { unref, computed } from 'vue';

let siteTitle = 'Bikmedia Admin';
let separator = '|';

export const usePageTitle = (pageTitle) =>
    useHead(
        computed(() => ({
            title: `${unref(pageTitle)} ${separator} ${siteTitle}`,
        }))
    );

export const useMeta = (data) => {
    const title = data.title ? `${data.title} | ${siteTitle}` : siteTitle;
    const description = data.description || 'Bikmedia platform administration dashboard';
    const keywords = data.keywords || 'bikmedia, admin, dashboard, analytics';
    
    return useHead({ 
        title,
        meta: [
            { name: 'description', content: description },
            { name: 'keywords', content: keywords },
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description }
        ]
    });
};
