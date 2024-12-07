/** @type {import('tailwindcss').Config} */

// My own styles
const stylesConfig = require("./src/js/styles.config");

export default {
  content: [
    './index.html',
    './src/**/*.{html,js}',
    {
      raw: `<a class="active"></a>`,
    }
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0284c7", // Primary color
          light: "#0ea5e9",  // Lighter shade
        },
      },
    },
  },
  safelist: [
    {
      pattern: /^(border|p-\d|rounded-md|shadow-lg|bg-\w+|text-lg|font-bold|mb-\d|animate)$/,
      variants: ["hover", "focus"], // Optional: Include hover and focus variants
    },
  ],
  plugins: [
    require('@tailwindcss/forms'),
    stylesConfig
  ],
}
