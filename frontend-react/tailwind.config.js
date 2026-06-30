/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102033",
        cloud: "#f6f8fb",
        line: "#e3e8ef",
        brand: "#1455d9",
        mint: "#0e9f6e",
        amber: "#b7791f",
        rose: "#c2415d"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(16, 32, 51, 0.08)"
      }
    },
  },
  plugins: [],
};
