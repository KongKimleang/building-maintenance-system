/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1d4ed8',
        secondary: '#475569',
        success: '#059669',
        warning: '#d97706',
        danger: '#dc2626',
      },
    },
  },
  plugins: [],
};
