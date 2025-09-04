/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Active le mode sombre basé sur les classes CSS
  theme: {
    extend: {
      colors: {
        'custom-blue': '#3c77a1',
        'custom-blue-dark': '#2d5a7a',
        'custom-blue-light': '#4a8bb8',
      },
      backgroundImage: {
        'gradient-custom-blue': 'linear-gradient(135deg, #3c77a1 0%, #2d5a7a 100%)',
        'gradient-custom-blue-dark': 'linear-gradient(135deg, #2d5a7a 0%, #1e3d5a 100%)',
        'gradient-custom-blue-light': 'linear-gradient(135deg, #4a8bb8 0%, #3c77a1 100%)',
      },
    },
  },
  plugins: [],
}