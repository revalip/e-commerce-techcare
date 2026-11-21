/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tc: {
          white: '#FFFFFF',
          canvas: '#FFFFFF',
          surface: '#FFFFFF',
          mist: '#F5F5F7',
          black: '#000000',
          ink: '#1D1D1F',
          charcoal: '#1D1D1F',
          slate: '#424245',
          muted: '#6E6E73',
          line: '#D2D2D7',
          'line-dark': '#333336',
          blue: '#0071E3',
          'blue-hover': '#0077ED',
          alert: '#B64400',
        }
      },
      fontFamily: {
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Inter"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
        serif: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Inter"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Inter"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
        mono: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Inter"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
      borderRadius: {
        tile: '28px',
        pill: '980px',
        input: '12px',
      },
      boxShadow: {
        'tc-studio': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'tc-lift': '0 2px 12px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
