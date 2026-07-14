/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { ink: '#17211f', paper: '#f8faf9', brand: { 50: '#effcf8', 100: '#d7f8ee', 200: '#afeedc', 500: '#16a085', 600: '#0f8a72', 700: '#0f766e', 800: '#115e59', 900: '#134e4a' } },
      boxShadow: { soft: '0 20px 60px -28px rgba(15, 118, 110, .28)' },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
}
