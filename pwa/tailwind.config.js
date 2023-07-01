/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {},
    daisyui: {
        themes: [
            {
                light: {
                    ...require("daisyui/src/theming/themes")[
                        "[data-theme=light]"
                    ],
                    primary: "#1DBF73",
                    secondary: "#74767E",
                    "primary-content": "#FFFFFF",
                    "secondary-content": "#FFFFFF",
                    "dark-green": "#009F55",
                },
            },
        ],
    },
    plugins: [require("daisyui")],
};
