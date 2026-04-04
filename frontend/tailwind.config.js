/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sora)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        rose: {
          50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3',
          400: '#fb7185', 500: '#f43f5e', 600: '#e11d48',
          700: '#be123c', 900: '#881337',
        },
      },
    },
  },
  plugins: [],
}
