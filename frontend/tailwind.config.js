/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#0f172a',
        panelSoft: '#111c36',
        accent: '#38bdf8',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(148, 163, 184, 0.1), 0 18px 40px rgba(2, 6, 23, 0.45)',
      },
    },
  },
  plugins: [],
};
