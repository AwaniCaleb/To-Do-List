import { defineConfig } from 'vite';

export default defineConfig({
    // Base configuration
    base: './', // For GitHub Pages deployment (if necessary)
    server: {
        // port: 3000, // Specify the dev server port if needed
    },
    css: {
        preprocessorOptions: {
            css: {
                additionalData: `@import "./src/css/main.css";`,
            },
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: './index.html',
            }
        }
    }
});
