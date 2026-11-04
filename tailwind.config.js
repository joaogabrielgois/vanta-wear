/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vanta: {
          black: '#0a0a0a',
          ink: '#141414',
          white: '#f4f2ee',
          bone: '#d8d3ca',
          stone: '#8a847b',
          red: '#7a0f1c',
          blood: '#a3141f',
        },
      },
      fontFamily: {
        display: ['"Anton"', 'Impact', 'Haettenschweiler', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
