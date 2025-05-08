/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
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
        "gray-custom": "#5F5F5F",
        "brown-custom": "#94551D",
        "label-custom": "#5F5F5F"
      },
    },
    backgroundColor: (theme) => ({
      ...theme("colors"),
      "kuning-emas": "#B7B78A",
      "emas-gradient": "#51513D",
      "green-muda": "#658864",
      "green-tua": "#3B513B",
      "bg-custom": "#DDDDDD",
      "bg-card": "#EEEEEE",
      "green-date": "#9FB298",
      "gray-custom": "#5F5F5F",
      "brown-custom": "#94551D",
      "dark-bg": "#19221A",
      "dark-mode": "#212C21",


    }),
  },
  plugins: [],
};
