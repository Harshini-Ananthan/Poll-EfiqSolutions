/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#16A34A",
        brand: "#2563EB",
      },
      fontFamily: {
        orbitron: ["Orbitron_400Regular"],
        manrope: ["Manrope_400Regular"],
      }
    },
  },
  plugins: [],
}
