/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    blue: '#2C5AA0',
                },
                secondary: {
                    teal: '#0D9276',
                },
                accent: {
                    orange: '#D97706',
                    hover: '#EA580C',
                },
                background: {
                    light: '#F8FAFC',
                },
                text: {
                    dark: '#1E293B',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Plus Jakarta Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
