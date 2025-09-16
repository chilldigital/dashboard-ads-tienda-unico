/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      boxShadow: { soft: "0 10px 30px -12px rgba(0,0,0,0.15)" },
    },
  },
  plugins: [],
};