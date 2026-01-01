/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom Yellow Theme
        yellow: {
          primary: "#FFD700",
          hover: "#FFC700",
          light: "#FFF9E6",
          dark: "#E6C200",
        },
        // Custom Gray Scale
        gray: {
          dark: "#4A4A4A",
          medium: "#808080",
          light: "#E5E5E5",
          lighter: "#F5F5F5",
        },
        // Black & White
        black: "#000000",
        white: "#FFFFFF",
      },
      fontFamily: {
        // Tajawal as default Arabic font
        sans: ["Tajawal", "sans-serif"],
        tajawal: ["Tajawal", "sans-serif"],
      },
      borderRadius: {
        // Reduced border radius
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        none: "none",
      },
      animation: {
        "spin-slow": "spin 1s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
