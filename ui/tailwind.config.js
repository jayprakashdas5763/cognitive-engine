module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'space': '#0a0e27',
        'surface': '#1a1f3a',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
