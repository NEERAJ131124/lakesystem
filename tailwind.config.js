/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'carp': {
          50: '#f3f7f4',
          100: '#e7efe9',
          200: '#c3d7c8',
          300: '#9fbfa7',
          400: '#78a783',
          500: '#528f5f',
          600: '#3C6E47', // Our primary "carp green"
          700: '#2c5235',
          800: '#1d3623',
          900: '#0e1b12',
        },
        'sand': {
          50: '#fcfaf7',
          100: '#f9f5ef',
          200: '#f0e6d7',
          300: '#e7d7bf',
          400: '#d4b88f',
          500: '#c19960',
          600: '#ae7a31',
          700: '#825c25',
          800: '#573d19',
          900: '#2b1f0c',
        }
      },
    },
  },
  plugins: [],
}

