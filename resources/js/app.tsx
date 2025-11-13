import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: (name) => {
        // Look for .tsx and .jsx in ./pages/
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: false });

        const path = `./pages/${name}.tsx`;

        if (pages[path]) {
            return pages[path]();
        }

        console.error('Page not found:', name);
        console.log('Looking for:', path);
        console.log('Available:', Object.keys(pages));

        throw new Error(`Page not found: ${name}`);
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },

    progress: { color: '#4B5563' },
});

initializeTheme();