import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import vueI18n from "@intlify/vite-plugin-vue-i18n";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    
    // Configure base URL for GitHub Pages deployment
    const isProduction = mode === 'production';
    const baseUrl = isProduction ? '/bikmedia_admin_development/' : '/';
    
    return {
    base: "./",
    plugins: [
        vue(),
        vueI18n({
            include: path.resolve(__dirname, "./src/locales/**"),
        }),
    ],

    server: {
        proxy: {
            '/api': {
                target: (() => {
                    let baseUrl = env.VITE_BASE_API_URL;
                    let url;
                    
                    // Parse URL to extract origin (protocol + host + port)
                    if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
                        url = new URL(baseUrl);
                    } else {
                        url = new URL('http://' + baseUrl);
                    }
                    
                    // Return origin only (no path)
                    return `${url.protocol}//${url.host}`;
                })(),
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/dashboard')
            },
            '/apiAdmin': {
                target: (() => {
                    let baseUrl = env.VITE_BASE_API_URL;
                    let url;
                    
                    // Parse URL to extract origin (protocol + host + port)
                    if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
                        url = new URL(baseUrl);
                    } else {
                        url = new URL('http://' + baseUrl);
                    }
                    
                    // Return origin only (no path)
                    return `${url.protocol}//${url.host}`;
                })(),
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/apiAdmin/, '/admin')
            }
        }
    },
    // Build configuration optimized for GitHub Pages
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: isProduction,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['vue', 'vue-router'],
                    ui: ['quill', 'nouislider']
                }
            }
        }
    },
    optimizeDeps: {
        include: ["quill", "nouislider"],
    },
    resolve: {
        alias: [
            {
                find: /^~(.*)$/,
                replacement: "node_modules/$1",
            },

            {
                find: /^@services(.*)$/,
                replacement: `${path.resolve(__dirname, './src/services')}$1`,
            },
            {
                find: '@/',
                replacement: `${path.resolve(__dirname, './src')}/`,
            },
            // { 
            //     "@": path.resolve(__dirname, ".src/"),
            // },
        ],
    },
    };
});
