module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        bg: '#F3F0E8', surface: '#FFFFFF', ink: '#1A1814', 'ink-muted': '#6B655C',
        primary: { DEFAULT: '#3A5A40', soft: '#E2E8E1', strong: '#2A4230' },
        straw: '#C4A574', soil: '#8B6914', border: '#E0D9CC',
      },
      fontFamily: {
        display: ['Literata', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
