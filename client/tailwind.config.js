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
        // New colors
        blue: "#007bff",
        // indigo: "#6610f2",
        // purple: "#6f42c1",
        // pink: "#e83e8c",
        red: "#dc3545",
        // orange: "#fd7e14",
        // yellow: "#ffc107",
        green: "#28a745",    
        // cyan: "#17a2b8",
        // white: "#fff",
        // gray: "#6c757d",
        // graydark: "#343a40",
        primary: "#3454d1",
        // secondary: "#6c757d",
        // success: "#28a745",
        // info: "#17a2b8",
        // warning: "#ffc31d",
        // danger: "#dc3545",
        // light: "#f9f9f8",
        dark: "#111",
        title: "#002247",
        subTitle: "#495057",
    }
    ,
    },
  },
  plugins: [],
};
