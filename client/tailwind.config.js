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
          paper: '#F2F1EC',
          stone: '#E7E5DE',
          surface: '#FAF9F6',
          ink: '#111111',
          charcoal: '#1C1C1A',
          muted: '#6E6D68',
          line: '#D6D4CC',
          'line-dark': '#2A2A27',
          signal: '#E63B19',
          'signal-dark': '#C42E10',
        }
      },
      fontFamily: {
        display: ['"Archivo"', 'system-ui', 'sans-serif'],
        serif: ['"Archivo"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'none': '0px',
        'xs': '2px',
        'sm': '4px',
      }
    },
  },
  plugins: [],
}
