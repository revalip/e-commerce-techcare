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
          ink: '#1D1D1F',
          charcoal: '#1D1D1F',
          slate: '#424245',
          muted: '#6E6E73',
          line: '#D2D2D7',
          'line-dark': '#333336',
          blue: '#0071E3',
          'blue-hover': '#0077ED',
        }
      },
      fontFamily: {
        display: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'sans-serif'],
        serif: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'sans-serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        tile: '28px',
      },
      boxShadow: {
        'tc-studio': '0 1px 2px rgba(29, 29, 31, 0.04), 0 6px 20px -10px rgba(29, 29, 31, 0.07)',
        'tc-lift': '0 12px 28px -12px rgba(29, 29, 31, 0.12)',
      }
    },
  },
  plugins: [],
}
