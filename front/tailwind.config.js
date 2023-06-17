/** @type {import('tailwindcss').Config} */
export default {
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
                },
            },
        ],
    },
    plugins: [require("daisyui")],
};
