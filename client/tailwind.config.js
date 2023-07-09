/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: "#2C7A7B", // Teal
        steelblue: "#498AA0", // Steel Blue
        seagreen: "#3B8686", // Sea Green
        slategray: "#6C8A8D", // Slate Gray
        cadetblue: "#546A7B", // Cadet Blue
        darkteal: "#335252", // Dark Teal
        steelteal: "#7397A9", // Steel Teal
        grayishteal: "#95A5A6", // Grayish Teal
        darkslategray: "#4C787E", // Dark Slate Gray
        grayishslate: "#5E7D7E", // Grayish Slate
      },
    },
  },
  plugins: [],
};
