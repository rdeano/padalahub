import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const appName = import.meta.env.VITE_APP_NAME || 'PadalaHub';

const theme = createTheme({
    palette: {
        primary: { main: '#0077FF', light: '#4da6ff', dark: '#0055cc', contrastText: '#fff' },
        secondary: { main: '#00C2FF', contrastText: '#fff' },
        success: { main: '#00C48C', light: '#e6faf4', dark: '#00956a' },
        background: { default: '#f0f4ff', paper: '#ffffff' },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 800 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600 },
        button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
    },
    shape: { borderRadius: 16 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 50,
                    padding: '12px 28px',
                    boxShadow: 'none',
                    '&:hover': { boxShadow: '0 4px 16px rgba(0,119,255,0.3)' },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #0077FF 0%, #00C2FF 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, #0055cc 0%, #009ecc 100%)' },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': { borderRadius: 12 },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: { borderRadius: 12 },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { borderRadius: 8, fontWeight: 600 },
            },
        },
    },
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#1565c0',
    },
});
