/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        'custom-orange': {
          500: '#FF5722',
        },
        'custom-red': {
          500: '#D43F3F',
        },
      },
    },
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  plugins: [],
}

