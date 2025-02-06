/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Set Poppins sebagai default font sans
      },
      colors: {
        "kuning-emas": "#B7B78A",
        "emas-gradient": "#51513D",
        "green-muda": "#658864",
        "green-tua": "#3B513B",
      },
    },
    backgroundColor: (theme) => ({
      ...theme("colors"),
      "kuning-emas": "#B7B78A",
      "emas-gradient": "#51513D",
      "green-muda": "#658864",
      "green-tua": "#3B513B",
      "grey-home": "#DDDDDD",
      "green-date": "#9FB298",
    }),
  },
  plugins: [],
};
