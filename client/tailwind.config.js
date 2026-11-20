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
          primary: '#0B5FFF',
          'primary-hover': '#0847C4',
          'primary-soft': '#EEF4FF',
          'primary-border': '#C7DCFF',
          ink: '#0B1220',
          'ink-soft': '#162238',
          canvas: '#F4F6FA',
          surface: '#FFFFFF',
          stage: '#EEF2F7',
          border: '#E2E8F0',
          accent: '#F97316',
          'accent-soft': '#FFF7ED',
          success: '#059669',
          danger: '#E11D48',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        serif: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.75rem',
      },
      boxShadow: {
        'tc-card': '0 1px 3px rgba(11, 18, 32, 0.04), 0 6px 20px rgba(11, 18, 32, 0.04)',
        'tc-hover': '0 10px 30px rgba(11, 95, 255, 0.10), 0 4px 12px rgba(11, 18, 32, 0.06)',
        'tc-float': '0 18px 44px rgba(11, 18, 32, 0.16)',
        'tc-primary': '0 8px 22px rgba(11, 95, 255, 0.28)',
      }
    },
  },
  plugins: [],
}
