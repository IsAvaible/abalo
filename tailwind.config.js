/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.ts",
        "./resources/**/*.vue",
    ],
    theme: {
        extend: {
            transitionProperty: {
                'height': 'height',
                'width': 'width',
                'padding': 'padding',
            },
            textShadow: {
                semibold: '0 0 0.5px var(--tw-shadow-color)',
                bold: '0 0 1px var(--tw-shadow-color)',
                sm: '0 1px 2px var(--tw-shadow-color)',
                md: '0 2px 4px var(--tw-shadow-color)',
                lg: '0 8px 16px var(--tw-shadow-color)',
            },
        }
    },
    plugins: [
        require('@tailwindcss/container-queries'),
        plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    'text-shadow': (value) => ({
                        textShadow: value,
                    }),
                },
                { values: theme('textShadow') }
            )
        }),
    ],
}

