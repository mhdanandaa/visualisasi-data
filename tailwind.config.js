/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Set Poppins sebagai default font sans
      },
      colors: {},
    },
    backgroundColor: (theme) => ({
      ...theme("colors"),
      "green-pastel": "#D7F6EA",
    }),
  },
  plugins: [],
};
