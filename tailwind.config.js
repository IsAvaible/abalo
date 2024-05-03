/** @type {import('tailwindcss').Config} */
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
        }
    },
    plugins: [
        require('@tailwindcss/container-queries'),
    ],
}

