/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        novaire: {
          bg: '#fcfcfd',
          surface: '#ffffff',
          muted: '#f5f5f7',
          subtle: '#e8e8ed',
          border: '#e5e5ea',
          text: '#111113',
          secondary: '#6e6e73',
          tertiary: '#8e8e93',
          black: '#0a0a0c',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'subtle': '0 2px 12px rgba(0, 0, 0, 0.04)',
        'elevated': '0 12px 36px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
