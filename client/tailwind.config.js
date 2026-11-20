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
          canvas: '#F7F8FA',
          surface: '#FFFFFF',
          mist: '#ECEFF4',
          ink: '#1D2129',
          charcoal: '#23272F',
          slate: '#4F627A',
          muted: '#647082',
          line: '#E2E7EE',
          'line-dark': '#2E3440',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        serif: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'tc-studio': '0 1px 2px rgba(29, 33, 41, 0.04), 0 8px 24px -12px rgba(29, 33, 41, 0.08)',
        'tc-lift': '0 12px 32px -12px rgba(29, 33, 41, 0.14)',
      }
    },
  },
  plugins: [],
}
